import BaseList from './base'
import { rowImage } from '../proxy'
//打点队列
export default class LogList extends BaseList{
    constructor(options={}){
      super()
      this.options=options
    }
    // 判断是否是log
    isLogger(url) {
      const logReg=new RegExp(this.options.log || /.gif/)
      if (typeof url !== 'string') {
        return false;
      }
      if (logReg.test(url)) {
        return true;
      }
      return false;
    }
     async requestLog(){
        const requestList=this.list.map(url=>{
          return new Promise((reslove,reject)=>{
              const img=new rowImage()
              img.src=url
              reslove()
          })
        })
        await Promise.all(requestList)
     }
  }