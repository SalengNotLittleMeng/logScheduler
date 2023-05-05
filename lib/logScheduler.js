var p = Object.defineProperty;
var d = (r, t, e) => t in r ? p(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var n = (r, t, e) => (d(r, typeof t != "symbol" ? t + "" : t, e), e);
const g = Image;
let l = !1;
function f(r) {
  l || (l = !0, window.Image = function(t, e) {
    const s = new g(t, e);
    return new Proxy(s, {
      get(u, i, c) {
        return Reflect.get(u, i, c);
      },
      set(u, i, c, h) {
        return i == "src" && r(c) ? (u[i] = "", !0) : Reflect.set(u, i, c, h);
      }
    });
  });
}
class q {
  constructor(t) {
    // 对xhr进行重写，获取正在请求的xhr数目
    n(this, "interceptor");
    this.interceptor = t, this.setRequestHandler(), this.setResponseHandler();
  }
  //劫持xhr，在每次请求时出发请求拦截器
  setRequestHandler() {
    const { open: t } = XMLHttpRequest.prototype, e = this;
    XMLHttpRequest.prototype.open = function(s, o, u, i, c) {
      e.interceptor.request(o), t.call(this, s, o, u, i, c);
    };
  }
  // 对请求和图片请求成功的毁掉添加响应拦截，避免劫持xhr响应回掉时跟其他SDK的冲突
  setResponseHandler() {
    const t = this;
    new PerformanceObserver(function(s) {
      s.getEntries().forEach((o) => {
        ["img", "xmlhttprequest"].includes(o.initiatorType) && t.interceptor.response(o.name);
      });
    }).observe({ entryTypes: ["resource"] });
  }
}
class a {
  constructor() {
    n(this, "list", []);
  }
  add(t) {
    this.list.push(t);
  }
  delete(t) {
    const e = this.list.findIndex((s) => s == t);
    e != -1 && this.list.splice(e, 1);
  }
  getLength() {
    return this.list.length;
  }
  clear() {
    for (; this.list.length; )
      this.list.pop();
  }
}
function L(r) {
  let t = document.querySelector("body") || document.createElement("div"), e = {
    childList: !0,
    attributes: !0,
    subtree: !0
  };
  new MutationObserver(r).observe(t, e);
}
class m extends a {
  constructor() {
    super(), L(this.getCurrentImageResquest.bind(this));
  }
  // 查找出目前正在发生的图片请求
  getCurrentImageResquest() {
    Array.from(document.querySelectorAll("img[src]")).filter((e) => !e.complete).forEach((e) => {
      this.add(e.currentSrc), e.addEventListener("error", () => {
        this.delete(e.currentSrc);
      }), e.addEventListener("load", () => {
        this.delete(e.currentSrc);
      });
    });
  }
}
class R extends a {
  constructor(e) {
    super();
    n(this, "options");
    n(this, "getCurrentRequestFn");
    this.options = e;
  }
  add(e) {
    this.list.push(e), this.getCurrentRequestFn() <= this.options.trigger && this.requestLog();
  }
  // 获取请求数目的接口
  getCurrentRequestImpl(e) {
    this.getCurrentRequestFn = e;
  }
  // 判断是否是log
  isLogger(e) {
    const s = new RegExp(this.options.log);
    return typeof e != "string" ? !1 : !!s.test(e);
  }
  async requestLog() {
    this.list.forEach((e) => {
      I(e);
    }), this.clear();
  }
}
function I(r) {
  return new Promise((t) => {
    const e = new g();
    e.src = r, e.onload = function() {
      t(r);
    }, e.onerror = function() {
      t(r);
    };
  });
}
function b() {
  return new m();
}
function v(r) {
  return new R(r);
}
class w {
  constructor(t, e) {
    n(this, "requestList");
    n(this, "logList");
    this.requestList = t, this.logList = e, this.logList.getCurrentRequestImpl(this.getCurrentRequest.bind(this));
  }
  getCurrentRequest() {
    return this.requestList.getLength();
  }
  createRequestInterceptor() {
    const t = this;
    return function(e) {
      return t.logList.isLogger(e) ? (t.logList.add(e.toString()), !0) : (t.requestList.add(e.toString()), !1);
    };
  }
  createResponseInterceptor(t) {
    const e = this;
    return function(s) {
      if (!e.logList.isLogger(s))
        e.requestList.delete(s.toString());
      else
        return !1;
      return e.requestList.getLength() <= t.trigger && e.logList.requestLog(), !0;
    };
  }
}
const y = {
  max: 5,
  trigger: 3,
  log: /log.gif/
};
function x(r) {
  return Object.assign(y, r);
}
class O {
  constructor(t) {
    n(this, "options");
    n(this, "requestHandler");
    n(this, "requestList");
    n(this, "logList");
    n(this, "interceptor", {
      request: () => !0,
      response: () => !0
    });
    this.options = x(t), this.initRequestQueue(), this.initInterceptor(), this.initObserver();
  }
  // 初始化图片劫持和请求观测
  initObserver() {
    f(this.interceptor.request), this.requestHandler = new q(this.interceptor);
  }
  // 初始化请求队列和打点队列
  initRequestQueue() {
    this.requestList = b(), this.logList = v(this.options);
  }
  // 初始化拦截器
  initInterceptor() {
    const t = new w(
      this.requestList,
      this.logList
    );
    this.interceptor.request = t.createRequestInterceptor(), this.interceptor.response = t.createResponseInterceptor(this.options);
  }
}
export {
  O as default
};
//# sourceMappingURL=logScheduler.js.map
