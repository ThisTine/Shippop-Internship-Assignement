import { HStack,Text } from "@chakra-ui/react"
import { AiFillCheckCircle } from "react-icons/ai"

const ItemVaild = ()=>{
    return(<HStack color="green">
    <AiFillCheckCircle/>
    <Text>มีสินค้า</Text>
</HStack>)
}

export default ItemVaild