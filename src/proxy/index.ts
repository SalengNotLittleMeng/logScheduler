export const rowImage=Image
let tag=false
  // 重写原生的Image对象，做到监控项目中所有的打点
export function overrideImage(callback:(arg0:string,arg1:LogType)=>boolean){
    if(tag){return}
    tag=true
    window.Image = function (width?:number|undefined,height?:number|undefined,) {
      const img = new rowImage(width,height);
      // 劫持对象中的src，当重设src时判断是否是打点请求
      let proxy = new Proxy(img, {
        get(target,prototype,receiver){
            return Reflect.get(target, prototype, receiver)
        },
        set(target,prototype,value){
          if(prototype=='src'){
           if(callback(value,'image')){
            //当为打点信息时，走拦截器逻辑并在此处阻止打点请求
              target[prototype]=''
              return true
           }
          }  
          try{
            ( target as any)[prototype]=value
            return true
          }catch(e){
            return true
          }

        }
      })
      return proxy
    } as unknown as new (width?: number | undefined, height?: number | undefined)=> HTMLImageElement
  }
