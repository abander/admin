// element
import { ElMessage, ElMessageBox } from 'element-plus'

export default function setGlobalVar() {
  window['$Message'] = ElMessage
  window['$MessageBox'] = ElMessageBox
}
