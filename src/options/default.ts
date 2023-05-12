import {cloneDeep} from '../utils'
// 默认配置对象
const defaultOptions={ 
    max:5,  
    trigger:3,
    log:[]
}

export function mergeOptions(userOptions:Options){
    // 这里要考虑数组的扩展问题
    const baseOptions:Options=cloneDeep(defaultOptions)
   Object.keys(baseOptions).forEach((key)=>{
        if(Array.isArray(baseOptions[key])){
            if(Array.isArray(userOptions[key])){
                baseOptions[key] =  (baseOptions[key] as LogOptionItem[]).concat(userOptions[key])
            }else{
                userOptions[key] && (baseOptions[key] as LogOptionItem[]).push(userOptions[key])
            }
        }else{
           ( baseOptions[key] as number)=((userOptions[key] as number)||userOptions[key]===0)
           ?userOptions[key]:baseOptions[key]
        }
   })
   baseOptions.log=baseOptions.log.filter(item=>item)
   return baseOptions
}
// 扩展配置
export function extendOptions(options:Options,key:string,value:any){
    if(Array.isArray(options[key])){
        options[key].push(value)
    }else if(typeof options[key] === 'object' || options[key] !== null){
        options[key]={
            ...options[key],
            ...value
        }
    }else{
        options[key]=value
    }
}