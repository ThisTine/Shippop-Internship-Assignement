### ข้อ 1

```
function printname(firstName,lastName){
    console.log(firstName === "Shippop" ? "Best Online Shipping Platform" : `Hello Shippop, My name is ${firstName} ${lastName}`)
}
```

### ข้อ 2

## การ copy array of object

การ copy array ที่ภายใน array เป็นตัวแปรประเภท Mutable (เก็บตัวแปรเป็น refrence) การ copy จำเป็นต้องสร้าง refrence ใหม่ขึ้นมาเพื่อไม่ให้การแก้ไข object กระทบกับ object ต้นแบบ

โดยสามารถใช้ loop เพื่อสร้าง object ใหม่แล้วเก็บ refrence ของตัวแปรใน array หรือใน java script เราสามารถใช้ .map เพื่อ map object ใหม่เข้า array ได้โดยตรง
เช่น (สามารถดูตัวอย่างโค้ดได้ใน q1.2.js)
```
const arr = [{name:"test",bat:{name:"Test"}},{name:"test",bat:{name:"Test"}},{name:"test",bat:{name:"Test"}}]

let copyarray = arr.map(item=>{return(...item)})

```

### ข้อ 3

## First-class function

First-class function จะถูกเรียกเมื่อ function ในภาษานั้น ๆ สามารถรับค่าตัวแปร , return ตัวแปรประเภทต่าง ๆ หรือแม้แต่ใช้ function เป็นตัวแปรหนึ่งเพื่อใช้งานในอีก function ในโปรแกรม หรือพูดได้อีกแบบว่า function ในภาษานั้น ๆ ถูกจัดให้อยู่ใน first class citizen 
ยกตัวอย่างเช่น (สามารถดูตัวอย่างโค้ดได้ใน q1.3.js)
```
function printname(myfirstname,lastName){
    const firstName = myfirstname()
    console.log(firstName === "Shippop" ? "Best Online Shipping Platform" : `Hello Shippop, My name is ${firstName} ${lastName}`)
}

function whatismyfirstname(){
    return "Sittichok"
}

printname(whatismyfirstname,"Ouamsiri")

```