export default class XhrHandler {
  // 对xhr进行重写，获取正在请求的xhr数目
  constructor() {
    (this.currentXhrNumber = 0), this.overrideXhr();
  }
  overrideXhr() {
    const vm = this;
    const { open, send } = XMLHttpRequest.prototype;
    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
      vm.currentXhrNumber++;
      open.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function (data) {
      this.addEventListener('readystatechange', function () {
        if (this.readyState === 4) {
          vm.currentXhrNumber > 0 && vm.currentXhrNumber--;
        }
      });
      send.apply(this, arguments);
    };
  }
  getXhrNumber() {
    return this.currentXhrNumber;
  }
}
