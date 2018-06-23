<template>
  <div>
  <div>
      <input class='item' v-model="inputValue">
      <button @click="handleSubmit">提交</button>
  </div>
  <ol>
    <todo-item v-for="(item ,index) of list" 
               :content="item" 
               :index="index" 
               @delete="handleDelete">
    </todo-item>
  </ol>
  
  </div>
</template>

<script>
import TodoItem from './components/TodoItem'
export default {
    components :{
          'todo-item' : TodoItem
    },
    data (){
        return {
          inputValue : '请输入',
          list : []
        } 
    },
    methods : {
        handleSubmit () {
            //alert("hello world")
            this.list.push(this.inputValue)
            this.inputValue = ''
        },
        handleDelete (){
          this.list.splice(this.index,1)
        }
    }
}
</script>

<style>

</style>
