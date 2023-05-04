const defaultOptions={   
    trigger:3,
    log:/log.gif/
}

export function mergeOptions(userOptions:Options){
    // 目前直接合并，之后如果有数组，对象配置需要考虑扩展
   return Object.assign(defaultOptions,userOptions)
}