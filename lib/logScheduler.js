var h = Object.defineProperty;
var p = (s, e, t) => e in s ? h(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var o = (s, e, t) => (p(s, typeof e != "symbol" ? e + "" : e, t), t);
const l = Image;
let c = !1;
function g(s) {
  c || (c = !0, window.Image = function(...e) {
    const t = new l(...e);
    return new Proxy(t, {
      get(n, r) {
        return n[r];
      },
      set(n, r, u) {
        return r == "src" && s(u) ? (n[r] = "", !0) : (n[r] = u, !0);
      }
    });
  });
}
class d {
  // 对xhr进行重写，获取正在请求的xhr数目
  constructor(e = {}) {
    this.interceptor = e, this.setRequestHandler(), this.setResponseHandler();
  }
  //劫持xhr，在每次请求时出发请求拦截器
  setRequestHandler() {
    const { open: e, send: t } = XMLHttpRequest.prototype, i = this;
    XMLHttpRequest.prototype.open = function(n, r, u, R, w) {
      i.interceptor.request(r), e.apply(this, arguments);
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
class a {
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
function L(s) {
  let e = document.querySelector("body"), t = {
    childList: !0,
    attributes: !0,
    subtree: !0
  };
  new MutationObserver(s).observe(e, t);
}
class q extends a {
  constructor() {
    super(), L(this.getCurrentImageResquest.bind(this));
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
class f extends a {
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
      const r = new l();
      r.src = t, i();
    }));
    await Promise.all(e);
  }
}
function m(s) {
  return new q(s);
}
function b(s) {
  return new f(s);
}
class I {
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
class y {
  constructor(e) {
    o(this, "options");
    o(this, "requestHandler");
    o(this, "requestList");
    o(this, "logList");
    o(this, "interceptor", {
      request: null,
      response: null
    });
    this.options = e, this.initRequestQueue(), this.initInterceptor(), this.initObserver();
  }
  // 初始化图片劫持和请求观测
  initObserver() {
    g(this.interceptor.request), this.requestHandler = new d(this.interceptor);
  }
  // 初始化请求队列和打点队列
  initRequestQueue() {
    this.requestList = m(this.options), this.logList = b(this.options);
  }
  // 初始化拦截器
  initInterceptor() {
    const e = new I(
      this.requestList,
      this.logList
    );
    this.interceptor.request = e.createRequestInterceptor(), this.interceptor.response = e.createResponseInterceptor();
  }
}
export {
  y as default
};
//# sourceMappingURL=logScheduler.js.map
