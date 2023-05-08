var L = Object.defineProperty;
var q = (r, e, t) => e in r ? L(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var n = (r, e, t) => (q(r, typeof e != "symbol" ? e + "" : e, t), t);
const p = Image;
let h = !1;
function m(r) {
  h || (h = !0, window.Image = function(e, t) {
    const s = new p(e, t);
    return new Proxy(s, {
      get(o, u, l) {
        return Reflect.get(o, u, l);
      },
      set(o, u, l, g) {
        return u == "src" && r(l, "image") ? (o[u] = "", !0) : Reflect.set(o, u, l, g);
      }
    });
  });
}
class d {
  constructor() {
    n(this, "list", []);
  }
  add(e) {
    this.list.push(e);
  }
  delete(e) {
    const t = this.list.findIndex((s) => s == e);
    t != -1 && this.list.splice(t, 1);
  }
  getLength() {
    return this.list.length;
  }
  includes(e) {
    return this.list.includes(e);
  }
  clear() {
    for (; this.list.length; )
      this.list.pop();
  }
}
function R(r) {
  let e = document.querySelector("body") || document.createElement("div"), t = {
    childList: !0,
    attributes: !0,
    subtree: !0
  };
  new MutationObserver(r).observe(e, t);
}
class w extends d {
  constructor() {
    super(), R(this.getCurrentImageResquest.bind(this));
  }
  // 这里增加异步操作，考虑请求连续增长的问题
  async getLengthAsync() {
    return new Promise((e) => {
      setTimeout(() => {
        e(this.getLength());
      }, 0);
    });
  }
  // 查找出目前正在发生的图片请求
  getCurrentImageResquest() {
    Array.from(document.querySelectorAll("img[src]")).filter((t) => !t.complete).forEach((t) => {
      this.add(t.currentSrc);
    });
  }
}
class y extends d {
  constructor(t) {
    super();
    n(this, "options");
    n(this, "getCurrentRequestFn");
    this.options = t;
  }
  async add(t) {
    this.list.push(t), await this.getCurrentRequestFn() <= this.options.trigger && this.requestLog();
  }
  // 获取请求数目的接口
  getCurrentRequestImpl(t) {
    this.getCurrentRequestFn = t;
  }
  // 判断是否是log
  isLogger(t) {
    const s = this.options.log.map((i) => new RegExp(i));
    return typeof t != "string" ? !1 : !!s.some((i) => i.test(t));
  }
  // 执行请求
  async requestLog() {
    this.list.map((t) => {
      switch (this.delete(t), t.type) {
        case "xhr": {
          x(t);
          break;
        }
        case "image": {
          A(t.url);
          break;
        }
      }
    });
  }
}
function x(r) {
  return new Promise((e) => {
    try {
      const t = r.instance;
      t.addEventListener("load", function() {
        t.readyState == 4 && t.status == 200 && e(r.url);
      }), t.addEventListener("error", function() {
        e(r.url);
      }), r.instance.send(r.data);
    } catch {
    }
  });
}
function A(r) {
  return new Promise((e) => {
    const t = new p();
    t.src = r, t.onload = function() {
      e(r);
    }, t.onerror = function() {
      e(r);
    };
  });
}
function v() {
  return new w();
}
function O(r) {
  return new y(r);
}
function f(r, e, t, s) {
  return {
    url: r.toString(),
    type: e,
    instance: t,
    data: s
  };
}
class b {
  constructor(e, t) {
    n(this, "requestList");
    n(this, "logList");
    this.requestList = e, this.logList = t, this.logList.getCurrentRequestImpl(this.getCurrentRequest.bind(this));
  }
  getCurrentRequest() {
    return this.requestList.getLengthAsync();
  }
  createRequestInterceptor() {
    const e = this;
    return function(t, s) {
      const i = f(t, s);
      return e.logList.isLogger(t) ? (e.logList.add(i), !0) : (e.requestList.add(t.toString()), !1);
    };
  }
  createResponseInterceptor(e) {
    const t = this;
    return async function(s) {
      if (!t.logList.isLogger(s))
        t.requestList.delete(s.toString());
      else
        return !1;
      return await t.requestList.getLengthAsync() <= e.trigger && t.logList.requestLog(), !0;
    };
  }
}
class C {
  constructor(e, t) {
    // 对xhr进行重写，获取正在请求的xhr数目
    n(this, "interceptor");
    n(this, "requestAbleList");
    this.interceptor = e, this.requestAbleList = t, this.setRequestHandler(), this.setResponseHandler();
  }
  //劫持xhr，在每次请求时出发请求拦截器
  setRequestHandler() {
    const { open: e, send: t } = XMLHttpRequest.prototype, s = this;
    XMLHttpRequest.prototype.open = function(i, o, u, l, g) {
      s.interceptor.request(o, "xhr"), e.call(this, i, o, u, l, g);
    }, XMLHttpRequest.prototype.send = function(i) {
      if (s.requestAbleList.include(this.responseURL)) {
        s.requestAbleList.add(this.responseURL, this, i);
        return;
      }
      t.call(this, i);
    };
  }
  // 对请求和图片请求成功的毁掉添加响应拦截，避免劫持xhr响应回掉时跟其他SDK的冲突
  setResponseHandler() {
    const e = this;
    new PerformanceObserver(function(s) {
      s.getEntries().forEach((i) => {
        ["img", "xmlhttprequest"].includes(i.initiatorType) && e.interceptor.response(i.name);
      });
    }).observe({ entryTypes: ["resource"] });
  }
}
class S {
  constructor(e) {
    n(this, "requestAbleList");
    n(this, "logList");
    this.logList = e;
  }
  include(e) {
    return this.logList.list.find((t) => t.url === e);
  }
  add(e, t, s) {
    this.logList.add(f(e, "xhr", t, s));
  }
}
function c(r, e) {
  return Object.prototype.toString.call(e) === `[object ${r}]`;
}
function a(r, e = /* @__PURE__ */ new WeakMap()) {
  if (typeof r != "object" || r === null)
    return r;
  if (c("Symbol", r))
    return r.constructor(r.description);
  if (e.has(r))
    return e.get(r);
  let t, s;
  if ((c("Date", r) || c("RegExp", r)) && (s = r), t = new r.constructor(s), (c("Array", r) || c("Object", r)) && Object.keys(r).forEach((i) => {
    r.hasOwnProperty(i) && (t[i] = a(r[i], e));
  }), c("Set", r))
    for (let i of r)
      t.add(a(i, e));
  if (c("Map", r))
    for (let [i, o] of r)
      t.set(a(i, e), a(o, e));
  return e.set(r, t), t;
}
const E = {
  max: 5,
  trigger: 3,
  log: []
};
function I(r) {
  const e = a(E);
  return Object.keys(e).forEach((t) => {
    Array.isArray(e[t]) ? Array.isArray(r[t]) ? e[t] = e[t].concat(r[t]) : r[t] && e[t].push(r[t]) : e[t] = r[t] ? r[t] : e[t];
  }), e.log = e.log.filter((t) => t), e;
}
function P(r, e, t) {
  Array.isArray(r[e]) ? r[e].push(t) : typeof r[e] == "object" || r[e] !== null ? r[e] = {
    ...r[e],
    ...t
  } : r[e] = t;
}
class F {
  constructor(e) {
    n(this, "options");
    n(this, "requestList");
    n(this, "logList");
    n(this, "interceptorIOCTool");
    n(this, "interceptor", {
      request: () => !0,
      response: () => new Promise((e) => {
        e(!0);
      })
    });
    this.options = I(e), this.initRequestQueue(), this.initInterceptor(), this.initObserver();
  }
  // 初始化图片劫持和请求观测
  initObserver() {
    m(this.interceptor.request), new C(this.interceptor, new S(this.logList));
  }
  // 初始化请求队列和打点队列
  initRequestQueue() {
    this.requestList = v(), this.logList = O(this.options);
  }
  // 初始化拦截器
  initInterceptor() {
    this.interceptorIOCTool = new b(
      this.requestList,
      this.logList
    ), this.interceptor.request = this.interceptorIOCTool.createRequestInterceptor(), this.interceptor.response = this.interceptorIOCTool.createResponseInterceptor(this.options);
  }
  // 动态添加url
  prefetch(e) {
    P(this.options, "log", e);
  }
}
export {
  F as default
};
//# sourceMappingURL=logScheduler.js.map
