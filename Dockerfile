# 使用 nginx 作为基础镜像
FROM nginx:1.23-alpine

# 将编译产物复制到 nginx 的默认静态文件目录
COPY ./dist /usr/share/nginx/html

# 将 nginx 配置文件复制到 nginx 的配置文件目录（这里的 Nginx 配置为 Vue-Router 做了调整，不然使用默认的配置就可以了）
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 80 端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
