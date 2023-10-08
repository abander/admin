/* getPageDetailByIdw(pageId,i) {
     post(this.getPageDetailApi, {pageId }).then((res) => {
       if (res.code === 200) {
         const result = res.data;
         const list = result.list;
         delete result.list;
         this.tableConfig = {
           blockSize: result.blockSize,
           labelAlign: result.labelAlign,
           labelWidth: result.labelWidth,
           isDefault: "0",
           type: this.currentBlockModule,
         };
         // 因自定义组件和组件库返回数据格式不同，需对list特殊处理
         let dealList = [];
         list.forEach((v) => {
           if (v.list) {
             dealList = dealList.concat(v.list);
           } else {
             dealList.push(v);
           }
         });
         dealList.forEach((e) => {
           if (e.userBlockId) {
             e.blockId = e.userBlockId;
             e.blockType = TEMPLATE_TYPE_BLOCK;
           }
         });
         if (dealList.length == 0) {
           this.$pop.info("页面" + result.blockName + "下无其他组件");
         }
         dealList=[...dealList]
         if(this.data.length){
           this.data[0].clickType[0].checkList=[...this.data[0].clickType[0].checkList,...dealList]
         }
       }
     });
   },*/

//以上面为基准进行封装promise
function getPageDetailByIdw(pageId, i) {
  return new Promise((resolve, reject) => {
    try {
      post(this.getPageDetailApi, { pageId }).then((res) => {
        if (res.code === 200) {
          const result = res.data
          const list = result.list
          delete result.list
          this.tableConfig = {
            blockSize: result.blockSize,
            labelAlign: result.labelAlign,
            labelWidth: result.labelWidth,
            isDefault: '0',
            type: this.currentBlockModule
          }
          // 因自定义组件和组件库返回数据格式不同，需对list特殊处理
          let dealList = []
          list.forEach((v) => {
            if (v.list) {
              dealList = dealList.concat(v.list)
            } else {
              dealList.push(v)
            }
          })
          dealList.forEach((e) => {
            if (e.userBlockId) {
              e.blockId = e.userBlockId
              e.blockType = TEMPLATE_TYPE_BLOCK
            }
          })
          if (dealList.length == 0) {
            this.$pop.info('页面' + result.blockName + '下无其他组件')
            resolve({ result, dealList, flag: 'empty' }) // promise成功
          } else {
            dealList = [...dealList]
            if (this.data.length) {
              //this.data[0].clickType[0].checkList=[...this.data[0].clickType[0].checkList,...dealList]
              resolve({ result, dealList, flag: 'success' }) // promise 成功，可将需要的数据传出，外面用await接收
            }
          }
        }
      })
    } catch (e) {
      reject(e) //处理错误的promise
    }
  })
}
