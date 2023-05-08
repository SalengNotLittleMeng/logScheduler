import BaseList from './base'
import { rowImage } from '../proxy'
//打点队列
export default class LogList extends BaseList<LogListItem>{
    options:Options;
    getCurrentRequestFn:()=>Promise<number>;
    constructor(options:Options){
      super()
      this.options=options;
    }
    async add(item: LogListItem): Promise<void>{
      this.list.push(item) 
      // 当前本身就是空置时直接触发
      if(await this.getCurrentRequestFn()<=this.options.trigger){
          this.requestLog()
      }
    }
    // 获取请求数目的接口
    getCurrentRequestImpl(getCurrentRequestFn:()=>Promise<number>){
       this.getCurrentRequestFn=getCurrentRequestFn
    }
    // 判断是否是log
    isLogger(url:url):boolean {
      const logRegList=this.options.log.map(item=>{
        return new RegExp(item)
      })
      if (typeof url !== 'string') {
        return false;
      }
      if (logRegList.some(reg=>{
        return reg.test(url)
      })) {
        return true;
      }
      return false;
    }
    // 执行请求
     async requestLog(){
      this.list.map(logInfoItem=>{
        this.delete(logInfoItem)
        switch(logInfoItem.type){
          case 'xhr':{
            xhrPromiseFactory(logInfoItem as LogListItemXhr)
            break;
          }
          case 'image':{
            imagePromiseFactory(logInfoItem.url)
            break;
          }
        }
      })
      }
  }
  function xhrPromiseFactory(logInfoItem:LogListItemXhr){
    return new Promise<string>((resolve)=>{
        try{
          const xhr=logInfoItem.instance
          xhr.addEventListener("load", function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                resolve(logInfoItem.url)
            }
          });
          xhr.addEventListener("error",function(){
              resolve(logInfoItem.url)
          })
          logInfoItem.instance.send(logInfoItem.data)
        }catch(e){}
    })
  }
  function imagePromiseFactory(url:string){
    return new Promise<string>((reslove)=>{
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