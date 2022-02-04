import { HStack,Text } from "@chakra-ui/react"
import { AiFillCloseCircle } from "react-icons/ai"

const ItemInVaild = ()=>{
    return(<HStack color="red">
    <AiFillCloseCircle/>
    <Text>สินค้าหมด</Text>
</HStack>)
}

export default ItemInVaild