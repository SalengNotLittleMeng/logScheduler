type url=string|URL
type InterceptorItem=(url:url)=>boolean;
type Interceptor={
    request:InterceptorItem,
    response:InterceptorItem
}
type Options={
    log:string|RegExp,
    trigger:number,
    max:5
}

interface PerformanceEntryResource extends PerformanceEntry{
    initiatorType:string,
}