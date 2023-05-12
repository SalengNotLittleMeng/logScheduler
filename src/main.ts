import {overrideImage} from './proxy';
import RequestHandler from './handler';
import {RequestAbleList} from './handler'
import {requestListFactory,logListFactory} from './queue/index'
import {InterceptorIOCTool} from './queue/index'
import {mergeOptions,extendOptions} from './options/default'
import RequestList from './queue/request';
import LogList from './queue/log';
export default class logScheduler {
  private options:Options;
  public requestList:RequestList;
  public logList:LogList;
  private interceptorIOCTool:InterceptorIOCTool;
  private interceptor:Interceptor={
    request:()=>{return true},
    response:()=>{return new Promise((reslove)=>{reslove(true)})}
  };
  constructor(options:any) {
    // SSR支持，保证可以在部分页面生效
      if(options.usePathSSR){
        const usePaths=options.usePathSSR
        if(!Array.isArray(usePaths)){
          return
        }
       if(!usePaths.includes( window.location.pathname)){
          return
       }
      }
      this.options=mergeOptions(options)
      this.initRequestQueue()
      this.initInterceptor()
      this.initObserver();
  }
  // 初始化图片劫持和请求观测
  private initObserver() {
    overrideImage(this.interceptor.request)
     new RequestHandler(this.interceptor,new RequestAbleList(this.logList));
  }
  // 初始化请求队列和打点队列
  private initRequestQueue(){
      this.requestList=requestListFactory()
      this.logList=logListFactory(this.options)
  }
  // 初始化拦截器
  private initInterceptor(){
      this.interceptorIOCTool=new InterceptorIOCTool(
        this.requestList,this.logList
      )
      this.interceptor.request=this.interceptorIOCTool.createRequestInterceptor()
      this.interceptor.response=this.interceptorIOCTool.createResponseInterceptor(this.options)
  }
  // 动态添加url
  public prefetch(url:string){
    extendOptions(this.options,"log",url)
  }
}
