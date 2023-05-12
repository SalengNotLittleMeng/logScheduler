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
  export default class RequestList extends BaseList<string> {
    imageCompleteList:Set<HTMLImageElement>=new Set()
    constructor() {
      super()
      setImageDomObserve(this.getCurrentImageRequestDebounce())
    }
    // 这里增加异步操作，考虑请求连续增长的问题
   public async getLengthAsync(): Promise<number>{
      return new Promise((reslove)=>{
          setTimeout(()=>{
            reslove(this.getLength())
          },0)
      })
    }
    // 查找出目前正在发生的图片请求
   public getCurrentImageResquest(){
       const imageList=Array.from(document.querySelectorAll('img[src]')) as HTMLImageElement[]
       const unCompleteImage=imageList.filter(img=>{
        if(!img.complete){
          if(this.imageCompleteList.has(img)){
            return false
          }
          this.imageCompleteList.add(img)
          return true
        }else{
          this.imageCompleteList.has(img)?this.imageCompleteList.delete(img):null
          return false
        }
       }).map(img=>img.currentSrc)
      //  多个相同url时，一个url成功就可以判断加载完毕，因此要做一轮去重
       Array.from(new Set([...unCompleteImage]))
       .forEach(url=>{
        this.add(url)
       })
    }
    public getCurrentImageRequestDebounce(){
      let timer:number|undefined=undefined
      // 通过上锁合并多次操作
      return function(this:any){
          clearTimeout(timer)
          timer=setTimeout(()=>{
              this.getCurrentImageResquest()
            },0)
      }.bind(this)
    }
  }