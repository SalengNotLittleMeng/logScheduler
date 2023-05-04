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
          const requestList=this.list.map(url=>{
            return new Promise((reslove)=>{
                const img=new rowImage()
                img.src=url
                img.onload=function(event){
                  if(img.onload){
                    img.onload(event)
                  }
                  reslove(url)
                }
                img.onerror=function(event){
                  if(img.onerror){
                    img.onerror(event)
                  }
                  reslove(url)
                }
            })
          })
        await  multiRequest(requestList,this.options.max)
      }
  }