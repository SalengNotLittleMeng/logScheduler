//队列范型类
export default class BaseList<T>{
    list:Array<T>=[]
    constructor(){
    }
   public add(item:T){
      this.list.push(item)
    }
    public delete(deletedItem:T){
      const deletedIndex=this.list.findIndex(item=>item==deletedItem)
      deletedIndex!=-1 && this.list.splice(deletedIndex,1)
    }
    public getLength(){
      return this.list.length
    }
    public includes(item:T){
      return this.list.includes(item)
    }
    public clear(){
       while(this.list.length){
        this.list.pop()
       }
    }
  }