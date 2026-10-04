/* ============================================================
 * ppniusworld · 个人资料（ID Card + 简历骨架）
 * ------------------------------------------------------------
 * 换头像：改 avatar 的路径即可。
 * 改 ID Card：改 idCard.fields 数组，加一行 = 加一条。
 *   { id:'唯一编号', label:'中文名', labelEn:'英文名', value:'内容' }
 * 改简历：改 resume.sections，每个 section 里有若干 entries。
 * 首次打开简历是空的，直接在页面上点击文字就能编辑。
 * ============================================================ */
window.PPNIUS_PROFILE = {
  brand: 'ppniusworld',

  /* ---------------- ID Card ---------------- */
  idCard: {
    band: 'ID CARD',                 // 卡片顶部色带上的字
    avatar: 'assets/profile/avatar.jpg',  // ← 在这里换头像
    name: 'twilightppnius',
    since: 'since 2026.05.18',
    fields: [
      { id: 'username', label: '用户名', labelEn: 'Username', value: 'twilightppnius' },
      { id: 'zodiac',   label: '星座',   labelEn: 'Zodiac',   value: '狮子座' },
      { id: 'mbti',     label: 'MBTI',   labelEn: 'MBTI',     value: 'INTJ' },
      { id: 'birthday', label: '生日',   labelEn: 'Birthday', value: '20080808' }
      // 注意：按要求这里没有 Email 字段。想加别的信息，照上面的格式加一行即可。
    ]
  },

  /* ---------------- 空白简历 ---------------- */
  resume: {
    name: '',
    tagline: '',
    contacts: [
      { id: 'c1', label: '电话', value: '' },
      { id: 'c2', label: '邮箱', value: '' },
      { id: 'c3', label: '城市', value: '' }
    ],
    sections: [
      {
        id: 'education', title: '教育经历', entries: [
          { id: 'e1', title: '', org: '', time: '', desc: '' }
        ]
      },
      {
        id: 'experience', title: '工作 / 实习经历', entries: [
          { id: 'e1', title: '', org: '', time: '', desc: '' }
        ]
      },
      {
        id: 'project', title: '项目经历', entries: [
          { id: 'e1', title: '', org: '', time: '', desc: '' }
        ]
      },
      {
        id: 'skills', title: '技能', entries: [
          { id: 'e1', title: '', org: '', time: '', desc: '' }
        ]
      },
      {
        id: 'awards', title: '奖项与荣誉', entries: [
          { id: 'e1', title: '', org: '', time: '', desc: '' }
        ]
      },
      {
        id: 'about', title: '自我评价', entries: [
          { id: 'e1', title: '', org: '', time: '', desc: '' }
        ]
      }
    ]
  }
};
