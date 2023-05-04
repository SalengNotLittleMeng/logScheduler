import {overrideImage} from './proxy';
import RequestHandler from './handler';
import {requestListFactory,logListFactory} from './queue/index'
import {InterceptorIOCTool} from './queue/index'
export default class logScheduler {
  constructor(options) {
    this.options = options;
    this.requestHandler = null;
    this.requestList=null;
    this.logList=null;
    this.interceptor={}
    this.initRequestQueue()
    this.initInterceptor()
    this.initObserver();
  }
  // 初始化图片劫持和请求观测
  initObserver() {
    overrideImage(this.initInterceptor.resquest)
    this.requestHandler = new RequestHandler(this.initInterceptor);
  }
  // 初始化请求队列和打点队列
  initRequestQueue(){
      this.requestList=requestListFactory(this.options)
      this.logList=logListFactory(this.options)
  }
  // 初始化拦截器
  initInterceptor(){
      const interceptorIOCTool=new InterceptorIOCTool(
        this.requestList,this.logList
      )
      this.initInterceptor.resquest=interceptorIOCTool.createRequestInterceptor()
      this.initInterceptor.response=interceptorIOCTool.createResponseInterceptor()
  }
}
