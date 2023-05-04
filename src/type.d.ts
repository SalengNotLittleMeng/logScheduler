type InitInterceptor={
    request:any,
    response:any
}

interface PerformanceEntryResource extends PerformanceEntry{
    initiatorType:string,
}

type Options={
    log?:string|RegExp,
    trigger?:number
}