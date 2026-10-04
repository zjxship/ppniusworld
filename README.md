# ppniusworld

一个纯 HTML + CSS + JavaScript 的个人作品集网站（无框架、无依赖）。

## 怎么打开

直接双击 `index.html` 就能看。

> 小提示：用「本地服务器」方式打开时，编辑内容（卡片文字、ID Card、简历）保存得更可靠。
> 之前的旧版本完整保留在 `previous-version.html`，随时可以回去看。

## 页面

| 页面 | 地址 | 说明 |
| --- | --- | --- |
| 首页 | `#/` | 三段式滚动视频 + 人物鼠标追视 + 四个英文专区入口 |
| 文字类 | `#/gallery/writing` | 小书翻开样式，进入后是卡片流 |
| 摄影类 | `#/gallery/photography` | 卡片流 |
| 设计类 | `#/gallery/design` | 小书翻开样式 |
| 剪辑类 | `#/gallery/video` | 卡片流 |
| ID Card | `#/id-card` | 可编辑个人信息卡 |
| 简历 | `#/resume` | 空白简历，可直接填写、可打印导出 PDF |

## 我该改哪里

**1. 换头像**
把新头像放进 `assets/profile/`，然后改 `data/profile.js` 里的：
```js
avatar: 'assets/profile/头像文件名.jpg',
```

**2. 改 ID Card 信息**
打开 `data/profile.js`，编辑 `idCard.fields`，加一行就多一条信息：
```js
{ id: 'zodiac', label: '星座', labelEn: 'Zodiac', value: '狮子座' }
```
也可以直接在网页上点着改，改完自动保存。（按要求没有 Email 字段。）

**3. 改简历内容**
打开 `#/resume`，所有文字点一下就能写。
「＋ 加一条」「＋ 加区块」可以增加内容，鼠标移到条目上会出现 × 删除。
点「打印 / 导出 PDF」可以存成 PDF。

**4. 新增作品图片**
把图片放进 `assets/photos/`，然后打开 `data/gallery.js`，
在对应专区的 `photos` 数组里加一条：
```js
{ id: 'p9', src: 'assets/photos/我的照片.jpg', title: '标题', tags: ['标签'], w: 1200, h: 1600 }
```
`w` / `h` 填图片原始宽高（数字），这样卡片会按图片本来的比例显示，不会被拉伸。

**5. 改专区名称 / 新增专区**
`data/gallery.js` 顶部的 `sections` 数组里改。
`kind: 'book'` 是小书翻开样式，`kind: 'card'` 是普通卡片样式。

**6. 换首屏视频**
把三段视频放到 `assets/videos/`，文件名保持 `intro-loop.mp4` / `main.mp4` / `outro-loop.mp4`。
页面高度会自动按 `main.mp4` 的时长计算。

## 文件结构

```
index.html            首页入口
previous-version.html 保留的旧版本
css/style.css         全部样式
js/main.js            全部逻辑（路由、滚动视频、翻转卡片、ID Card、简历）
data/gallery.js       作品图片数据
data/profile.js       头像 / ID Card / 简历骨架
assets/               图片、视频、头像
```

## 已实现的小细节

- 滚动驱动主视频：向下前进、向上倒放；intro / main / outro 三段用 opacity 0.5s 淡入淡出
- 鼠标移动时首屏人物轻微视差 + 眼神跟随；鼠标停住后画面随之停住
- 首屏滚动高度压缩到 3 屏，还有「跳过 · 直接看作品」按钮直达专区
- 小书入口点击有翻开动画
- 图片卡片按原图比例排布，点击进入大图预览
- 预览里可以 3D 翻转，背面直接点着写字，自动保存（字体与标题一致）
- 支持键盘：空格翻转、← → 切换、Esc 关闭
- 响应式 + `prefers-reduced-motion` 降级 + 简历打印排版

---

## 线上网址（GitHub Pages）

**永久地址：** https://zjxship.github.io/ppniusworld/
**仓库地址：** https://github.com/zjxship/ppniusworld

网站是公开的，手机和别人的电脑都能打开。

### 更新线上内容

改完本地文件后，需要**重新上传到 GitHub** 才会生效。
最简单的办法：直接跟 Codex 说「帮我更新一下线上网站」，它会帮你重新推送。

> 说明：仓库里只包含网站实际用到的文件（约 13MB）。
> 旧版页面 `previous-version.html`、`build/`、`tests/` 等文件只保留在本地，没有上传。
