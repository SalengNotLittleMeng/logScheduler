import {overrideImage} from './proxy';
import RequestHandler from './handler';
import {requestListFactory,logListFactory} from './queue/index'
import {InterceptorIOCTool} from './queue/index'
interface InitInterceptor{
    request:any,
    response:any
}
export default class logScheduler {
  options:any;
  requestHandler:any;
  requestList:any
  logList:any;
  interceptor:InitInterceptor={
    request:null,
    response:null
  };
  constructor(options:any) {
    this.options=options;
    this.initRequestQueue()
    this.initInterceptor()
    this.initObserver();
  }
  // 初始化图片劫持和请求观测
  initObserver() {
    overrideImage(this.interceptor.request)
    this.requestHandler = new RequestHandler(this.interceptor);
  }
  // 初始化请求队列和打点队列
  initRequestQueue(){
      this.requestList=requestListFactory()
      this.logList=logListFactory(this.options)
  }
  // 初始化拦截器
  initInterceptor(){
      const interceptorIOCTool=new InterceptorIOCTool(
        this.requestList,this.logList
      )
      this.interceptor.request=interceptorIOCTool.createRequestInterceptor()
      this.interceptor.response=interceptorIOCTool.createResponseInterceptor()
  }
}
