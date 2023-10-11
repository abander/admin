import { v4 as uuidv4 } from 'uuid'
export function getUuid() {
  return uuidv4()
}
export function debounce(fn, n = 100) {
  let handle
  return (...args) => {
    if (handle) clearTimeout(handle)
    handle = setTimeout(() => {
      fn(...args)
    }, n)
  }
}
