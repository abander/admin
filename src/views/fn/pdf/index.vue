<template>
  <div>
    <!--  <iframe src='https://view.officeapps.live.com/op/view.aspx?src=https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/18/172c55504d85a43f~tplv-t2oaga2asx-watermark.awebp'
          width='100%'
          height='100%'
          frameborder='1'>
</iframe>-->
    <!--  <div style="height:800px;">
    <iframe :src="pdfSrc" width="100%" height="100%"></iframe>
  </div>-->
    <!--  <div>
    <iframe src='https://view.officeapps.live.com/op/view.aspx?src=http://ab.eptrade.cn/swgd-imap-ui/static/img/headPortraits.e3c004aa.png'
            width="100%"
            height="100%"></iframe>
  </div>-->
    <select id="id_Environment" name="Environment">
      <option style="display: none"></option>
      <option>a</option>
      <option>b</option>
      <option>c</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      pdffile: '',
      pdfSrc: '',
    }
  },
  methods: {
    /*getSeePdf(file){
      this.pdffile=file
      let routeUrl = 'http://ab.eptrade.cn/cusclientspboot/pcrimg/94a0ad2b18514ac08dc980c62559e9dc/1.0';//文件地址url
      let pSrc = routeUrl + '?r=' + new Date();
      this.pdfSrc = 'static/pdf/web/viewer.html?file=' + encodeURIComponent(pSrc) + '.img';


      /!*let routeUrl = 'http://localhost:3000/assets/ppt/在线申请操作手册.pptx’;//https://aaaaaa.com/file/download?filename=file.obj_id
      let url = encodeURIComponent(routeUrl)
      let officeUrl = 'http://view.officeapps.live.com/op/view.aspx?src='+url
      window.open(officeUrl,'_target')
*!/
      //blob:http://ab.eptrade.cn/74faee59-696c-4729-b345-7dca8cda16d3
    },*/
  },
}
</script>

<style scoped></style>
