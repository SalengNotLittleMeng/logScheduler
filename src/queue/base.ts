//队列基类
export default class BaseList{
    list:string[]=[]
    constructor(){
    }
    add(item:string){
      this.list.push(item)
    }
    delete(deletedItem:string){
      const deletedIndex=this.list.findIndex(item=>item==deletedItem)
      deletedIndex!=-1 && this.list.splice(deletedIndex,1)
    }
    getLength(){
      return this.list.length
    }
    clear(){
       while(this.list.length){
        this.list.pop()
       }
    }
  }