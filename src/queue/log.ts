import BaseList from './base'
import { rowImage } from '../proxy'
import {multiRequest} from '../utils'
//打点队列
export default class LogList extends BaseList{
    options:any;
    constructor(options={}){
      super()
      this.options=options;
    }
    // 判断是否是log
    isLogger(url:url):boolean {
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
      this.list.forEach(url=>{
        imagePromiseFactory(url)
      })
      this.clear()
      }
  }

  function imagePromiseFactory(url:string){
    return new Promise<any>((reslove)=>{
      const img=new rowImage()
      img.src=url
      img.onload=function(){
        reslove(url)
      }
      img.onerror=function(){
        reslove(url)
      }
  })
  }