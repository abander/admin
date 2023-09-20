/**
 * 将权限路由转换成菜单
 * @param routes - 路由
 */
export function transformAuthRouteToMenu(routes, key, father = {}) {
  const hasFather = Object.keys(father).length > 0
  const globalMenu = []
  routes.forEach((route, index) => {
    const { name, path, meta } = route
    const routeName = name
    let menuChildren
    if (route.children && route.children.length > 0) {
      menuChildren = transformAuthRouteToMenu(route.children, index, route)
    }
    route.index = key ? index : key ? `${key}-${index + 1}` : index + ''

    const menuItem = {
      menu: {
        key: routeName,
        label: meta.title,
        routeName,
        routePath: hasFather ? `/${father.path}/${path}` : '/' + path
      },
      index: key ? `${key}-${index + 1}` : index + '',
      icon: meta.icon,
      children: menuChildren,
      name: meta.title
    }

    if (!hideInMenu(route)) {
      globalMenu.push(menuItem)
    }
  })

  return globalMenu
}

/**
 * 获取当前路由所在菜单数据的paths
 * @param activeKey - 当前路由的key
 * @param menus - 菜单数据
 */
export function getActiveKeyPathsOfMenus(activeKey, menus) {
  return menus.map((menu) => getActiveKeyPathsOfMenu(activeKey, menu)).flat(1)
}

function getActiveKeyPathsOfMenu(activeKey, menu) {
  const keys = []
  if (activeKey.startsWith(menu.routeName)) {
    keys.push(menu.routeName)
  }
  if (menu.children) {
    keys.push(...menu.children.map((item) => getActiveKeyPathsOfMenu(activeKey, item)).flat(1))
  }
  return keys
}

/** 路由不转换菜单 */
function hideInMenu(route) {
  return Boolean(route.meta.hide)
}
