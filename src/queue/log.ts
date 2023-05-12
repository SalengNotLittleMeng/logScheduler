import BaseList from './base'
import { rowImage } from '../proxy'
import { cloneDeep } from '../utils';
//打点队列
export default class LogList extends BaseList<LogListItem>{
    private options:Options;
    private  getCurrentRequestFn:()=>Promise<number>;
    constructor(options:Options){
      super()
      this.options=options;
    }
   public async add(item: LogListItem): Promise<void>{
      this.list.push(item) 
      // 当前本身就是空置时直接触发
      if(await this.getCurrentRequestFn()<=this.options.trigger){
          this.requestLog()
      }
    }
    // 获取请求数目的接口
   public getCurrentRequestImpl(getCurrentRequestFn:()=>Promise<number>){
       this.getCurrentRequestFn=getCurrentRequestFn
    }
    // 判断是否是log
   public isLogger(url:url):boolean {
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
    public async requestLog(){
      const LogHandlerList=cloneDeep(this.list)
      LogHandlerList.filter(item=>item).map(logInfoItem=>{
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
  // 执行XHR请求，这里直接用实例调用send方法
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
  // 执行图片请求
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