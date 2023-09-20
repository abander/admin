# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).
```
project
|   |   |   |                 
│   └───views
|   |   |   article        (测试tab暂时)
|   |   |   c-example      (组件示例)
|   |   |   firm           (公司)
|   |   |   fn             (功能)    
|   |   |   |   pdf              (pdf)              
|   |   |   |   theme            (主题)              
|   |   |   |   upload-and-download    (导入导出功能)              
|   |   |   login          (登录页面)
|   |   |   main           (测试tab暂时)
|   |   |   map            (地图)
|   |   |   practice       (练习) 
|   |   |   |    component-transfer-value  （父子传值）
|   |   |   |    mixins         （混入）
|   |   |   |    promise        （promise）
|   |   |   |    recursion      （递归）
|   |   |   |    slot           （插槽）
|   |   |   principle       (原理)
|   |   |   |    set            （this.$set原理）
|   |   |   |    v-model         （v-model原理）
|   |   |   test            (测试tab暂时)
|   |   |   user            (测试tab暂时)      
```


## 开发分支规范

### 分支
#### master 暂时不用
    与release分支同步,但是不会发布生产环境
#### dev

#### release  发布分支
    开发完毕后，如果需要发布生产，则把master代码合并到release分支，push后会自动发布

#### feature/xxx  开发功能分支
      如果开发新功能，则从dev分支拉取feature/xxx(功能名)分支，开发完毕后，合并到dev分支，然后再统一合到master

  
