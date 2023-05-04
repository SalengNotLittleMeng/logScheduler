import BaseList from './base'
//设置节点变动监控，当变化时查找新的图片请求
function setImageDomObserve(callback){
    let targetNode = document.querySelector("body");
    let observerOptions = {
      childList: true, 
      attributes: true, 
      subtree: true    
    }
    
    let observer = new MutationObserver(callback);
    observer.observe(targetNode, observerOptions);
  }
  
  // 请求队列
  export default class RequestList extends BaseList {
    constructor() {
      super()
      setImageDomObserve(this.getCurrentImageResquest.bind(this))
    }
    // 查找出目前正在发生的图片请求
    getCurrentImageResquest(){
       const imageList= Array.from(document.querySelectorAll('img[src]'))
       imageList.filter(img=>!img.complete).forEach(img=>{
            this.add(img.currentSrc)
            img.addEventListener('error',()=>{
              this.delete(img.currentSrc)
            })
       })
    }
  }