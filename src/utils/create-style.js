export default function utilsCreateStyle() {
  /*创建style标签 标签有唯一的id*/
  const createStyle = (id, html, ref) => {
    const style = document.createElement('style')
    style.type = 'text/css'
    style.id = id
    style.innerHTML = html
    ref.appendChild(style)
  }
  return {
    createStyle
  }
}
