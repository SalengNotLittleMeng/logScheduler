//队列范型类
export default class BaseList<T>{
    list:Array<T>=[]
    constructor(){
    }
    add(item:T){
      this.list.push(item)
    }
    delete(deletedItem:T){
      const deletedIndex=this.list.findIndex(item=>item==deletedItem)
      deletedIndex!=-1 && this.list.splice(deletedIndex,1)
    }
    getLength(){
      return this.list.length
    }
    includes(item:T){
      return this.list.includes(item)
    }
    clear(){
       while(this.list.length){
        this.list.pop()
       }
    }
  }