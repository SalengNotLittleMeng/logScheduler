export default class RequestHandler {
  // 对xhr进行重写，获取正在请求的xhr数目
  constructor(interceptor={}) {
    this.interceptor=interceptor
     this.setRequestHandler();
     this.setResponseHandler();
  }
  //劫持xhr，在每次请求时出发请求拦截器
  setRequestHandler() {
    const { open, send } = XMLHttpRequest.prototype;
    const vm=this
    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
      vm.interceptor.request(url)
      open.apply(this, arguments);
    };
  }
  // 对请求和图片请求成功的毁掉添加响应拦截，避免劫持xhr响应回掉时跟其他SDK的冲突
  setResponseHandler(){
    const vm=this
    let observer = new PerformanceObserver(function (entries, observer) {
      entries.getEntries().forEach((entry) => {
          if(['img','xmlhttprequest'].includes(entry.initiatorType)){
            vm.interceptor.response(entry.name)
          }
      });
    });
    observer.observe({ entryTypes: ['resource'] });
  }
}
