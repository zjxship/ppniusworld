/* ============================================================
 * ppniusworld · 主程序
 * ------------------------------------------------------------
 * 纯 HTML + CSS + JavaScript，无框架。
 * 结构：
 *   1. 小工具 / 本地存储
 *   2. 路由与页面外壳
 *   3. 首页：Scrollytelling 三段式视频 + 鼠标追视 + 四个专区入口
 *   4. 专区页：滚动卡片流
 *   5. 大图预览：3D 翻转卡片 + 可编辑文字（自动保存）
 *   6. ID Card 页面
 *   7. 空白简历页面
 * ============================================================ */
(function () {
  'use strict';

  /* ==========================================================
   * 1. 小工具 / 本地存储
   * ========================================================== */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const clone = obj => JSON.parse(JSON.stringify(obj));
  const uid = prefix => prefix + '-' + Math.random().toString(36).slice(2, 8);
  const esc = value => String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  let reducedCache = null;
  const reduced = () => {
    if (reducedCache === null) reducedCache = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return reducedCache;
  };

  const KEYS = {
    notes: 'ppniusworld.notes.v1',
    idCard: 'ppniusworld.idcard.v1',
    resume: 'ppniusworld.resume.v1'
  };

  // localStorage 在 file:// 下可能不可用，用内存兜底，保证不报错。
  const memoryFallback = {};
  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (error) {
        return key in memoryFallback ? memoryFallback[key] : fallback;
      }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) { /* ignore */ }
      memoryFallback[key] = value;
    }
  };

  const GALLERY = window.PPNIUS_GALLERY || { sections: [], photos: {} };
  const PROFILE = window.PPNIUS_PROFILE || {};

  const state = {
    notes: store.get(KEYS.notes, {}) || {},
    idCard: store.get(KEYS.idCard, null) || clone(PROFILE.idCard || { fields: [] }),
    resume: store.get(KEYS.resume, null) || clone(PROFILE.resume || { sections: [] }),
    lightbox: null,   // { zoneId, index, flipped, size }
    hero: null,       // 首页控制器
    pendingNote: 0
  };

  const saveNotesDebounced = () => {
    clearTimeout(state.pendingNote);
    state.pendingNote = setTimeout(() => store.set(KEYS.notes, state.notes), 220);
  };

  const sectionById = id => GALLERY.sections.find(item => item.id === id);
  const runtimePhotos = {};   // 从 GitHub 文件夹自动读到的照片
  const photosOf = id => runtimePhotos[id] || ((GALLERY.photos && GALLERY.photos[id]) || []);
  const noteKey = (zoneId, photoId) => zoneId + '::' + photoId;
  const getNote = (zoneId, photoId) => state.notes[noteKey(zoneId, photoId)] || '';
  const setNote = (zoneId, photoId, text) => {
    state.notes[noteKey(zoneId, photoId)] = text;
    saveNotesDebounced();
  };

  /* ==========================================================
   * 2. 路由与页面外壳
   * ========================================================== */
  const app = document.getElementById('app');

  function parseRoute() {
    const raw = location.hash.replace(/^#\/?/, '');
    const parts = raw.split('/').filter(Boolean);
    if (parts[0] === 'gallery' && parts[1]) return { name: 'gallery', zoneId: parts[1] };
    if (parts[0] === 'id-card') return { name: 'id-card' };
    if (parts[0] === 'resume') return { name: 'resume' };
    return { name: 'home' };
  }

  function go(hash) {
    if (location.hash === hash) render();
    else location.hash = hash;
  }

  function navActive(route) {
    if (route.name === 'home') return 'home';
    if (route.name === 'gallery') return route.zoneId;
    return route.name;
  }

  function renderNav(route) {
    const active = navActive(route);
    const links = GALLERY.sections.map(section => `
      <a class="nav-link ${active === section.id ? 'is-active' : ''}" href="#/gallery/${section.id}">${esc(section.title)}</a>
    `).join('');
    return `
      <header class="nav">
        <div class="nav-inner">
          <a class="nav-brand" href="#/">
            <span class="nav-mark">✦</span>
            <span class="nav-word">${esc(GALLERY.brand || 'ppniusworld')}</span>
          </a>
          <nav class="nav-links" id="nav-links">
            <a class="nav-link ${active === 'home' ? 'is-active' : ''}" href="#/">HOME</a>
            ${links}
            <span class="nav-sep"></span>
            <a class="nav-link ${active === 'id-card' ? 'is-active' : ''}" href="#/id-card">ID CARD</a>
            <a class="nav-link ${active === 'resume' ? 'is-active' : ''}" href="#/resume">RESUME</a>
          </nav>
          <button class="nav-toggle" data-action="toggle-nav" aria-label="打开菜单" aria-expanded="false">
            <span class="nav-bars" aria-hidden="true"><i></i><i></i></span>
            <span class="nav-toggle-label">MENU</span>
          </button>
        </div>
      </header>`;
  }

  let lastRouteKey = '';

  function render() {
    closeLightbox();
    destroyHero();
    const route = parseRoute();
    const routeKey = location.hash || '#/';
    document.body.dataset.route = route.name;

    let view = '';
    if (route.name === 'gallery') view = viewGallery(route.zoneId);
    else if (route.name === 'id-card') view = viewIdCard();
    else if (route.name === 'resume') view = viewResume();
    else view = viewHome();

    app.innerHTML = renderNav(route) + `<main class="view" id="view">${view}</main>`;

    if (route.name === 'home') mountHero();
    if (route.name === 'gallery') hydrateAutoList(route.zoneId);
    if (route.name === 'id-card') bindEditableSection('#id-sheet', onIdCardInput);
    if (route.name === 'resume') bindEditableSection('#resume-sheet', onResumeInput);

    document.body.classList.remove('nav-open');
    if (routeKey !== lastRouteKey) {
      lastRouteKey = routeKey;
      window.scrollTo(0, 0);
    }
  }

  window.addEventListener('hashchange', render);

  /* ==========================================================
   * 3. 首页
   * ========================================================== */
  const HERO_VIDEOS = {
    intro: 'assets/videos/intro-loop.mp4',
    main: 'assets/videos/main.mp4',
    outro: 'assets/videos/outro-loop.mp4'
  };

  // 三个关键节奏点（滚动进度 → 文案，每句 15～30 字）
  const HERO_BEATS = [
    { from: 0.00, to: 0.34, text: '把喜欢的东西，一件一件收进自己的小世界。' },
    { from: 0.34, to: 0.68, text: '照片、文字、线条和画面，都在这里慢慢长出来。' },
    { from: 0.68, to: 1.00, text: '这里是 ppniusworld，欢迎来看看我做的事。' }
  ];

  const GAZE = ['center', 'left', 'right', 'up', 'down'];

  // 首屏滚动高度：按 main 视频时长换算，但压到 3～5 屏，
  // 否则 10 秒的视频要滚 10 屏才能看到专区入口。
  const HERO_SCREENS = { factor: 0.3, min: 3, max: 5 };

  function zonesMarkup() {
    return GALLERY.sections.map((section, index) => {
      const isBook = section.kind === 'book';
      const count = photosOf(section.id).length;
      const inner = isBook ? `
        <span class="book">
          <span class="book-pages"></span>
          <span class="book-spine"></span>
          <span class="book-cover" style="background-image:url('${esc(section.cover || '')}')">
            <span class="book-shine"></span>
            <span class="book-label">
              <em>${esc(section.kicker || '')}</em>
              <strong>${esc(section.title)}</strong>
            </span>
          </span>
          <span class="book-floor"></span>
        </span>` : `
        <span class="zone-card" style="background-image:url('${esc(section.cover || '')}')">
          <span class="zone-card-veil"></span>
          <span class="zone-card-label">
            <em>${esc(section.kicker || '')}</em>
            <strong>${esc(section.title)}</strong>
          </span>
        </span>`;
      return `
        <a class="zone ${isBook ? 'zone-book' : 'zone-cardtype'}" href="#/gallery/${esc(section.id)}"
           style="--zone-color:${esc(section.color || '#f6d8d3')}; --i:${index}"
           data-action="open-zone" data-zone="${esc(section.id)}" aria-label="进入 ${esc(section.title)}">
          <span class="zone-visual">${inner}</span>
          <span class="zone-meta">
            <span class="zone-title-row"><strong>${esc(section.title)}</strong><em>${count} pieces</em></span>
            <span class="zone-sub">${esc(section.subtitle || '')}</span>
            <span class="zone-blurb">${esc(section.blurb || '')}</span>
            <span class="zone-open">${isBook ? '翻开这本小书 →' : '进入专区 →'}</span>
          </span>
        </a>`;
    }).join('');
  }

  // 首页作品预览：摄影多取几张，其它专区各取一张
  function workPicks() {
    const picks = [];
    photosOf('photography').slice(0, 6).forEach((photo, index) => picks.push({ zone: 'photography', photo, index }));
    GALLERY.sections.filter(section => section.id !== 'photography').forEach(section => {
      const list = photosOf(section.id);
      if (list.length) picks.push({ zone: section.id, photo: list[0], index: 0 });
    });
    return picks;
  }

  function workPreviewMarkup() {
    const picks = workPicks();
    if (!picks.length) return '<p class="work-empty">还没有作品，去 data/gallery.js 里加图吧。</p>';
    return picks.map(pick => `
      <button class="work-card" data-action="open-lightbox" data-zone="${esc(pick.zone)}" data-index="${pick.index}"
              style="--ratio:${((pick.photo.w || 4) / (pick.photo.h || 3)).toFixed(4)}"
              aria-label="预览 ${esc(pick.photo.title || '')}">
        <img src="${esc(pick.photo.thumb || pick.photo.src)}" alt="${esc(pick.photo.title || '')}" loading="lazy" decoding="async" />
      </button>`).join('');
  }

  function viewHome() {
    const companion = GAZE.map(name => `
      <img class="gaze-layer ${name === 'center' ? 'is-active' : ''}" data-gaze="${name}"
           src="assets/characters/gaze/gaze-${name}.png" alt="" aria-hidden="true" />
    `).join('');

    const captions = HERO_BEATS.map((beat, index) => `
      <p class="hero-caption ${index === 0 ? 'is-active' : ''}" data-beat="${index}">${esc(beat.text)}</p>
    `).join('');

    return `
      <section class="hero" id="hero">
        <div class="hero-track" id="hero-track" aria-hidden="true"></div>
        <div class="hero-stage" id="hero-stage">
          <div class="hero-videos" id="hero-videos">
            <video class="hero-video" data-layer="intro" src="${HERO_VIDEOS.intro}" muted loop playsinline webkit-playsinline preload="auto"></video>
            <video class="hero-video" data-layer="main" src="${HERO_VIDEOS.main}" muted playsinline webkit-playsinline preload="auto"></video>
            <video class="hero-video" data-layer="outro" src="${HERO_VIDEOS.outro}" muted loop playsinline webkit-playsinline preload="auto"></video>
          </div>
          <div class="hero-paper" aria-hidden="true"></div>
          <div class="hero-veil" aria-hidden="true"></div>

          <div class="hero-copy" id="hero-copy">
            <p class="hero-eyebrow">portfolio · twilightppnius</p>
            <h1 class="hero-title">${esc(GALLERY.brand || 'ppniusworld')}</h1>
            <p class="hero-sub">${esc(GALLERY.tagline || '')}</p>
          </div>

          <div class="hero-companion" id="hero-companion" aria-hidden="true">${companion}</div>

          <div class="hero-captions" id="hero-captions">${captions}</div>

          <div class="hero-hint"><span class="hero-hint-line"></span>scroll · 向下滚动进入四个专区</div>
          <button class="hero-skip" data-action="skip-hero">跳过 · 直接看作品 ↓</button>
        </div>
      </section>

      <section class="home-content">
        <header class="home-head">
          <p class="kicker">THE COLLECTION</p>
          <h2>Four little rooms.</h2>
          <p class="home-head-sub">文字、摄影、设计、剪辑 —— 选一间进去看看。</p>
        </header>
        <div class="zones">${zonesMarkup()}</div>

        <section class="home-work">
          <header class="home-work-head">
            <p class="kicker">SELECTED WORK</p>
            <h2>Recent pictures.</h2>
            <a class="text-link" href="#/gallery/photography">看全部摄影 →</a>
          </header>
          <div class="work-strip">${workPreviewMarkup()}</div>
        </section>

        <footer class="site-foot">
          <span>${esc(GALLERY.brand || 'ppniusworld')}</span>
          <span>made slowly, with paper and light</span>
          <a href="#/id-card">ID CARD</a>
          <a href="#/resume">RESUME</a>
        </footer>
      </section>`;
  }

  function destroyHero() {
    if (!state.hero) return;
    const hero = state.hero;
    cancelAnimationFrame(hero.raf);
    window.removeEventListener('scroll', hero.onScroll, { passive: true });
    window.removeEventListener('pointermove', hero.onPointer);
    window.removeEventListener('resize', hero.onResize);
    hero.videos.forEach(video => { try { video.pause(); } catch (error) { /* ignore */ } });
    state.hero = null;
  }

  function mountHero() {
    const stage = $('#hero-stage');
    const track = $('#hero-track');
    if (!stage || !track) return;

    const videos = {
      intro: $('.hero-video[data-layer="intro"]', stage),
      main: $('.hero-video[data-layer="main"]', stage),
      outro: $('.hero-video[data-layer="outro"]', stage)
    };

    Object.values(videos).forEach(video => {
      if (!video) return;
      video.muted = true;          // 保证可以自动播放
      video.playsInline = true;    // iOS Safari
      video.setAttribute('playsinline', '');
    });

    const hero = {
      stage, track, videos,
      progress: 0, target: 0,
      mouseX: 0, mouseY: 0, // -1 ~ 1
      curX: 0, curY: 0,
      screens: 5,
      duration: 6,
      ready: false,
      gaze: 'center',
      raf: 0,
      onScroll: null, onPointer: null, onResize: null
    };
    state.hero = hero;

    // 页面高度 = main 视频时长 × 100vh（限制在 3～14 屏，避免过短或过长）
    const measure = () => {
      const d = (videos.main && isFinite(videos.main.duration)) ? videos.main.duration : 6;
      hero.duration = d;
      hero.screens = clamp(Math.round(d * HERO_SCREENS.factor), HERO_SCREENS.min, HERO_SCREENS.max);
      track.style.height = (hero.screens * 100) + 'vh';
    };
    hero.onResize = measure;
    window.addEventListener('resize', hero.onResize);
    measure();
    if (videos.main) {
      videos.main.addEventListener('loadedmetadata', measure, { once: true });
    }

    // 视频全部加载失败时（比如还没放素材），页面退化为纸纹背景
    let failed = 0;
    Object.keys(videos).forEach(key => {
      const video = videos[key];
      if (!video) return;
      video.addEventListener('error', () => {
        failed += 1;
        if (failed === 3) stage.classList.add('is-fallback');
      });
    });

    // 三段视频：intro / outro 自动播放循环，main 由滚动驱动
    if (videos.intro) videos.intro.play().catch(() => {});
    if (videos.outro) videos.outro.pause();

    hero.onScroll = () => {
      const total = hero.track.offsetHeight - window.innerHeight;
      hero.target = clamp(total > 0 ? window.scrollY / total : 0, 0, 1);
    };
    window.addEventListener('scroll', hero.onScroll, { passive: true });
    hero.onScroll();

    hero.onPointer = event => {
      if (reduced()) return;
      hero.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      hero.mouseY = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', hero.onPointer, { passive: true });

    const layers = {
      intro: $('.hero-video[data-layer="intro"]', stage),
      main: $('.hero-video[data-layer="main"]', stage),
      outro: $('.hero-video[data-layer="outro"]', stage)
    };
    const companion = $('#hero-companion', stage);
    const copy = $('#hero-copy', stage);
    const captions = $$('.hero-caption', stage);

    const setGaze = name => {
      if (hero.gaze === name) return;
      hero.gaze = name;
      $$('.gaze-layer', companion).forEach(layer => {
        layer.classList.toggle('is-active', layer.dataset.gaze === name);
      });
    };

    let lastSeek = -1;
    const loop = () => {
      hero.raf = requestAnimationFrame(loop);

      // 进度缓动，滚动更顺滑
      hero.progress = lerp(hero.progress, hero.target, reduced() ? 1 : 0.12);
      if (Math.abs(hero.progress - hero.target) < 0.0005) hero.progress = hero.target;
      const p = hero.progress;

      // 鼠标缓动
      hero.curX = lerp(hero.curX, hero.mouseX, 0.08);
      hero.curY = lerp(hero.curY, hero.mouseY, 0.08);

      // 三段视频 opacity（CSS 里 transition: opacity .5s）
      const FADE = 0.02;
      if (layers.intro) layers.intro.style.opacity = p <= FADE ? '1' : '0';
      if (layers.main) layers.main.style.opacity = (p > FADE && p < 1 - FADE) ? '1' : '0';
      if (layers.outro) layers.outro.style.opacity = p >= 1 - FADE ? '1' : '0';

      // main 视频由滚动进度驱动
      const main = layers.main;
      if (main && hero.duration) {
        const t = clamp(p * hero.duration, 0, Math.max(0, hero.duration - 0.05));
        if (Math.abs(t - lastSeek) > 0.03) {
          try { main.currentTime = t; } catch (error) { /* ignore */ }
          lastSeek = t;
        }
      }
      if (layers.intro) { if (p <= FADE) { if (layers.intro.paused) layers.intro.play().catch(() => {}); } else if (!layers.intro.paused) layers.intro.pause(); }
      if (layers.outro) { if (p >= 1 - FADE) { if (layers.outro.paused) layers.outro.play().catch(() => {}); } else if (!layers.outro.paused) layers.outro.pause(); }

      // 鼠标追视：视差位移 + 眼神切换
      if (companion) {
        const shift = reduced() ? 0 : 1;
        companion.style.transform = `translate3d(${(-hero.curX * 26 * shift).toFixed(2)}px, ${(-hero.curY * 18 * shift).toFixed(2)}px, 0)`;
        companion.style.opacity = String(clamp(1 - (p - 0.10) / 0.28, 0, 1));
        const ax = Math.abs(hero.curX), ay = Math.abs(hero.curY);
        if (ax < 0.2 && ay < 0.2) setGaze('center');
        else if (ax > ay) setGaze(hero.curX < 0 ? 'left' : 'right');
        else setGaze(hero.curY < 0 ? 'up' : 'down');
      }

      // 视频整体轻微视差，跟随鼠标（幅度很小）
      const videosEl = $('#hero-videos', stage);
      if (videosEl && !reduced()) {
        videosEl.style.transform = `translate3d(${(-hero.curX * 12).toFixed(2)}px, ${(-hero.curY * 10).toFixed(2)}px, 0) scale(1.04)`;
      }

      // 首屏标题淡出
      if (copy) {
        const o = clamp(1 - p / 0.22, 0, 1);
        copy.style.opacity = String(o);
        copy.style.transform = `translateY(calc(-50% - ${(p * 40).toFixed(1)}px))`;
      }

      // 文案按节奏点淡入淡出
      const beatIndex = HERO_BEATS.findIndex(beat => p >= beat.from && p < beat.to);
      const active = beatIndex < 0 ? HERO_BEATS.length - 1 : beatIndex;
      captions.forEach((node, index) => node.classList.toggle('is-active', index === active && p > 0.04));

      // 滚出首屏后隐藏固定层，避免影响后面的专区列表
      stage.classList.toggle('is-past', p >= 0.999);
    };
    hero.raf = requestAnimationFrame(loop);
  }

  /* ==========================================================
   * 4. 专区页：滚动卡片流
   * ========================================================== */
  // 单张作品卡（卡片用缩略图，点开才是大图）
  function photoCardMarkup(zoneId, photo, index) {
    const hasRatio = photo.w && photo.h;
    const ratio = hasRatio ? (photo.w / photo.h).toFixed(4) : 'auto';
    return `
      <button class="photo-card${hasRatio ? '' : ' is-auto'}" data-action="open-lightbox" data-zone="${esc(zoneId)}" data-index="${index}"
              style="--ratio:${ratio}" aria-label="预览 ${esc(photo.title || '')}">
        <span class="photo-frame">
          <img src="${esc(photo.thumb || photo.src)}" alt="${esc(photo.title || '')}" loading="lazy" decoding="async" />
        </span>
        <span class="photo-meta">
          <strong>${esc(photo.title || 'untitled')}</strong>
          <small>${(photo.tags || []).map(tag => '#' + esc(tag)).join(' ')}</small>
        </span>
      </button>`;
  }

  function cardsMarkup(zoneId, photos) {
    if (!photos.length) {
      return `
      <div class="zone-empty">
        <p>这里还是空的。</p>
        <small>把照片放进 <code>assets/photos/${esc(zoneId)}/</code> 文件夹就会自动出现。</small>
      </div>`;
    }
    return photos.map((photo, index) => photoCardMarkup(zoneId, photo, index)).join('');
  }

  function refreshGalleryGrid(zoneId) {
    const host = $('.masonry');
    if (!host) return;
    const photos = photosOf(zoneId);
    host.innerHTML = cardsMarkup(zoneId, photos);
    const count = $('.zone-count');
    if (count) count.textContent = photos.length + ' pieces · 点击任意图片进入预览，卡片可以翻到背面写字';
  }

  // 自动读取 GitHub 上该专区的文件夹，这样你自己上传照片就会自动出现
  // 读取文件夹清单：优先 GitHub 接口（最新，但每小时 60 次限制），
  // 失败时自动换成 jsDelivr（不限流，但新文件可能有最多 12 小时缓存）。
  // 返回 source 用来判断：GitHub = 以文件夹为准；jsDelivr = 和内置列表合并，避免新照片被藏起来。
  async function loadFolderListing(repo, dir) {
    const cacheKey = 'ppniusworld.listing.v2.' + repo + '.' + dir;
    const cached = store.get(cacheKey, null);
    if (cached && cached.at && (Date.now() - cached.at) < 2 * 60 * 1000 && Array.isArray(cached.files)) {
      return { files: cached.files, source: cached.source || 'github' };
    }
    let files = null;
    let source = 'github';

    try {
      const res = await fetch('https://api.github.com/repos/' + repo + '/contents/' + dir + '?ref=main',
        { headers: { Accept: 'application/vnd.github+json' } });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          files = data.filter(item => item.type === 'file')
            .map(item => ({ name: item.name, url: item.download_url }));
        }
      }
    } catch (error) { /* 换下一个来源 */ }

    if (!files || !files.length) {
      source = 'jsdelivr';
      try {
        const res = await fetch('https://data.jsdelivr.com/v1/packages/gh/' + repo + '@main?structure=flat');
        if (res.ok) {
          const data = await res.json();
          const prefix = '/' + dir + '/';
          files = (data.files || [])
            .map(item => item.name)
            .filter(name => name.startsWith(prefix) && name.slice(prefix.length).indexOf('/') === -1)
            .map(name => {
              const file = name.slice(prefix.length);
              return { name: file, url: 'https://cdn.jsdelivr.net/gh/' + repo + '@main/' + dir + '/' + file };
            });
        }
      } catch (error) { /* 放弃，用静态列表 */ }
    }

    if (files && files.length) store.set(cacheKey, { at: Date.now(), files, source });
    return files && files.length ? { files, source } : null;
  }

  // 自动读取 GitHub 上该专区的文件夹，这样你自己上传照片就会自动出现
  async function hydrateAutoList(zoneId) {
    const section = sectionById(zoneId);
    const dir = section && section.autoList;
    const repo = GALLERY.repo;
    if (!dir || !repo) return;

    const listing = await loadFolderListing(repo, dir);
    if (!listing) return;

    const images = listing.files.filter(file =>
      /\.(jpe?g|png|webp|gif|avif)$/i.test(file.name) && !file.name.startsWith('.'));
    if (!images.length) return;

    images.sort((a, b) => {
      const na = /^ph-(\d+)/i.exec(a.name);
      const nb = /^ph-(\d+)/i.exec(b.name);
      if (na && nb) return Number(na[1]) - Number(nb[1]);
      if (na) return -1;
      if (nb) return 1;
      return a.name.localeCompare(b.name);
    });

    const staticList = (GALLERY.photos && GALLERY.photos[zoneId]) || [];
    const presets = new Map(staticList.map(item => [String(item.src).split('/').pop(), item]));

    const merged = images.map(file => {
      const preset = presets.get(file.name);
      if (preset) return preset;              // 保留写好的标题和缩略图
      return {
        id: 'auto-' + file.name,
        src: file.url,
        title: file.name.replace(/\.[^.]+$/, ''),
        tags: [],
        auto: true
      };
    });

    if (listing.source !== 'github') {
      // jsDelivr 有缓存，可能还没收录新照片 —— 把内置列表里剩下的补回来
      const seen = new Set(images.map(file => file.name));
      staticList.forEach(item => {
        const name = String(item.src).split('/').pop();
        if (!seen.has(name)) merged.push(item);
      });
    }

    runtimePhotos[zoneId] = merged;
    refreshGalleryGrid(zoneId);
  }

  function viewGallery(zoneId) {
    const section = sectionById(zoneId);
    if (!section) {
      return `<section class="zone-page"><header class="zone-head">
        <a class="back" href="#/">← 回到首页</a>
        <h1>没有找到这个专区</h1>
        <p class="zone-sub">请检查网址，或从首页重新进入。</p>
      </header></section>`;
    }
    const photos = photosOf(zoneId);
    const cards = cardsMarkup(zoneId, photos);

    return `
      <section class="zone-page">
        <header class="zone-head" style="--zone-color:${esc(section.color || '#f6d8d3')}">
          <a class="back" href="#/">← all work</a>
          <p class="kicker">${esc(section.kicker || '')}</p>
          <h1>${esc(section.title)}</h1>
          <p class="zone-sub">${esc(section.subtitle || '')}</p>
          <p class="zone-count">${photos.length} pieces · 点击任意图片进入预览，卡片可以翻到背面写字</p>
        </header>
        <div class="masonry">${cards}</div>
        <footer class="site-foot">
          <a href="#/">← 回到首页</a>
          <a href="#/id-card">ID CARD</a>
          <a href="#/resume">RESUME</a>
        </footer>
      </section>`;
  }

  /* ==========================================================
   * 5. 大图预览：3D 翻转卡片
   * ========================================================== */
  const NOTE_SIZES = { sm: 1, md: 1.35, lg: 1.8 };

  function lightboxMarkup() {
    const lb = state.lightbox;
    if (!lb) return '';
    const photos = photosOf(lb.zoneId);
    const photo = photos[lb.index];
    if (!photo) return '';
    const section = sectionById(lb.zoneId);
    const note = getNote(lb.zoneId, photo.id);
    const noteSize = NOTE_SIZES[lb.size] || NOTE_SIZES.md;

    return `
      <div class="lightbox" data-zone="${esc(lb.zoneId)}" data-index="${lb.index}">
        <button class="lb-scrim" data-action="close-lightbox" aria-label="关闭预览"></button>

        <div class="lb-bar">
          <div class="lb-left">
            <span class="lb-zone">${esc(section ? section.title : '')}</span>
            <span class="lb-count">${lb.index + 1} / ${photos.length}</span>
          </div>
          <div class="lb-right">
            <button class="lb-tool" data-action="note-smaller" aria-label="文字变小">A−</button>
            <button class="lb-tool" data-action="note-bigger" aria-label="文字变大">A＋</button>
            <button class="lb-tool lb-flip" data-action="flip-card">翻转 ✎</button>
            <button class="lb-tool lb-close" data-action="close-lightbox" aria-label="关闭">✕</button>
          </div>
        </div>

        ${photos.length > 1 ? `<button class="lb-nav lb-prev" data-action="lb-prev" aria-label="上一张">‹</button>` : ''}

        <div class="flip-scene">
          <div class="flip-card ${lb.flipped ? 'is-flipped' : ''}" data-action="flip-card">
            <div class="flip-face flip-front">
              <img src="${esc(photo.src)}" alt="${esc(photo.title || '')}" />
              <span class="flip-front-tag">${esc(photo.title || '')}</span>
            </div>
            <div class="flip-face flip-back">
              <div class="note-paper" style="--note-line:${(noteSize * 2.1).toFixed(3)}rem">
                <div class="note-text" contenteditable="true" spellcheck="false"
                     data-note-zone="${esc(lb.zoneId)}" data-note-photo="${esc(photo.id)}"
                     data-placeholder="在这里写点什么…"
                     style="font-size:${noteSize.toFixed(2)}rem">${esc(note)}</div>
                <p class="note-tip">点击即可编辑 · 自动保存</p>
              </div>
            </div>
          </div>
        </div>

        ${photos.length > 1 ? `<button class="lb-nav lb-next" data-action="lb-next" aria-label="下一张">›</button>` : ''}

        <p class="lb-foot">空格翻转 · ← → 切换 · Esc 关闭</p>
      </div>`;
  }

  function openLightbox(zoneId, index) {
    state.lightbox = { zoneId, index, flipped: false, size: 'md' };
    renderLightbox();
  }

  function renderLightbox() {
    const existing = $('.lightbox');
    const markup = lightboxMarkup();
    if (!markup) { if (existing) existing.remove(); document.body.classList.remove('lb-open'); return; }
    if (existing) existing.outerHTML = markup;
    else document.body.insertAdjacentHTML('beforeend', markup);
    document.body.classList.add('lb-open');
    const note = $('.note-text');
    if (note && state.lightbox && state.lightbox.flipped) {
      note.focus();
      const range = document.createRange();
      range.selectNodeContents(note);
      range.collapse(false);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  function closeLightbox() {
    state.lightbox = null;
    const existing = $('.lightbox');
    if (existing) existing.remove();
    document.body.classList.remove('lb-open');
  }

  function stepLightbox(delta) {
    const lb = state.lightbox;
    if (!lb) return;
    const photos = photosOf(lb.zoneId);
    if (!photos.length) return;
    lb.index = (lb.index + delta + photos.length) % photos.length;
    lb.flipped = false;
    renderLightbox();
  }

  function toggleFlip() {
    const lb = state.lightbox;
    if (!lb) return;
    lb.flipped = !lb.flipped;
    const card = $('.flip-card');
    if (card) card.classList.toggle('is-flipped', lb.flipped);
    if (lb.flipped) {
      setTimeout(() => {
        const note = $('.note-text');
        if (note) note.focus();
      }, reduced() ? 0 : 420);
    }
  }

  function setNoteSize(delta) {
    const lb = state.lightbox;
    if (!lb) return;
    const order = ['sm', 'md', 'lg'];
    const at = order.indexOf(lb.size || 'md');
    lb.size = order[clamp(at + delta, 0, order.length - 1)];
    const note = $('.note-text');
    const paper = $('.note-paper');
    const size = NOTE_SIZES[lb.size] || NOTE_SIZES.md;
    if (note) note.style.fontSize = size.toFixed(2) + 'rem';
    if (paper) paper.style.setProperty('--note-line', (size * 2.1).toFixed(3) + 'rem');
  }

  /* ==========================================================
   * 6. ID Card 页面
   * ========================================================== */
  function viewIdCard() {
    const card = state.idCard || { fields: [] };
    const fields = (card.fields || []).map(field => `
      <li class="id-field" data-field-id="${esc(field.id)}">
        <span class="id-field-label">
          <span class="id-label" contenteditable="true" spellcheck="false"
                data-id-edit="label" data-id="${esc(field.id)}">${esc(field.label || '')}</span>
          <span class="id-label-en" contenteditable="true" spellcheck="false"
                data-id-edit="labelEn" data-id="${esc(field.id)}">${esc(field.labelEn || '')}</span>
        </span>
        <span class="id-value" contenteditable="true" spellcheck="false"
              data-id-edit="value" data-id="${esc(field.id)}">${esc(field.value || '')}</span>
        <button class="id-del" data-action="del-id-field" data-id="${esc(field.id)}" aria-label="删除这一条">×</button>
      </li>`).join('');

    return `
      <section class="id-page">
        <header class="page-head">
          <p class="kicker">ABOUT ME</p>
          <h1>ID Card</h1>
          <p class="page-sub">卡片上的字都可以直接点开修改，改完自动保存。</p>
        </header>

        <div class="id-card" id="id-sheet">
          <div class="id-band">
            <span class="id-band-title" contenteditable="true" spellcheck="false" data-id-edit="band">${esc(card.band || 'ID CARD')}</span>
            <span class="id-band-star">✦</span>
          </div>
          <div class="id-body">
            <div class="id-avatar">
              <span class="id-avatar-ring"></span>
              <img src="${esc(card.avatar || 'assets/profile/avatar.jpg')}" alt="avatar" />
            </div>
            <div class="id-info">
              <h2 class="id-name" contenteditable="true" spellcheck="false" data-id-edit="name">${esc(card.name || '')}</h2>
              <p class="id-since" contenteditable="true" spellcheck="false" data-id-edit="since">${esc(card.since || '')}</p>
              <ul class="id-fields">${fields}</ul>
              <div class="id-actions">
                <button class="ghost-button" data-action="add-id-field">＋ 加一条信息</button>
                <button class="ghost-button ghost-danger" data-action="reset-id">恢复默认</button>
              </div>
            </div>
          </div>
          <p class="id-foot" data-placeholder="在这里留一句想说的话" contenteditable="true" spellcheck="false" data-id-edit="foot">${esc(card.foot || '')}</p>
        </div>
      </section>`;
  }

  function onIdCardInput(target) {
    const key = target.dataset.idEdit;
    if (!key) return;
    if (key === 'label' || key === 'labelEn' || key === 'value') {
      const field = (state.idCard.fields || []).find(item => item.id === target.dataset.id);
      if (field) field[key] = target.textContent;
    } else {
      state.idCard[key] = target.textContent;
    }
    store.set(KEYS.idCard, state.idCard);
  }

  function addIdField() {
    const id = uid('field');
    state.idCard.fields = state.idCard.fields || [];
    state.idCard.fields.push({ id, label: '新信息', labelEn: 'New', value: '点这里填写' });
    store.set(KEYS.idCard, state.idCard);
    render();
    const node = $(`.id-field[data-field-id="${id}"] .id-value`);
    if (node) node.focus();
  }

  function deleteIdField(id) {
    state.idCard.fields = (state.idCard.fields || []).filter(field => field.id !== id);
    store.set(KEYS.idCard, state.idCard);
    render();
  }

  function resetIdCard() {
    state.idCard = clone(PROFILE.idCard || { fields: [] });
    store.set(KEYS.idCard, state.idCard);
    render();
  }

  /* ==========================================================
   * 7. 空白简历页面
   * ========================================================== */
  function viewResume() {
    const resume = state.resume || { sections: [] };
    const contacts = (resume.contacts || []).map(contact => `
      <li class="resume-contact" data-contact-id="${esc(contact.id)}">
        <span class="rc-label" contenteditable="true" spellcheck="false" data-resume-contact="label" data-id="${esc(contact.id)}">${esc(contact.label || '')}</span>
        <span class="rc-value" contenteditable="true" spellcheck="false" data-resume-contact="value" data-id="${esc(contact.id)}"
              data-placeholder="点击填写">${esc(contact.value || '')}</span>
        <button class="mini-del" data-action="del-contact" data-id="${esc(contact.id)}" aria-label="删除">×</button>
      </li>`).join('');

    const sections = (resume.sections || []).map(section => {
      const entries = (section.entries || []).map(entry => `
        <li class="resume-entry" data-entry-id="${esc(entry.id)}">
          <div class="re-head">
            <span class="re-title" contenteditable="true" spellcheck="false" data-resume-entry="title" data-section="${esc(section.id)}" data-id="${esc(entry.id)}"
                  data-placeholder="标题 / 职位">${esc(entry.title || '')}</span>
            <span class="re-time" contenteditable="true" spellcheck="false" data-resume-entry="time" data-section="${esc(section.id)}" data-id="${esc(entry.id)}"
                  data-placeholder="时间">${esc(entry.time || '')}</span>
          </div>
          <span class="re-org" contenteditable="true" spellcheck="false" data-resume-entry="org" data-section="${esc(section.id)}" data-id="${esc(entry.id)}"
                data-placeholder="学校 / 公司 / 组织">${esc(entry.org || '')}</span>
          <div class="re-desc" contenteditable="true" spellcheck="false" data-resume-entry="desc" data-section="${esc(section.id)}" data-id="${esc(entry.id)}"
               data-placeholder="描述一下你做了什么、学到了什么…">${esc(entry.desc || '')}</div>
          <button class="mini-del" data-action="del-entry" data-section="${esc(section.id)}" data-id="${esc(entry.id)}" aria-label="删除这一条">×</button>
        </li>`).join('');

      return `
        <section class="resume-block" data-block-id="${esc(section.id)}">
          <div class="rb-head">
            <h3 class="rb-title" contenteditable="true" spellcheck="false" data-resume-section="title" data-id="${esc(section.id)}">${esc(section.title || '')}</h3>
            <span class="rb-line"></span>
            <button class="mini-del" data-action="del-section" data-id="${esc(section.id)}" aria-label="删除这个区块">×</button>
          </div>
          <ul class="resume-entries">${entries}</ul>
          <button class="add-entry" data-action="add-entry" data-id="${esc(section.id)}">＋ 加一条</button>
        </section>`;
    }).join('');

    return `
      <section class="resume-page">
        <div class="resume-toolbar">
          <div>
            <p class="kicker">CV</p>
            <h1>简历</h1>
          </div>
          <div class="resume-tools">
            <button class="ghost-button" data-action="add-section">＋ 加区块</button>
            <button class="ghost-button" data-action="print-resume">打印 / 导出 PDF</button>
            <button class="ghost-button ghost-danger" data-action="clear-resume">清空</button>
          </div>
        </div>

        <article class="resume-sheet" id="resume-sheet">
          <header class="resume-head">
            <div class="rh-main">
              <h2 class="rh-name" contenteditable="true" spellcheck="false" data-resume="name" data-placeholder="你的名字">${esc(resume.name || '')}</h2>
              <p class="rh-tagline" contenteditable="true" spellcheck="false" data-resume="tagline" data-placeholder="一句话介绍自己">${esc(resume.tagline || '')}</p>
              <ul class="resume-contacts">${contacts}</ul>
              <button class="add-contact" data-action="add-contact">＋ 加联系方式</button>
            </div>
            <div class="rh-photo">
              <img src="${esc(state.idCard.avatar || 'assets/profile/avatar.jpg')}" alt="photo" />
            </div>
          </header>
          <div class="resume-blocks">${sections}</div>
        </article>
      </section>`;
  }

  function findSection(id) { return (state.resume.sections || []).find(section => section.id === id); }
  function findEntry(sectionId, entryId) { const section = findSection(sectionId); return section && (section.entries || []).find(entry => entry.id === entryId); }

  function onResumeInput(target) {
    const dataset = target.dataset;
    if (dataset.resume) {
      state.resume[dataset.resume] = target.textContent;
    } else if (dataset.resumeContact) {
      const contact = (state.resume.contacts || []).find(item => item.id === dataset.id);
      if (contact) contact[dataset.resumeContact] = target.textContent;
    } else if (dataset.resumeSection) {
      const section = findSection(dataset.id);
      if (section) section[dataset.resumeSection] = target.textContent;
    } else if (dataset.resumeEntry) {
      const entry = findEntry(dataset.section, dataset.id);
      if (entry) entry[dataset.resumeEntry] = target.textContent;
    } else return;
    store.set(KEYS.resume, state.resume);
  }

  function contenteditableBind(selector, handler) {
    const root = $(selector);
    if (!root) return;
    root.addEventListener('input', event => {
      const target = event.target.closest('[contenteditable]');
      if (target) handler(target);
    });
  }

  // 兼容旧命名，实际用的是下面这个
  function bindEditableSection(selector, handler) { contenteditableBind(selector, handler); }

  /* ---- 简历增删 ---- */
  function addContact() {
    state.resume.contacts = state.resume.contacts || [];
    state.resume.contacts.push({ id: uid('c'), label: '新信息', value: '' });
    store.set(KEYS.resume, state.resume);
    render();
  }
  function delContact(id) {
    state.resume.contacts = (state.resume.contacts || []).filter(item => item.id !== id);
    store.set(KEYS.resume, state.resume);
    render();
  }
  function addEntry(sectionId) {
    const section = findSection(sectionId);
    if (!section) return;
    section.entries = section.entries || [];
    section.entries.push({ id: uid('e'), title: '', org: '', time: '', desc: '' });
    store.set(KEYS.resume, state.resume);
    render();
  }
  function delEntry(sectionId, entryId) {
    const section = findSection(sectionId);
    if (!section) return;
    section.entries = (section.entries || []).filter(entry => entry.id !== entryId);
    store.set(KEYS.resume, state.resume);
    render();
  }
  function addSection() {
    state.resume.sections = state.resume.sections || [];
    state.resume.sections.push({ id: uid('s'), title: '新区块', entries: [{ id: uid('e'), title: '', org: '', time: '', desc: '' }] });
    store.set(KEYS.resume, state.resume);
    render();
  }
  function delSection(id) {
    state.resume.sections = (state.resume.sections || []).filter(section => section.id !== id);
    store.set(KEYS.resume, state.resume);
    render();
  }
  function clearResume() {
    if (!window.confirm('确定要清空简历内容吗？此操作不可撤销。')) return;
    state.resume = clone(PROFILE.resume || { sections: [] });
    store.set(KEYS.resume, state.resume);
    render();
  }

  /* ==========================================================
   * 事件（统一委托）
   * ========================================================== */
  function openZone(zoneId, element) {
    const section = sectionById(zoneId);
    if (!section) return;
    if (section.kind === 'book' && !reduced() && element && !element.classList.contains('is-opening')) {
      element.classList.add('is-opening');
      setTimeout(() => go('#/gallery/' + zoneId), 620);
      return;
    }
    go('#/gallery/' + zoneId);
  }

  document.addEventListener('click', event => {
    // 点在文字纸面时不要触发翻转，否则没法编辑
    if (event.target.closest('.note-text')) return;
    const actionEl = event.target.closest('[data-action]');
    if (!actionEl) {
      const flip = event.target.closest('.flip-scene');
      if (flip && event.target.closest('.flip-card')) toggleFlip();
      return;
    }
    const action = actionEl.dataset.action;

    switch (action) {
      case 'toggle-nav': {
        const open = document.body.classList.toggle('nav-open');
        actionEl.setAttribute('aria-expanded', String(open));
        break;
      }
      case 'open-zone':
        event.preventDefault();          // 小书要先播放翻开动画再跳转
        openZone(actionEl.dataset.zone, actionEl);
        break;
      case 'skip-hero': {
        const content = $('.home-content');
        const track = $('#hero-track');
        const target = content ? content.getBoundingClientRect().top + window.scrollY : (track ? track.offsetHeight : 0);
        window.scrollTo({ top: target, behavior: reduced() ? 'auto' : 'smooth' });
        break;
      }
      case 'open-lightbox':
        openLightbox(actionEl.dataset.zone, Number(actionEl.dataset.index) || 0);
        break;
      case 'close-lightbox':
        closeLightbox();
        break;
      case 'lb-prev':
        stepLightbox(-1);
        break;
      case 'lb-next':
        stepLightbox(1);
        break;
      case 'flip-card':
        toggleFlip();
        break;
      case 'note-smaller':
        setNoteSize(-1);
        break;
      case 'note-bigger':
        setNoteSize(1);
        break;
      case 'add-id-field':
        addIdField();
        break;
      case 'del-id-field':
        deleteIdField(actionEl.dataset.id);
        break;
      case 'reset-id':
        resetIdCard();
        break;
      case 'add-contact':
        addContact();
        break;
      case 'del-contact':
        delContact(actionEl.dataset.id);
        break;
      case 'add-entry':
        addEntry(actionEl.dataset.id);
        break;
      case 'del-entry':
        delEntry(actionEl.dataset.section, actionEl.dataset.id);
        break;
      case 'add-section':
        addSection();
        break;
      case 'del-section':
        delSection(actionEl.dataset.id);
        break;
      case 'clear-resume':
        clearResume();
        break;
      case 'print-resume':
        window.print();
        break;
      default:
        break;
    }
  });

  // 卡片背面文字输入保存（大图预览）
  document.addEventListener('input', event => {
    const note = event.target.closest('.note-text');
    if (note) {
      setNote(note.dataset.noteZone, note.dataset.notePhoto, note.textContent);
    }
  });

  // 键盘操作
  document.addEventListener('keydown', event => {
    if (!state.lightbox) return;
    const inNote = !!event.target.closest('.note-text');
    if (event.key === 'Escape') { closeLightbox(); }
    else if (inNote) { /* 在写字：交给 contenteditable 自己处理 */ }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); stepLightbox(-1); }
    else if (event.key === 'ArrowRight') { event.preventDefault(); stepLightbox(1); }
    else if (event.code === 'Space') { event.preventDefault(); toggleFlip(); }
  });

  // 点击导航链接后收起移动端菜单
  document.addEventListener('click', event => {
    if (event.target.closest('.nav-link') || event.target.closest('.nav-brand')) {
      document.body.classList.remove('nav-open');
    }
  });

  /* ==========================================================
   * 启动
   * ========================================================== */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render, { once: true });
  else render();
})();
