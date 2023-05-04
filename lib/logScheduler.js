var h = Object.defineProperty;
var d = (s, e, t) => e in s ? h(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var n = (s, e, t) => (d(s, typeof e != "symbol" ? e + "" : e, t), t);
const p = Image;
let a = !1;
function L(s) {
  a || (a = !0, window.Image = function(e, t) {
    const r = new p(e, t);
    return new Proxy(r, {
      get(i, o, u) {
        return Reflect.get(i, o, u);
      },
      set(i, o, u, l) {
        return o == "src" && s(u) ? (i[o] = "", !0) : Reflect.set(i, o, u, l);
      }
    });
  });
}
class f {
  // 对xhr进行重写，获取正在请求的xhr数目
  constructor(e = {}) {
    this.interceptor = e, this.setRequestHandler(), this.setResponseHandler();
  }
  //劫持xhr，在每次请求时出发请求拦截器
  setRequestHandler() {
    const { open: e, send: t } = XMLHttpRequest.prototype, r = this;
    XMLHttpRequest.prototype.open = function(c, i, o, u, l) {
      r.interceptor.request(i), e.apply(this, arguments);
    };
  }
  // 对请求和图片请求成功的毁掉添加响应拦截，避免劫持xhr响应回掉时跟其他SDK的冲突
  setResponseHandler() {
    const e = this;
    new PerformanceObserver(function(r, c) {
      r.getEntries().forEach((i) => {
        ["img", "xmlhttprequest"].includes(i.initiatorType) && e.interceptor.response(i.name);
      });
    }).observe({ entryTypes: ["resource"] });
  }
}
class g {
  constructor() {
    n(this, "list", []);
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
class m extends g {
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
class R extends g {
  constructor(t = {}) {
    super();
    n(this, "options");
    this.options = t;
  }
  // 判断是否是log
  isLogger(t) {
    const r = new RegExp(this.options.log || /.gif/);
    return typeof t != "string" ? !1 : !!r.test(t);
  }
  async requestLog() {
    const t = this.list.map((r) => new Promise((c) => {
      const i = new p();
      i.src = r, c(r);
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
    n(this, "requestList");
    n(this, "logList");
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
    n(this, "options");
    n(this, "requestHandler");
    n(this, "requestList");
    n(this, "logList");
    n(this, "interceptor", {
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
