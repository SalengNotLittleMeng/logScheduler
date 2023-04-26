class a {
  constructor() {
    this.rowImage = null, this.overrideImage();
  }
  // 重写原生的Image对象，做到监控项目中所有的打点
  overrideImage() {
    const e = this.rowImage = Image, t = this;
    window.Image = function(...s) {
      const r = new e(...s);
      let n = "";
      return Object.defineProperty(r, "src", {
        get() {
          return n;
        },
        set(i) {
          t.isLogger(i), n = i;
        }
      }), r;
    };
  }
  // 判断是否是log
  isLogger(e) {
    return typeof e != "string" ? !1 : e.indexOf("log.gif") !== -1;
  }
}
class u {
  // 对xhr进行重写，获取正在请求的xhr数目
  constructor() {
    this.currentXhrNumber = 0, this.overrideXhr();
  }
  overrideXhr() {
    const e = this, { open: t, send: s } = XMLHttpRequest.prototype;
    XMLHttpRequest.prototype.open = function(r, n, i, h, c) {
      e.currentXhrNumber++, t.apply(this, arguments);
    }, XMLHttpRequest.prototype.send = function(r) {
      this.addEventListener("readystatechange", function() {
        this.readyState === 4 && e.currentXhrNumber > 0 && e.currentXhrNumber--;
      }), s.apply(this, arguments);
    };
  }
  getXhrNumber() {
    return this.currentXhrNumber;
  }
}
class g {
  constructor(e) {
    this.options = e, this.imageManager = null, this.xhrManager = null, this.initObserver();
  }
  initObserver() {
    this.imageManager = new a(), this.xhrManager = new u();
  }
}
export {
  g as default
};
//# sourceMappingURL=logScheduler.js.map
