//队列基类
export default class BaseList{
    constructor(){
      this.list=[]
    }
    add(item){
      this.list.push(item)
    }
    delete(deletedItem){
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