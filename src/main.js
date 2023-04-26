import ImageObserver from './logObserver';
import XhrHandler from './xhr';
export default class logScheduler {
  constructor(options) {
    this.options = options;
    this.imageManager = null;
    this.xhrManager = null;
    this.initObserver();
  }
  initObserver() {
    this.imageManager = new ImageObserver();
    this.xhrManager = new XhrHandler();
  }
}
