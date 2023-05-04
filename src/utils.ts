// 并发控制函数，每当一个请求返回就会执行下一个
export function  multiRequest(promiseList:Promise<unknown>[], maxNum:number){
    let count=0
    return new Promise(function(resolve){
        while(count<maxNum){
        next()
    }
    function next(){
        if(count==promiseList.length){
            resolve(count)
            return
        }
        promiseList[count].finally(()=>{
            count++
            next()
        })
    }
    })
}