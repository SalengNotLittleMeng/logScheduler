export default class ImageObserver {
  constructor() {
    this.rowImage = null;
    this.overrideImage();
  }
  // 重写原生的Image对象，做到监控项目中所有的打点
  overrideImage() {
    const _Image = (this.rowImage = Image);
    const vm = this;
    window.Image = function (...params) {
      const img = new _Image(...params);
      let val = '';
      // 劫持对象中的src，当重设src时判断是否是打点请求
      Object.defineProperty(img, 'src', {
        get() {
          return val;
        },
        set(newValue) {
          if (vm.isLogger(newValue)) {
          }
          val = newValue;
        },
      });
      return img;
    };
  }
  // 判断是否是log
  isLogger(url) {
    if (typeof url !== 'string') {
      return false;
    }
    if (url.indexOf('log.gif') !== -1) {
      return true;
    }
    return false;
  }
}
