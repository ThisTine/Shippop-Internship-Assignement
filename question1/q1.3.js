function printname(myfirstname,lastName){
    const firstName = myfirstname()
    console.log(firstName === "Shippop" ? "Best Online Shipping Platform" : `Hello Shippop, My name is ${firstName} ${lastName}`)
}

function whatismyfirstname(){
    return "Sittichok"
}

printname(whatismyfirstname,"Ouamsiri")
