type url=string|URL
type InterceptorItem=(url:url,type:LogType)=>boolean;
type InterceptorItemAysnc=(url:url)=>Promise<boolean>
type Interceptor={
    request:InterceptorItem,
    response:InterceptorItemAysnc
}
type LogOptionItem=string|RegExp
type Options={
    'log':LogOptionItem[]
    'trigger':number,
    'max':number,
    [key:string]:any
}

interface PerformanceEntryResource extends PerformanceEntry{
    initiatorType:string,
}
type LogType='xhr'|'image'
type XMLHttpRequestData=Document|XMLHttpRequestBodyInit|null|undefined
type LogListItem={
    url:string,
    type:LogType,
    instance?:XMLHttpRequest,
    data?:XMLHttpRequestData
}
type LogListItemXhr={
    url:string,
    type:LogType,
    instance:XMLHttpRequest,
    data?:XMLHttpRequestData
}