import { Input, InputGroup, InputRightElement } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import { FiSearch } from "react-icons/fi"

const SearchBar = ()=>{
    const ref = useRef<HTMLInputElement>()
    const [text,settext] = useState("")
    const router = useRouter()
    useEffect(()=>{
        if(ref){
            ref.current.focus()
        }
    },[ref])
    const submit = ()=>{
        if(text){
            router.push("/search/"+text)
        }
    }
    return(
        <InputGroup as="form" onSubmit={e=>{e.preventDefault();submit()}}> <Input value={text} onChange={e=>settext(e.target.value)}  ref={ref} bg="gray.100" placeholder="ค้นหาสินค้า" rounded={"full"}/> <InputRightElement onClick={()=>submit()} color="blue.700" _hover={{cursor:"pointer",color:"blue.500"}} > <FiSearch/> </InputRightElement> </InputGroup>
    )
}

export default SearchBar