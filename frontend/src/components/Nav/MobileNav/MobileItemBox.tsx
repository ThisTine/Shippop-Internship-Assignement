import { Box,BoxProps,Text } from "@chakra-ui/react"
import { FC } from "react"


const MobileItemBox:FC<BoxProps> = (props)=>{
    return(<Box  p={5} borderBottom="1px solid" borderColor={"gray.100"} _hover={{bg:"gray.100"}} transition="0.5s" {...props}><Text>{props.children}</Text> </Box>)
}

export default MobileItemBox