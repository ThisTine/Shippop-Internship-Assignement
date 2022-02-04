import { Button, HStack, Input, useToast } from "@chakra-ui/react"
import { FC, useState } from "react"
import { useAxios } from "../../../functions/axios/useAxios"
import { addcategorytype } from "../CreateItemModal"

const AddCategoryModalBody:FC<{add:(props: addcategorytype) => void}> = ({add})=>{
    const [text,settext] = useState("")
    const axios = useAxios()
    const toast = useToast()
    const [isloading,setisloading] = useState(false)
    const create = async ()=>{
        if(text){
            try{
                setisloading(true)
                const data = await axios.post("/manage/addcategory",{name:text})
                add({name:data.data.name,id:data.data.id})
                setisloading(false)
                settext("")
            }catch(err){
                toast({status:"error",title:"Error while adding categories",description:err.response.data.message || ""})
                setisloading(false)
            }
        }   
    }
    return(
        <HStack>
        <Input bg="white" placeholder="หมวดหมู่ใหม่" onChange={(e)=>settext(e.target.value)} value={text} />
        <Button colorScheme={"teal"} isLoading={isloading} onClick={create} >สร้าง</Button>
        </HStack>
    )
}

export default AddCategoryModalBody