var h = Object.defineProperty;
var d = (s, t, e) => t in s ? h(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e;
var i = (s, t, e) => (d(s, typeof t != "symbol" ? t + "" : t, e), e);
const g = Image;
let l = !1;
function L(s) {
  l || (l = !0, window.Image = function(t, e) {
    const r = new g(t, e);
    return new Proxy(r, {
      get(o, c, u) {
        return Reflect.get(o, c, u);
      },
      set(o, c, u, p) {
        return c == "src" && s(u) ? (o[c] = "", !0) : Reflect.set(o, c, u, p);
      }
    });
  });
}
class f {
  constructor(t) {
    // 对xhr进行重写，获取正在请求的xhr数目
    i(this, "interceptor");
    this.interceptor = t, this.setRequestHandler(), this.setResponseHandler();
  }
  //劫持xhr，在每次请求时出发请求拦截器
  setRequestHandler() {
    const { open: t } = XMLHttpRequest.prototype, e = this;
    XMLHttpRequest.prototype.open = function(r, n, o, c, u) {
      e.interceptor.request(n), t.call(this, r, n, o, c, u);
    };
  }
  // 对请求和图片请求成功的毁掉添加响应拦截，避免劫持xhr响应回掉时跟其他SDK的冲突
  setResponseHandler() {
    const t = this;
    new PerformanceObserver(function(r) {
      r.getEntries().forEach((n) => {
        ["img", "xmlhttprequest"].includes(n.initiatorType) && t.interceptor.response(n.name);
      });
    }).observe({ entryTypes: ["resource"] });
  }
}
class a {
  constructor() {
    i(this, "list", []);
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
  constructor(e = {}) {
    super();
    i(this, "options");
    this.options = e;
  }
  // 判断是否是log
  isLogger(e) {
    const r = new RegExp(this.options.log);
    return typeof e != "string" ? !1 : !!r.test(e);
  }
  async requestLog() {
    const e = this.list.map((r) => new Promise((n) => {
      const o = new g();
      o.src = r, n(r);
    }));
    await Promise.all(e);
  }
}
function v() {
  return new m();
}
function I(s) {
  return new R(s);
}
class b {
  constructor(t, e) {
    i(this, "requestList");
    i(this, "logList");
    this.requestList = t, this.logList = e;
  }
  createRequestInterceptor() {
    const t = this;
    return function(e) {
      return t.logList.isLogger(e) ? (t.logList.add(e.toString()), !0) : (t.requestList.add(e.toString()), !1);
    };
  }
  createResponseInterceptor(t) {
    const e = this;
    return function(r) {
      if (!e.logList.isLogger(r))
        e.requestList.delete(r.toString());
      else
        return !1;
      return e.requestList.getLength() <= t.trigger && e.logList.requestLog(), !0;
    };
  }
}
const w = {
  trigger: 3,
  log: /log.gif/
};
function y(s) {
  return Object.assign(w, s);
}
class x {
  constructor(t) {
    i(this, "options");
    i(this, "requestHandler");
    i(this, "requestList");
    i(this, "logList");
    i(this, "interceptor");
    this.options = y(t), this.initRequestQueue(), this.initInterceptor(), this.initObserver();
  }
  // 初始化图片劫持和请求观测
  initObserver() {
    L(this.interceptor.request), this.requestHandler = new f(this.interceptor);
  }
  // 初始化请求队列和打点队列
  initRequestQueue() {
    this.requestList = v(), this.logList = I(this.options);
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
  x as default
};
//# sourceMappingURL=logScheduler.js.map
