
//1. assign ke dalam variable 
let variabel= function doSomething (){
    console.log ('Fuji')
}
variabel();
//2. assign ke dalam object
let object = {doSomething: function doSomething(){
    console.log('Uji')
}
}
object.doSomething()
//3. assign ke dalam array
let arr =[]
arr.push(function doSomething(){
    console.log('Hai')
})
arr[0]()