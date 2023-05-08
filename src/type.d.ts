type url=string|URL
type InterceptorItem=(url:url,type:LogType)=>boolean;
type InterceptorItemAysnc=(url:url)=>Promise<boolean>
type Interceptor={
    request:InterceptorItem,
    response:InterceptorItemAysnc
}
type Options={
    log:string|RegExp,
    trigger:number,
    max:5
}

interface PerformanceEntryResource extends PerformanceEntry{
    initiatorType:string,
}
type LogType='xhr'|'image'
type LogListItem={
    url:string,
    type:LogType
}