var h = Object.defineProperty;
var d = (r, t, e) => t in r ? h(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var i = (r, t, e) => (d(r, typeof t != "symbol" ? t + "" : t, e), e);
const a = Image;
let l = !1;
function f(r) {
  l || (l = !0, window.Image = function(t, e) {
    const s = new a(t, e);
    return new Proxy(s, {
      get(c, n, u) {
        return Reflect.get(c, n, u);
      },
      set(c, n, u, p) {
        return n == "src" && r(u) ? (c[n] = "", !0) : Reflect.set(c, n, u, p);
      }
    });
  });
}
class L {
  constructor(t) {
    // 对xhr进行重写，获取正在请求的xhr数目
    i(this, "interceptor");
    this.interceptor = t, this.setRequestHandler(), this.setResponseHandler();
  }
  //劫持xhr，在每次请求时出发请求拦截器
  setRequestHandler() {
    const { open: t } = XMLHttpRequest.prototype, e = this;
    XMLHttpRequest.prototype.open = function(s, o, c, n, u) {
      e.interceptor.request(o), t.call(this, s, o, c, n, u);
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
class g {
  constructor() {
    i(this, "list", []);
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
function q(r) {
  let t = document.querySelector("body") || document.createElement("div"), e = {
    childList: !0,
    attributes: !0,
    subtree: !0
  };
  new MutationObserver(r).observe(t, e);
}
class m extends g {
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
class R extends g {
  constructor(e = {}) {
    super();
    i(this, "options");
    this.options = e;
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
    const e = new a();
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
class H {
  constructor(t) {
    i(this, "options");
    i(this, "requestHandler");
    i(this, "requestList");
    i(this, "logList");
    i(this, "interceptor", {
      request: () => !0,
      response: () => !0
    });
    this.options = x(t), this.initRequestQueue(), this.initInterceptor(), this.initObserver();
  }
  // 初始化图片劫持和请求观测
  initObserver() {
    f(this.interceptor.request), this.requestHandler = new L(this.interceptor);
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
  H as default
};
//# sourceMappingURL=logScheduler.js.map
