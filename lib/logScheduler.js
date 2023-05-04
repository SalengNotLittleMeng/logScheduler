const c = Image;
let u = !1;
function h(s) {
  u || (u = !0, window.Image = function(...e) {
    const t = new c(...e);
    return new Proxy(t, {
      get(n, r) {
        return n[r];
      },
      set(n, r, o) {
        return r == "src" && s(o) ? (n[r] = "", !0) : (n[r] = o, !0);
      }
    });
  });
}
class a {
  // 对xhr进行重写，获取正在请求的xhr数目
  constructor(e = {}) {
    this.interceptor = e, this.setRequestHandler(), this.setResponseHandler();
  }
  //劫持xhr，在每次请求时出发请求拦截器
  setRequestHandler() {
    const { open: e, send: t } = XMLHttpRequest.prototype, i = this;
    XMLHttpRequest.prototype.open = function(n, r, o, m, I) {
      i.interceptor.resquest(r), e.apply(this, arguments);
    };
  }
  // 对请求和图片请求成功的毁掉添加响应拦截，避免劫持xhr响应回掉时跟其他SDK的冲突
  setResponseHandler() {
    const e = this;
    new PerformanceObserver(function(i, n) {
      i.getEntries().forEach((r) => {
        ["img", "xmlhttprequest"].includes(r.initiatorType) && e.interceptor.response(r.name);
      });
    }).observe({ entryTypes: ["resource"] });
  }
}
class l {
  constructor() {
    this.list = [];
  }
  add(e) {
    this.list.push(e);
  }
  delete(e) {
    const t = this.list.findIndex((i) => i == e);
    t != -1 && this.list.splice(t, 1);
  }
  getLength() {
    return this.list.length;
  }
  clear() {
    for (; this.list.length; )
      this.list.pop();
  }
}
function p(s) {
  let e = document.querySelector("body"), t = {
    childList: !0,
    attributes: !0,
    subtree: !0
  };
  new MutationObserver(s).observe(e, t);
}
class g extends l {
  constructor() {
    super(), p(this.getCurrentImageResquest.bind(this));
  }
  // 查找出目前正在发生的图片请求
  getCurrentImageResquest() {
    Array.from(document.querySelectorAll("img[src]")).filter((t) => !t.complete).forEach((t) => {
      this.add(t.currentSrc), t.addEventListener("error", () => {
        this.delete(t.currentSrc);
      });
    });
  }
}
class d extends l {
  constructor(e = {}) {
    super(), this.options = e;
  }
  // 判断是否是log
  isLogger(e) {
    const t = new RegExp(this.options.log || /.gif/);
    return typeof e != "string" ? !1 : !!t.test(e);
  }
  async requestLog() {
    const e = this.list.map((t) => new Promise((i, n) => {
      const r = new c();
      r.src = t, i();
    }));
    await Promise.all(e);
  }
}
function L(s) {
  return new g(s);
}
function f(s) {
  return new d(s);
}
class q {
  constructor(e, t, i = {}) {
    this.requestList = e, this.logList = t;
  }
  createRequestInterceptor() {
    return function(e) {
      return this.logList.isLogger(e) ? (this.logList.add(e), !0) : (this.requestList.add(e), !1);
    }.bind(this);
  }
  createResponseInterceptor() {
    return function(e) {
      if (!this.logList.isLogger(e))
        this.requestList.delete(e);
      else
        return;
      this.requestList.getLength() == 0 && this.logList.requestLog();
    }.bind(this);
  }
}
class b {
  constructor(e) {
    this.options = e, this.requestHandler = null, this.requestList = null, this.logList = null, this.interceptor = {}, this.initRequestQueue(), this.initInterceptor(), this.initObserver();
  }
  // 初始化图片劫持和请求观测
  initObserver() {
    h(this.initInterceptor.resquest), this.requestHandler = new a(this.initInterceptor);
  }
  // 初始化请求队列和打点队列
  initRequestQueue() {
    this.requestList = L(this.options), this.logList = f(this.options);
  }
  // 初始化拦截器
  initInterceptor() {
    const e = new q(
      this.requestList,
      this.logList
    );
    this.initInterceptor.resquest = e.createRequestInterceptor(), this.initInterceptor.response = e.createResponseInterceptor();
  }
}
export {
  b as default
};
//# sourceMappingURL=logScheduler.js.map
