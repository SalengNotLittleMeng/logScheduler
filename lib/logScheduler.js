var p = Object.defineProperty;
var d = (s, t, e) => t in s ? p(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e;
var n = (s, t, e) => (d(s, typeof t != "symbol" ? t + "" : t, e), e);
const l = Image;
let g = !1;
function L(s) {
  g || (g = !0, window.Image = function(t, e) {
    const r = new l(t, e);
    return new Proxy(r, {
      get(u, i, c) {
        return Reflect.get(u, i, c);
      },
      set(u, i, c, h) {
        return i == "src" && s(c) ? (u[i] = "", !0) : Reflect.set(u, i, c, h);
      }
    });
  });
}
class f {
  constructor(t) {
    // 对xhr进行重写，获取正在请求的xhr数目
    n(this, "interceptor");
    this.interceptor = t, this.setRequestHandler(), this.setResponseHandler();
  }
  //劫持xhr，在每次请求时出发请求拦截器
  setRequestHandler() {
    const { open: t } = XMLHttpRequest.prototype, e = this;
    XMLHttpRequest.prototype.open = function(r, o, u, i, c) {
      e.interceptor.request(o), t.call(this, r, o, u, i, c);
    };
  }
  // 对请求和图片请求成功的毁掉添加响应拦截，避免劫持xhr响应回掉时跟其他SDK的冲突
  setResponseHandler() {
    const t = this;
    new PerformanceObserver(function(r) {
      r.getEntries().forEach((o) => {
        console.log("23"), ["img", "xmlhttprequest"].includes(o.initiatorType) && t.interceptor.response(o.name);
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
    const e = this.list.findIndex((r) => r == t);
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
function q(s) {
  let t = document.querySelector("body") || document.createElement("div"), e = {
    childList: !0,
    attributes: !0,
    subtree: !0
  };
  new MutationObserver(s).observe(t, e);
}
class m extends a {
  constructor() {
    super(), q(this.getCurrentImageResquest.bind(this));
  }
  // 这里增加异步操作，考虑请求连续增长的问题
  async getLengthAsync() {
    return new Promise((t) => {
      setTimeout(() => {
        t(this.getLength());
      }, 0);
    });
  }
  // 查找出目前正在发生的图片请求
  getCurrentImageResquest() {
    Array.from(document.querySelectorAll("img[src]")).filter((e) => !e.complete).forEach((e) => {
      this.add(e.currentSrc), e.addEventListener("error", () => {
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
  async add(e) {
    this.list.push(e), await this.getCurrentRequestFn() <= this.options.trigger && this.requestLog();
  }
  // 获取请求数目的接口
  getCurrentRequestImpl(e) {
    this.getCurrentRequestFn = e;
  }
  // 判断是否是log
  isLogger(e) {
    const r = new RegExp(this.options.log);
    return typeof e != "string" ? !1 : !!r.test(e);
  }
  async requestLog() {
    this.list.forEach((e) => {
      y(e);
    }), this.clear();
  }
}
function y(s) {
  return new Promise((t) => {
    const e = new l();
    e.src = s, e.onload = function() {
      t(s);
    }, e.onerror = function() {
      t(s);
    };
  });
}
function I() {
  return new m();
}
function w(s) {
  return new R(s);
}
class b {
  constructor(t, e) {
    n(this, "requestList");
    n(this, "logList");
    this.requestList = t, this.logList = e, this.logList.getCurrentRequestImpl(this.getCurrentRequest.bind(this));
  }
  getCurrentRequest() {
    return this.requestList.getLengthAsync();
  }
  createRequestInterceptor() {
    const t = this;
    return function(e) {
      return t.logList.isLogger(e) ? (t.logList.add(e.toString()), !0) : (t.requestList.add(e.toString()), !1);
    };
  }
  createResponseInterceptor(t) {
    const e = this;
    return async function(r) {
      if (!e.logList.isLogger(r))
        e.requestList.delete(r.toString());
      else
        return !1;
      return await e.requestList.getLengthAsync() <= t.trigger && e.logList.requestLog(), !0;
    };
  }
}
const v = {
  max: 5,
  trigger: 3,
  log: /log.gif/
};
function x(s) {
  return Object.assign(v, s);
}
class O {
  constructor(t) {
    n(this, "options");
    n(this, "requestHandler");
    n(this, "requestList");
    n(this, "logList");
    n(this, "interceptor", {
      request: () => !0,
      response: () => new Promise((t) => {
        t(!0);
      })
    });
    this.options = x(t), this.initRequestQueue(), this.initInterceptor(), this.initObserver();
  }
  // 初始化图片劫持和请求观测
  initObserver() {
    L(this.interceptor.request), this.requestHandler = new f(this.interceptor);
  }
  // 初始化请求队列和打点队列
  initRequestQueue() {
    this.requestList = I(), this.logList = w(this.options);
  }
  // 初始化拦截器
  initInterceptor() {
    const t = new b(
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
