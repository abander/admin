import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// element 按需引入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createHtmlPlugin } from 'vite-plugin-html'
import { getInjectData } from './src/config/injectScript'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    resolve: {
      alias: {
        '@': resolve('./src')
      }
    },
    base: '/admin/', // 打包路径
    server: {
      port: 4000, // 服务端口号
      open: true, // 服务启动时是否自动打开浏览器
      cors: true, // 允许跨域
      proxy: {
        '/api': {
          target: 'https://lianghj.top:8888/api/private/v1/',
          changeOrigin: true,
          // 重写传过来的path路径，比如 `/api/index/1?id=10&name=zs`（注意:path路径最前面有斜杠（/），因此，正则匹配的时候不要忘了是斜杠（/）开头的；选项的 key 也是斜杠（/）开头的）
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/smq': {
          target: 'http://39.107.248.238',
          changeOrigin: true
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import "/src/styles/variables";
          `
        }
      }
    },
    plugins: [
      vue(),
      // element 按需引入
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      }),
      createHtmlPlugin({
        minify: true,
        template: './index.html',
        inject: {
          data: {
            injectScript: getInjectData(),
            title: env.VITE_TITLE
          }
        }
      })
    ],
    // 解决  process is not defined 问题
    define: {
      'process.env': process.env
    }
  }
})
