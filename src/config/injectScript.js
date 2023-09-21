export const injectScriptTem = (src) => `<script src="${src}" type="text/javascript"></script>`
export const injectData = {
  script: ['/iconfont.js']
}

// 注入数据 生成script，link标签，注入index.html
export const getInjectData = (data = injectData) => {
  let str = ''
  for (const [key, value] of Object.entries(data)) {
    if (key === 'script') {
      value.forEach((item) => {
        str += injectScriptTem(item)
      })
    }
  }
  return str
}
