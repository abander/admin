// store.js
// getters和state中不能使用相同的名字，但是vuex中可以使用相同的名字
// 在pinia中this指代state
import { defineStore } from 'pinia'

// defineStore 调用后返回一个函数，调用该函数获得 Store 实体
export const userStore = defineStore('userState', {
  // id: 必须的，在所有 Store 中唯一
  // state: 返回对象的函数
  state: () => ({
    //存储token解析之后的内容 token解析之后是对象
    user: {}
  }),
  //通过getters对状态state进行获取
  getters: {
    getUser: (state) => state.user
  },
  actions: {
    //解析的用户
    setUser(user) {
      if (user) {
        this.user = user
      } else {
        this.user = {}
      }
    }
  },
  persist: true
})
