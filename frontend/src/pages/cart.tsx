import { Box, Heading, Stack, Table, Tbody, Th, Thead, Tr,Image, HStack, Text, Input, VStack, Td, Divider, Button, useToast } from "@chakra-ui/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import CartItem from "../components/Cart/CartItem"
import Container from "../components/Etc/Container"
import Crop from "../components/Etc/Crop"
import { UserContext } from "../contexts/UserContext"
import { useAxios } from "../functions/axios/useAxios"
import total from "../functions/cart/total"

const Cart = ()=>{
    const {cart,userdispatch,user,isloading:userloading} = useContext(UserContext)
    const toast = useToast()
    const axios = useAxios()
    const router = useRouter()
    const [isloading,setisloading] = useState(false)
    const clearcart = async()=>{
        try{
            setisloading(true)
            await axios.post("/user/clearcart")
            userdispatch({type:"setcart",cart:[]})
            setisloading(false)
        }catch(err){
            setisloading(false)
            toast({status:"error",title:"Error"})
        }
    }
    useEffect(()=>{
        if(!userloading && !user){
            router.replace("/")
        }
    },[user,userloading])
    return(
        <Container mt={10}>
            <Crop>
                 <Heading>ตระกร้าสินค้า</Heading>

                <Stack direction={{base:"column",xl:"row"}} spacing={10}>

                    <Box flex={3}>
                       <Box w="100%" overflow={"auto"}>
                        <Table>
                            <Thead>
                                <Tr>
                                <Th>สินค้า</Th>
                                <Th>ราคา</Th>
                                <Th>จำนวน</Th>
                                <Th>ยอดรวม</Th>    
                                </Tr>
                                
                            </Thead>
                            <Tbody>
                                {cart.map(item=><CartItem key={item.item.id} item={item} />)}
                            </Tbody>
                        </Table>
                        </Box>
                        <HStack mt={10}>
                            <Link href="/"><Button variant={"outline"} colorScheme="blackAlpha" rounded={"full"}>ซื้อสินค้าต่อไป</Button></Link>
                            <Button colorScheme="blackAlpha" bg="black" _hover={{bg:"#050505"}} rounded={"full"} isLoading={isloading} onClick={()=>clearcart()} >ล้างตระกร้าสินค้า</Button>
                        </HStack>
                    </Box>

                    <VStack spacing={14} alignItems={"flex-start"} flex={1} bg="blue.50" padding={10} rounded="xl">
                        <Heading>สรุปคำสั่งซื้อ</Heading>
                        <VStack spacing={5} w="100%">
                        <HStack w="100%" justifyContent={"space-between"}>
                            <Text>ยอดรวม</Text>
                            <Text>THB{total(cart)}</Text>
                        </HStack>
                    <Divider/>
                         <HStack w="100%" justifyContent={"space-between"}>
                            <Text>ยอดสุทธิ</Text>
                            <Text>THB{total(cart)}</Text>
                        </HStack>
                        </VStack>
                        
                        <Link href="/checkout"><Button colorScheme={"blue"} w="100%" rounded={"full"} isLoading={isloading} size="lg" isDisabled={cart.length <= 0} >ไปชำระเงิน</Button></Link>
                    </VStack>
                </Stack>
            </Crop>
        </Container>
    )
}

export default Cart