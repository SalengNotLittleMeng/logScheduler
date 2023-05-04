type url=string|URL
type InterceptorItem=(url:url)=>boolean;
type Interceptor={
    request:InterceptorItem,
    response:InterceptorItem
}
type Options={
    log:string|RegExp,
    trigger:number
}

interface PerformanceEntryResource extends PerformanceEntry{
    initiatorType:string,
}