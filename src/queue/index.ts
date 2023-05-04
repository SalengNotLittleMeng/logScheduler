import RequestList from './request'
import LogList from './log'
let request:RequestList|null=null
let log:LogList|null=null
//这里工厂+单例，方便后期动态修改或添加配置
export function requestListFactory():RequestList{
    if(!request){
      return new RequestList()
    }
    return request
}
export function logListFactory(options:any):LogList{
   if(!log){
    return new LogList(options)
   }
   return log
}
// 解耦工具类，将主类和队列类进行解耦
export class InterceptorIOCTool{
  requestList:RequestList
  logList:LogList
  constructor(requestList:RequestList,logList:LogList){
      this.requestList=requestList
      this.logList=logList
  }
  createRequestInterceptor(){
    const vm=this
    return function(url:string){
      if(vm.logList.isLogger(url)){
        vm.logList.add(url)
        return true
      }
      vm.requestList.add(url)
      return false
    }
  }
  createResponseInterceptor(){
    const vm=this
    return function(url:string){
      if(!vm.logList.isLogger(url)){
        vm.requestList.delete(url)
      } else{
        // 如果是log,直接返回，防止递归死循环
        return false
      }
      if(vm.requestList.getLength()==0){
          vm.logList.requestLog()
      }
      return true
    }
  }
}
