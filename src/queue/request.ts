import BaseList from './base'
//设置节点变动监控，当变化时查找新的图片请求
function setImageDomObserve(callback:()=>void){
    let targetNode = document.querySelector("body")||document.createElement('div');
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
    // 这里增加异步操作，考虑请求连续增长的问题
    async getLengthAsync(): Promise<number>{
      return new Promise((reslove)=>{
          setTimeout(()=>{
            reslove(this.getLength())
          },0)
      })
    }
    // 查找出目前正在发生的图片请求
    getCurrentImageResquest(){
       const imageList=Array.from(document.querySelectorAll('img[src]')) as HTMLImageElement[]
       imageList.filter(img=>!img.complete).forEach(img=>{
            this.add(img.currentSrc)
            // 由于perfromceObsever无法检测到加载失败，因此需要手动增加监听器出队列
            img.addEventListener('error',()=>{
              this.delete(img.currentSrc)
            })
       })
    }
  }