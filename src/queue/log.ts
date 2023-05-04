import BaseList from './base'
import { rowImage } from '../proxy'
//打点队列
export default class LogList extends BaseList{
    options:any
    constructor(options={}){
      super()
      this.options=options
    }
    // 判断是否是log
    isLogger(url:string):boolean {
      const logReg=new RegExp(this.options.log)
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
          return new Promise((reslove)=>{
              const img=new rowImage()
              img.src=url
              reslove(url)
          })
        })
        await Promise.all(requestList)
     }
  }