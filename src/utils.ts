// 并发控制函数，每当一个请求返回就会执行下一个
export function  multiRequest(urls:string[], maxNum:number,
    decorator:(url:string)=>Promise<undefined>){
    let count=0
    return new Promise(function(resolve){
        while(count<maxNum){
        // next()
        count++
    }
    function next(){
        console.log(count,urls)
        if(count>urls.length){
            resolve(count)
            return
        }
        decorator(urls[count]).finally(()=>{
            count++
            next()
        })
    }
    })
}