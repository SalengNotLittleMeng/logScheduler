import RequestList from './request'
import LogList from './log'
let request=null
let log=null
//这里工厂+单例，方便后期动态修改或添加配置
export function requestListFactory(options){
    if(!request){
      return new RequestList(options)
    }
    return request
}
export function logListFactory(options){
   if(!log){
    return new LogList(options)
   }
   return log
}
// 解耦工具类，将主类和队列类进行解耦
export class InterceptorIOCTool{
  constructor(requestList,logList,options={}){
      this.requestList=requestList
      this.logList=logList
  }
  createRequestInterceptor(){
    return function(url){
      if(this.logList.isLogger(url)){
        this.logList.add(url)
        return true
      }
      this.requestList.add(url)
      return false
    }.bind(this)
  }
  createResponseInterceptor(){
    return function(url){
      if(!this.logList.isLogger(url)){
        this.requestList.delete(url)
      } else{
        // 如果是log,直接返回，防止递归死循环
        return
      }
      if(this.requestList.getLength()==0){
          this.logList.requestLog()
      }
    }.bind(this)
  }
}
