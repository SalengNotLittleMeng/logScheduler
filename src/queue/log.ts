import BaseList from './base'
import { rowImage } from '../proxy'
//打点队列
export default class LogList extends BaseList{
    options:Options;
    getCurrentRequestFn:()=>Promise<number>;
    constructor(options:Options){
      super()
      this.options=options;
    }
    async add(item: string): Promise<void>{
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