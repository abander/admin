<template>
  <div class="myIndexWrap">
    <div id="container"></div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  mounted() {
    //   页面加载完,开始异步引入高德地图,创建了一个回调函数,高德地图加载完毕会调用
    window.onLoad = function () {
      // 所有关于地图的逻辑全部都要写在这个回调里面
      // 保证高德地图加载完毕
      var map = new AMap.Map('container', {
        zoom: 20, //级别
        center: [121.60642, 31.20095], //中心点坐标
        viewMode: '3D', //使用3D视图
      })

      // 创建一个 Marker 实例：
      var marker = new AMap.Marker({
        position: [121.60642, 31.20095], // 地理位置经纬度
        // title: "上海电子口岸", // 鼠标移上去时显示的内容
        offset: new AMap.Pixel(-27, -20), // 偏移量
        // 可以指定图标图片地址
        icon: '//vdata.amap.com/icons/b18/1/2.png', // 添加 Icon 图标 URL
      })
      /* // 插件的添加,第一个参数为插件名,第二个为回调函数
      AMap.plugin("AMap.ToolBar", function () {
        //异步加载插件
        var toolbar = new AMap.ToolBar();
        map.addControl(toolbar);
      });*/
      // 将创建的点标记添加到已有的地图实例：
      map.add(marker)
    }
    // key是申请的值
    var url =
      'https://webapi.amap.com/maps?v=1.4.15&key=6c52ee3ede0e95c6651eca5d65341f41&callback=onLoad'
    //创建一个 script dom元素 doc需要补全document
    var jsapi = document.createElement('script')
    //设定script标签属性
    jsapi.charset = 'utf-8'
    jsapi.src = url
    //将API文件引入页面中,加载完毕以后会调用函数
    document.head.appendChild(jsapi)
  },
}
</script>

<style scoped>
#container {
  width: 600px;
  height: 400px;
}
</style>
