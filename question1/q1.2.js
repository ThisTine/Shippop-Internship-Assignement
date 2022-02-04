const arr = [{name:"test",bat:{name:"Test"}},{name:"test",bat:{name:"Test"}},{name:"test",bat:{name:"Test"}}]

let arr2 = arr.map(item=>{ return {...item}})

arr2[0].bat = 12

console.log(arr2)

console.log(arr)

