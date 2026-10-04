/* ============================================================
 * ppniusworld · 作品数据
 * ------------------------------------------------------------
 * 想加一张图？在下面任意 sections 的 photos 数组里加一条：
 *   { id: '唯一编号', src: 'assets/photos/你的图片.jpg',
 *     title: '标题', tags: ['标签'], w: 1200, h: 1600 }
 * w / h 是图片的原始宽高（用来保证卡片不拉伸、不跳动）。
 * 想新增专区？在 sections 里加一条，并在 photos 里加同名数组。
 * ============================================================ */
window.PPNIUS_GALLERY = {
  brand: 'ppniusworld',
  // 你的 GitHub 仓库（用来自动读取你上传到文件夹里的照片）
  repo: 'zjxship/ppniusworld',
  tagline: 'images, notes and small worlds',
  sections: [
    /* ---------- 文字类：做成「小书 / 文件夹」样式 ---------- */
    {
      id: 'writing',
      title: 'WRITING',
      subtitle: 'words, letters and tiny stories',
      kicker: 'TEXT',
      kind: 'book',                 // book = 小书翻开交互 / card = 普通卡片
      color: '#f6d8d3',
      cover: 'assets/photos/girl-side.jpg',
      blurb: '把想说的话，慢慢写成一页一页。'
    },
    {
      id: 'photography',
      title: 'PHOTOGRAPHY',
      subtitle: 'light, sky and quiet moments',
      kicker: 'PHOTO',
      kind: 'card',
      autoList: 'assets/photos/photography',   // 这个文件夹里的照片会自动显示
      manifest: 'data/photography-manifest.json',   // 由 GitHub Action 自动生成
      color: '#cfe0f2',
      cover: 'assets/photos/covers/photography.jpg',
      blurb: '天空、光线，还有那些刚好被我看见的瞬间。'
    },
    {
      id: 'design',
      title: 'DESIGN',
      subtitle: 'layouts, palettes and paper things',
      kicker: 'DESIGN',
      kind: 'book',
      color: '#f8e6b8',
      cover: 'assets/photos/kitchen-line.jpg',
      blurb: '版式、颜色和纸上长出来的小东西。'
    },
    {
      id: 'video',
      title: 'VIDEO EDITING',
      subtitle: 'cuts, moods and moving pictures',
      kicker: 'VIDEO',
      kind: 'card',
      color: '#dcecdf',
      cover: 'assets/photos/girl-happy.jpg',
      blurb: '把画面剪成有情绪的节奏。'
    }
  ],
  photos: {
    writing: [
      { id: 'w1', src: 'assets/photos/sky.jpg', title: '时间什么时候倒流', tags: ['随笔', '蓝'], w: 1079, h: 1345 },
      { id: 'w2', src: 'assets/photos/stay-cute.jpg', title: 'Stay Cute', tags: ['手帐'], w: 2048, h: 1152 },
      { id: 'w3', src: 'assets/photos/girl-side.jpg', title: '小云朵的下午', tags: ['故事'], w: 1536, h: 1536 }
    ],
    photography: [
      { id: 'ph-01', src: 'assets/photos/photography/ph-01.jpg', thumb: 'assets/photos/photography/thumbs/ph-01.jpg', title: 'IMG_1469', tags: [], w: 1800, h: 1350 },
      { id: 'ph-02', src: 'assets/photos/photography/ph-02.jpg', thumb: 'assets/photos/photography/thumbs/ph-02.jpg', title: 'IMG_1473', tags: [], w: 1800, h: 1350 },
      { id: 'ph-03', src: 'assets/photos/photography/ph-03.jpg', thumb: 'assets/photos/photography/thumbs/ph-03.jpg', title: 'IMG_1494', tags: [], w: 1800, h: 1350 },
      { id: 'ph-04', src: 'assets/photos/photography/ph-04.jpg', thumb: 'assets/photos/photography/thumbs/ph-04.jpg', title: 'IMG_1549', tags: [], w: 1800, h: 1350 },
      { id: 'ph-05', src: 'assets/photos/photography/ph-05.jpg', thumb: 'assets/photos/photography/thumbs/ph-05.jpg', title: 'IMG_5726', tags: [], w: 1200, h: 1800 },
      { id: 'ph-06', src: 'assets/photos/photography/ph-06.jpg', thumb: 'assets/photos/photography/thumbs/ph-06.jpg', title: 'IMG_5727', tags: [], w: 1800, h: 1350 },
      { id: 'ph-07', src: 'assets/photos/photography/ph-07.jpg', thumb: 'assets/photos/photography/thumbs/ph-07.jpg', title: 'IMG_5728', tags: [], w: 1800, h: 1350 },
      { id: 'ph-08', src: 'assets/photos/photography/ph-08.jpg', thumb: 'assets/photos/photography/thumbs/ph-08.jpg', title: 'IMG_5729', tags: [], w: 1280, h: 960 },
      { id: 'ph-09', src: 'assets/photos/photography/ph-09.jpg', thumb: 'assets/photos/photography/thumbs/ph-09.jpg', title: 'IMG_5743', tags: [], w: 1800, h: 1350 },
      { id: 'ph-10', src: 'assets/photos/photography/ph-10.jpg', thumb: 'assets/photos/photography/thumbs/ph-10.jpg', title: 'IMG_1941', tags: [], w: 1800, h: 1350 },
      { id: 'ph-11', src: 'assets/photos/photography/ph-11.jpg', thumb: 'assets/photos/photography/thumbs/ph-11.jpg', title: 'IMG_5850', tags: [], w: 1800, h: 1350 },
      { id: 'ph-12', src: 'assets/photos/photography/ph-12.jpg', thumb: 'assets/photos/photography/thumbs/ph-12.jpg', title: 'IMG_5858', tags: [], w: 1800, h: 1350 },
      { id: 'ph-13', src: 'assets/photos/photography/ph-13.jpg', thumb: 'assets/photos/photography/thumbs/ph-13.jpg', title: 'IMG_5916', tags: [], w: 1800, h: 1350 },
      { id: 'ph-14', src: 'assets/photos/photography/ph-14.jpg', thumb: 'assets/photos/photography/thumbs/ph-14.jpg', title: 'IMG_5918', tags: [], w: 1800, h: 1350 },
      { id: 'ph-15', src: 'assets/photos/photography/ph-15.jpg', thumb: 'assets/photos/photography/thumbs/ph-15.jpg', title: 'IMG_6130', tags: [], w: 1800, h: 1350 },
      { id: 'ph-16', src: 'assets/photos/photography/ph-16.jpg', thumb: 'assets/photos/photography/thumbs/ph-16.jpg', title: 'IMG_6132', tags: [], w: 1800, h: 1350 },
      { id: 'ph-17', src: 'assets/photos/photography/ph-17.jpg', thumb: 'assets/photos/photography/thumbs/ph-17.jpg', title: 'IMG_6133', tags: [], w: 1800, h: 1350 },
      { id: 'ph-18', src: 'assets/photos/photography/ph-18.jpg', thumb: 'assets/photos/photography/thumbs/ph-18.jpg', title: 'IMG_6134', tags: [], w: 1800, h: 1350 },
      { id: 'ph-19', src: 'assets/photos/photography/ph-19.jpg', thumb: 'assets/photos/photography/thumbs/ph-19.jpg', title: 'IMG_6136', tags: [], w: 1350, h: 1800 },
      { id: 'ph-20', src: 'assets/photos/photography/ph-20.jpg', thumb: 'assets/photos/photography/thumbs/ph-20.jpg', title: 'Photo 20', tags: [], w: 1440, h: 1080 },
      { id: 'ph-21', src: 'assets/photos/photography/ph-21.jpg', thumb: 'assets/photos/photography/thumbs/ph-21.jpg', title: 'Photo 21', tags: [], w: 1440, h: 1080 },
      { id: 'ph-22', src: 'assets/photos/photography/ph-22.jpg', thumb: 'assets/photos/photography/thumbs/ph-22.jpg', title: 'Photo 22', tags: [], w: 1440, h: 1080 },
      { id: 'ph-23', src: 'assets/photos/photography/ph-23.jpg', thumb: 'assets/photos/photography/thumbs/ph-23.jpg', title: 'Photo 23', tags: [], w: 1440, h: 1080 },
      { id: 'ph-24', src: 'assets/photos/photography/ph-24.jpg', thumb: 'assets/photos/photography/thumbs/ph-24.jpg', title: 'Photo 24', tags: [], w: 1441, h: 1080 },
      { id: 'ph-25', src: 'assets/photos/photography/ph-25.jpg', thumb: 'assets/photos/photography/thumbs/ph-25.jpg', title: 'Photo 25', tags: [], w: 1440, h: 1080 },
      { id: 'ph-26', src: 'assets/photos/photography/ph-26.jpg', thumb: 'assets/photos/photography/thumbs/ph-26.jpg', title: 'Photo 26', tags: [], w: 1440, h: 1080 },
      { id: 'ph-27', src: 'assets/photos/photography/ph-27.jpg', thumb: 'assets/photos/photography/thumbs/ph-27.jpg', title: 'Photo 27', tags: [], w: 1440, h: 1080 },
      { id: 'ph-28', src: 'assets/photos/photography/ph-28.jpg', thumb: 'assets/photos/photography/thumbs/ph-28.jpg', title: 'Photo 28', tags: [], w: 1440, h: 1080 },
      { id: 'ph-29', src: 'assets/photos/photography/ph-29.jpg', thumb: 'assets/photos/photography/thumbs/ph-29.jpg', title: 'Photo 29', tags: [], w: 1440, h: 1080 },
      { id: 'ph-30', src: 'assets/photos/photography/ph-30.jpg', thumb: 'assets/photos/photography/thumbs/ph-30.jpg', title: 'Photo 30', tags: [], w: 1440, h: 1080 },
      { id: 'ph-31', src: 'assets/photos/photography/ph-31.jpg', thumb: 'assets/photos/photography/thumbs/ph-31.jpg', title: 'Photo 31', tags: [], w: 1440, h: 1080 },
      { id: 'ph-32', src: 'assets/photos/photography/ph-32.jpg', thumb: 'assets/photos/photography/thumbs/ph-32.jpg', title: 'Photo 32', tags: [], w: 1440, h: 1080 },
      { id: 'ph-33', src: 'assets/photos/photography/ph-33.jpg', thumb: 'assets/photos/photography/thumbs/ph-33.jpg', title: 'Photo 33', tags: [], w: 1440, h: 1080 },
      { id: 'ph-34', src: 'assets/photos/photography/ph-34.jpg', thumb: 'assets/photos/photography/thumbs/ph-34.jpg', title: 'IMG_6480', tags: [], w: 1800, h: 1350 },
      { id: 'ph-35', src: 'assets/photos/photography/ph-35.jpg', thumb: 'assets/photos/photography/thumbs/ph-35.jpg', title: 'IMG_6481', tags: [], w: 1800, h: 1350 },
      { id: 'ph-36', src: 'assets/photos/photography/ph-36.jpg', thumb: 'assets/photos/photography/thumbs/ph-36.jpg', title: 'IMG_6485', tags: [], w: 1800, h: 1350 },
      { id: 'ph-37', src: 'assets/photos/photography/ph-37.jpg', thumb: 'assets/photos/photography/thumbs/ph-37.jpg', title: 'IMG_6486', tags: [], w: 1800, h: 1350 },
      { id: 'ph-38', src: 'assets/photos/photography/ph-38.jpg', thumb: 'assets/photos/photography/thumbs/ph-38.jpg', title: 'IMG_6487', tags: [], w: 1800, h: 1350 },
    
      { id: 'ph-39', src: 'assets/photos/photography/ph-39.jpg', thumb: 'assets/photos/photography/thumbs/ph-39.jpg', title: 'IMG_1548', tags: [], w: 1600, h: 1600 },
      { id: 'ph-40', src: 'assets/photos/photography/ph-40.jpg', thumb: 'assets/photos/photography/thumbs/ph-40.jpg', title: 'IMG_2019', tags: [], w: 1600, h: 1600 },
      { id: 'ph-41', src: 'assets/photos/photography/ph-41.jpg', thumb: 'assets/photos/photography/thumbs/ph-41.jpg', title: 'IMG_2512', tags: [], w: 1600, h: 1600 },
      { id: 'ph-42', src: 'assets/photos/photography/ph-42.jpg', thumb: 'assets/photos/photography/thumbs/ph-42.jpg', title: 'IMG_2514', tags: [], w: 1206, h: 1526 },
      { id: 'ph-43', src: 'assets/photos/photography/ph-43.jpg', thumb: 'assets/photos/photography/thumbs/ph-43.jpg', title: 'IMG_2750', tags: [], w: 1600, h: 1200 },
      { id: 'ph-44', src: 'assets/photos/photography/ph-44.jpg', thumb: 'assets/photos/photography/thumbs/ph-44.jpg', title: 'IMG_2751', tags: [], w: 1600, h: 1600 },
      { id: 'ph-45', src: 'assets/photos/photography/ph-45.jpg', thumb: 'assets/photos/photography/thumbs/ph-45.jpg', title: 'IMG_2907', tags: [], w: 1600, h: 1200 },
      { id: 'ph-46', src: 'assets/photos/photography/ph-46.jpg', thumb: 'assets/photos/photography/thumbs/ph-46.jpg', title: 'IMG_2909', tags: [], w: 1600, h: 1200 },
      { id: 'ph-47', src: 'assets/photos/photography/ph-47.jpg', thumb: 'assets/photos/photography/thumbs/ph-47.jpg', title: 'IMG_2910', tags: [], w: 1600, h: 1200 },
      { id: 'ph-48', src: 'assets/photos/photography/ph-48.jpg', thumb: 'assets/photos/photography/thumbs/ph-48.jpg', title: 'IMG_2911', tags: [], w: 1600, h: 1200 },
      { id: 'ph-49', src: 'assets/photos/photography/ph-49.jpg', thumb: 'assets/photos/photography/thumbs/ph-49.jpg', title: 'IMG_2912', tags: [], w: 1600, h: 900 },
      { id: 'ph-50', src: 'assets/photos/photography/ph-50.jpg', thumb: 'assets/photos/photography/thumbs/ph-50.jpg', title: 'IMG_2915', tags: [], w: 1200, h: 1600 },
      { id: 'ph-51', src: 'assets/photos/photography/ph-51.jpg', thumb: 'assets/photos/photography/thumbs/ph-51.jpg', title: 'IMG_4094', tags: [], w: 1600, h: 1200 },
      { id: 'ph-52', src: 'assets/photos/photography/ph-52.jpg', thumb: 'assets/photos/photography/thumbs/ph-52.jpg', title: 'IMG_4095', tags: [], w: 1600, h: 1200 },
      { id: 'ph-53', src: 'assets/photos/photography/ph-53.jpg', thumb: 'assets/photos/photography/thumbs/ph-53.jpg', title: 'IMG_4096', tags: [], w: 1600, h: 1200 },
      { id: 'ph-54', src: 'assets/photos/photography/ph-54.jpg', thumb: 'assets/photos/photography/thumbs/ph-54.jpg', title: 'IMG_4097', tags: [], w: 1600, h: 1200 },
      { id: 'ph-55', src: 'assets/photos/photography/ph-55.jpg', thumb: 'assets/photos/photography/thumbs/ph-55.jpg', title: 'IMG_4098', tags: [], w: 1600, h: 1199 },
      { id: 'ph-56', src: 'assets/photos/photography/ph-56.jpg', thumb: 'assets/photos/photography/thumbs/ph-56.jpg', title: 'IMG_4099', tags: [], w: 1600, h: 1200 },
      { id: 'ph-57', src: 'assets/photos/photography/ph-57.jpg', thumb: 'assets/photos/photography/thumbs/ph-57.jpg', title: 'IMG_4438', tags: [], w: 1600, h: 1600 },
      { id: 'ph-58', src: 'assets/photos/photography/ph-58.jpg', thumb: 'assets/photos/photography/thumbs/ph-58.jpg', title: 'IMG_4446', tags: [], w: 1600, h: 1600 },
      { id: 'ph-59', src: 'assets/photos/photography/ph-59.jpg', thumb: 'assets/photos/photography/thumbs/ph-59.jpg', title: 'IMG_4449', tags: [], w: 1600, h: 1600 },
      { id: 'ph-60', src: 'assets/photos/photography/ph-60.jpg', thumb: 'assets/photos/photography/thumbs/ph-60.jpg', title: 'IMG_4451', tags: [], w: 1600, h: 1600 },
      { id: 'ph-61', src: 'assets/photos/photography/ph-61.jpg', thumb: 'assets/photos/photography/thumbs/ph-61.jpg', title: 'IMG_5056', tags: [], w: 1440, h: 1080 },
      { id: 'ph-62', src: 'assets/photos/photography/ph-62.jpg', thumb: 'assets/photos/photography/thumbs/ph-62.jpg', title: 'IMG_5057', tags: [], w: 1440, h: 1080 },
      { id: 'ph-63', src: 'assets/photos/photography/ph-63.jpg', thumb: 'assets/photos/photography/thumbs/ph-63.jpg', title: 'IMG_5058', tags: [], w: 1440, h: 1080 },
      { id: 'ph-64', src: 'assets/photos/photography/ph-64.jpg', thumb: 'assets/photos/photography/thumbs/ph-64.jpg', title: 'IMG_5059', tags: [], w: 1600, h: 1200 },
      { id: 'ph-65', src: 'assets/photos/photography/ph-65.jpg', thumb: 'assets/photos/photography/thumbs/ph-65.jpg', title: 'IMG_5060', tags: [], w: 1600, h: 1286 },
      { id: 'ph-66', src: 'assets/photos/photography/ph-66.jpg', thumb: 'assets/photos/photography/thumbs/ph-66.jpg', title: 'IMG_5061', tags: [], w: 1201, h: 1600 },
      { id: 'ph-67', src: 'assets/photos/photography/ph-67.jpg', thumb: 'assets/photos/photography/thumbs/ph-67.jpg', title: 'IMG_5063', tags: [], w: 1600, h: 1200 },
      { id: 'ph-68', src: 'assets/photos/photography/ph-68.jpg', thumb: 'assets/photos/photography/thumbs/ph-68.jpg', title: 'IMG_5064', tags: [], w: 1600, h: 1201 },
      { id: 'ph-69', src: 'assets/photos/photography/ph-69.jpg', thumb: 'assets/photos/photography/thumbs/ph-69.jpg', title: 'IMG_5066', tags: [], w: 1600, h: 1201 },
      { id: 'ph-70', src: 'assets/photos/photography/ph-70.jpg', thumb: 'assets/photos/photography/thumbs/ph-70.jpg', title: 'IMG_5104', tags: [], w: 1600, h: 1200 },
      { id: 'ph-71', src: 'assets/photos/photography/ph-71.jpg', thumb: 'assets/photos/photography/thumbs/ph-71.jpg', title: 'IMG_5237', tags: [], w: 1600, h: 1200 },
      { id: 'ph-72', src: 'assets/photos/photography/ph-72.jpg', thumb: 'assets/photos/photography/thumbs/ph-72.jpg', title: 'IMG_5314', tags: [], w: 1600, h: 1600 },
      { id: 'ph-73', src: 'assets/photos/photography/ph-73.jpg', thumb: 'assets/photos/photography/thumbs/ph-73.jpg', title: 'IMG_5359', tags: [], w: 1600, h: 1200 },
      { id: 'ph-74', src: 'assets/photos/photography/ph-74.jpg', thumb: 'assets/photos/photography/thumbs/ph-74.jpg', title: 'IMG_5410', tags: [], w: 1600, h: 1200 },
      { id: 'ph-75', src: 'assets/photos/photography/ph-75.jpg', thumb: 'assets/photos/photography/thumbs/ph-75.jpg', title: 'IMG_1983', tags: [], w: 1600, h: 1200 },
      { id: 'ph-76', src: 'assets/photos/photography/ph-76.jpg', thumb: 'assets/photos/photography/thumbs/ph-76.jpg', title: 'IMG_6499', tags: [], w: 1600, h: 1199 },
      { id: 'ph-77', src: 'assets/photos/photography/ph-77.jpg', thumb: 'assets/photos/photography/thumbs/ph-77.jpg', title: 'IMG_6525', tags: [], w: 1600, h: 1200 },
      { id: 'ph-78', src: 'assets/photos/photography/ph-78.jpg', thumb: 'assets/photos/photography/thumbs/ph-78.jpg', title: 'IMG_6533', tags: [], w: 1600, h: 1200 },
      { id: 'ph-79', src: 'assets/photos/photography/ph-79.jpg', thumb: 'assets/photos/photography/thumbs/ph-79.jpg', title: 'IMG_6536', tags: [], w: 1600, h: 1200 },
      { id: 'ph-80', src: 'assets/photos/photography/ph-80.jpg', thumb: 'assets/photos/photography/thumbs/ph-80.jpg', title: 'IMG_6539', tags: [], w: 1600, h: 1200 },
      { id: 'ph-81', src: 'assets/photos/photography/ph-81.jpg', thumb: 'assets/photos/photography/thumbs/ph-81.jpg', title: 'IMG_6621', tags: [], w: 1600, h: 1200 },
      { id: 'ph-82', src: 'assets/photos/photography/ph-82.jpg', thumb: 'assets/photos/photography/thumbs/ph-82.jpg', title: 'IMG_6623', tags: [], w: 900, h: 1600 },
      { id: 'ph-83', src: 'assets/photos/photography/ph-83.jpg', thumb: 'assets/photos/photography/thumbs/ph-83.jpg', title: 'IMG_6624', tags: [], w: 1600, h: 1200 },
      { id: 'ph-84', src: 'assets/photos/photography/ph-84.jpg', thumb: 'assets/photos/photography/thumbs/ph-84.jpg', title: 'IMG_6631', tags: [], w: 1600, h: 1200 },
      { id: 'ph-85', src: 'assets/photos/photography/ph-85.jpg', thumb: 'assets/photos/photography/thumbs/ph-85.jpg', title: 'IMG_6632', tags: [], w: 1600, h: 1200 },
      { id: 'ph-86', src: 'assets/photos/photography/ph-86.jpg', thumb: 'assets/photos/photography/thumbs/ph-86.jpg', title: 'IMG_6633', tags: [], w: 1200, h: 1600 },
      { id: 'ph-87', src: 'assets/photos/photography/ph-87.jpg', thumb: 'assets/photos/photography/thumbs/ph-87.jpg', title: 'IMG_6636', tags: [], w: 1600, h: 1200 },
      { id: 'ph-88', src: 'assets/photos/photography/ph-88.jpg', thumb: 'assets/photos/photography/thumbs/ph-88.jpg', title: 'IMG_6637', tags: [], w: 1600, h: 1200 },
    ],
    design: [
      { id: 'd1', src: 'assets/photos/kitchen-line.jpg', title: 'Kitchen Line', tags: ['线稿', '手绘'], w: 1206, h: 1610 },
      { id: 'd2', src: 'assets/photos/stay-cute.jpg', title: 'Sticker Sheet', tags: ['贴纸'], w: 2048, h: 1152 },
      { id: 'd3', src: 'assets/photos/gaze-center.png', title: 'Character Study', tags: ['角色'], w: 1200, h: 675 }
    ],
    video: [
      { id: 'v1', src: 'assets/photos/gaze-center.png', title: 'Hero Loop', tags: ['动画'], w: 1200, h: 675 },
      { id: 'v2', src: 'assets/photos/girl-happy.jpg', title: 'Happy Cut', tags: ['剪辑'], w: 1536, h: 1536 },
      { id: 'v3', src: 'assets/photos/girl-cry.jpg', title: 'Sad Cut', tags: ['情绪'], w: 1536, h: 1536 }
    ]
  }
};
