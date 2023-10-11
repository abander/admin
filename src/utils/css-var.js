export default function utilsCssVar() {
  /*拼接 css var函数 例如：--width:290px; */
  const getCssVar = (styleObj) => {
    let styleStr = ''
    for (const key in styleObj) {
      styleStr += `${key}:${styleObj[key]};\n`
    }
    return styleStr
  }
  return {
    getCssVar
  }
}
