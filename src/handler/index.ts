import LogList from "../queue/log";
import {logObjectFactory} from '../queue/index'
import { transfromCompleteURl} from '../utils'
export default class RequestHandler {
  // 对xhr进行重写，获取正在请求的xhr数目
  private interceptor;
  private requestAbleList;
  constructor(interceptor:Interceptor,requestAbleList:RequestAbleList) {
    this.interceptor=interceptor
    this.requestAbleList=requestAbleList
     this.setRequestHandler();
     this.setResponseHandler();
  }
  //劫持xhr，在每次请求时出发请求拦截器
  setRequestHandler() {
    const { open,send } = XMLHttpRequest.prototype;
    const vm=this
    XMLHttpRequest.prototype.open = function (this:any,method, url, async, user, password) {
      vm.interceptor.request(transfromCompleteURl(url),'xhr')
      open.call(this, method,url,async,user,password);
    } as { 
      (method: string, url: string | URL): void;
      (method: string, url: string | URL, async: boolean, username?: string | null | undefined, password?: string | null | undefined): void;
        }
    XMLHttpRequest.prototype.send=function(data:Document|XMLHttpRequestBodyInit|null|undefined){
        const responseURL=transfromCompleteURl(this.responseURL)
        if(vm.requestAbleList.include(responseURL)){
           vm.requestAbleList.add(responseURL,this,data)
           return
        }
        send.call(this,data)
    }
  }
  // 对请求和图片请求成功的毁掉添加响应拦截，避免劫持xhr响应回掉时跟其他SDK的冲突
  setResponseHandler(){
    const vm=this
    let observer = new PerformanceObserver(function (entries) {
      entries.getEntries().forEach((entry) => {
          if(['img','xmlhttprequest'].includes((entry as PerformanceEntryResource).initiatorType)){
            vm.interceptor.response(entry.name)
          }
      });
    });
    observer.observe({ entryTypes: ['resource'] });
  }
} 
// XHR打点请求类
export class RequestAbleList{
  public requestAbleList:string[]
  private logList:LogList
  constructor(logList:LogList){
    this.logList=logList
  }
  include(url:string){
    return this.logList.list.find(logItem=>{
        return logItem.url===url
    })
  }
  add(url:string,xhr:XMLHttpRequest,data:XMLHttpRequestData){
    this.logList.add(logObjectFactory(url,'xhr',xhr,data))
  }
}


