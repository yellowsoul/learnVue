//封装公用防抖函数方法
export function debounce(func,delay){
  let timer = null
  return function(...args){
    if(timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this,args) //利用apply可以传数组的特性
    },delay)
  }
}