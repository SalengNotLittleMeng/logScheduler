var h = Object.defineProperty;
var d = (s, e, t) => e in s ? h(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var i = (s, e, t) => (d(s, typeof e != "symbol" ? e + "" : e, t), t);
const a = Image;
let l = !1;
function L(s) {
  l || (l = !0, window.Image = function(e, t) {
    const r = new a(e, t);
    return new Proxy(r, {
      get(o, c, u) {
        return Reflect.get(o, c, u);
      },
      set(o, c, u, g) {
        return c == "src" && s(u) ? (o[c] = "", !0) : Reflect.set(o, c, u, g);
      }
    });
  });
}
class f {
  constructor(e) {
    // 对xhr进行重写，获取正在请求的xhr数目
    i(this, "interceptor");
    this.interceptor = e, this.setRequestHandler(), this.setResponseHandler();
  }
  //劫持xhr，在每次请求时出发请求拦截器
  setRequestHandler() {
    const { open: e } = XMLHttpRequest.prototype, t = this;
    XMLHttpRequest.prototype.open = function(r, n, o, c, u) {
      t.interceptor.request(n), e.call(this, r, n, o, c, u);
    };
  }
  // 对请求和图片请求成功的毁掉添加响应拦截，避免劫持xhr响应回掉时跟其他SDK的冲突
  setResponseHandler() {
    const e = this;
    new PerformanceObserver(function(r) {
      r.getEntries().forEach((n) => {
        ["img", "xmlhttprequest"].includes(n.initiatorType) && e.interceptor.response(n.name);
      });
    }).observe({ entryTypes: ["resource"] });
  }
}
class p {
  constructor() {
    i(this, "list", []);
  }
  add(e) {
    this.list.push(e);
  }
  delete(e) {
    const t = this.list.findIndex((r) => r == e);
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
function q(s) {
  let e = document.querySelector("body") || document.createElement("div"), t = {
    childList: !0,
    attributes: !0,
    subtree: !0
  };
  new MutationObserver(s).observe(e, t);
}
class m extends p {
  constructor() {
    super(), q(this.getCurrentImageResquest.bind(this));
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
class R extends p {
  constructor(t = {}) {
    super();
    i(this, "options");
    this.options = t;
  }
  // 判断是否是log
  isLogger(t) {
    const r = new RegExp(this.options.log || /.gif/);
    return typeof t != "string" ? !1 : !!r.test(t);
  }
  async requestLog() {
    const t = this.list.map((r) => new Promise((n) => {
      const o = new a();
      o.src = r, n(r);
    }));
    await Promise.all(t);
  }
}
function v() {
  return new m();
}
function I(s) {
  return new R(s);
}
class b {
  constructor(e, t) {
    i(this, "requestList");
    i(this, "logList");
    this.requestList = e, this.logList = t;
  }
  createRequestInterceptor() {
    const e = this;
    return function(t) {
      return e.logList.isLogger(t) ? (e.logList.add(t), !0) : (e.requestList.add(t), !1);
    };
  }
  createResponseInterceptor() {
    const e = this;
    return function(t) {
      if (!e.logList.isLogger(t))
        e.requestList.delete(t);
      else
        return !1;
      return e.requestList.getLength() == 0 && e.logList.requestLog(), !0;
    };
  }
}
class y {
  constructor(e) {
    i(this, "options");
    i(this, "requestHandler");
    i(this, "requestList");
    i(this, "logList");
    i(this, "interceptor", {
      request: null,
      response: null
    });
    this.options = e, this.initRequestQueue(), this.initInterceptor(), this.initObserver();
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
    const e = new b(
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
