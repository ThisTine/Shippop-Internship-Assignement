import { AspectRatio, Stack, VStack,Image, Heading, Box, Text, HStack, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Button, Divider } from "@chakra-ui/react"
import { FC, useContext, useState } from "react"
import { AiFillHeart } from "react-icons/ai"
import { ModalContext } from "../../contexts/ModelContext"
import { UserContext } from "../../contexts/UserContext"
import { Item } from "../../dt/Item"
import Container from "../Etc/Container"
import Crop from "../Etc/Crop"
import ReviewBtn from "./reviewbtn/ReviewBtn"

const ItemPage:FC<Item> = (item)=>{
    const [amount,setamount] = useState(1)
    const {addtocart,addtowishlist,wishList,isloadingproduct,user} = useContext(UserContext)
    const {dispatch} = useContext(ModalContext)
    return(
        <Container>
            <Crop mt={14}>
                <Stack w="100%" direction={{base:"column",md:"row"}} spacing={10}>
                    <VStack flex={{base:1,md:2}} >
                        <AspectRatio w="100%" ratio={1/1} >
                            <Image src={`https://${process.env.NEXT_PUBLIC_IMAGE_URL}${item.id}`} objectFit={"cover"} />
                        </AspectRatio>
                    </VStack>
                    <VStack flex={{base:1,md:3}} alignItems={"flex-start"}>
                        <Box mt={5} w="100%">
                            <Heading>{item.name}</Heading>
                            <Box mt={5} fontSize="lg">
                                <Text>ผู้เขียน : {item?.owner?.firstname}</Text>
                                <Text>สำนักพิมพ์ : {item?.publisher}</Text>
                                <Text>ประเภท : {item?.itemCategory?.name}</Text>
                                <Text>ประเภทสินค้า : Books</Text>
                            </Box>
                            <VStack alignItems={"flex-start"} mt={10}>
                            {(user && item.ownerID !== user.id) &&<ReviewBtn itemId={item?.id} />}
                            </VStack>
                            <HStack mt={16}>
                                
                                <Text fontSize={"lg"}>ราคา</Text>
                                <Heading>THB{item.saleprice ? item.saleprice?.newprice : item?.price}</Heading>
                                {item.saleprice && <Heading color="gray" size={"md"} textDecor="line-through" >THB{item?.price}</Heading>}
                            </HStack>
                            {user ? <Stack direction={{base:"column",md:"row"}} w="100%" mt={10}>
                                <Box  flex={2}>
                                <NumberInput value={amount} onChange={(e)=>setamount(parseInt(e))} min={1}>
                                    <NumberInputField/>
                                    <NumberInputStepper>
                                        <NumberIncrementStepper/>
                                        <NumberDecrementStepper/>
                                    </NumberInputStepper>
                                </NumberInput>
                                </Box>
                                
                                <HStack flex={5}>
                                    <Button isLoading={isloadingproduct} flex={1} size={"lg"} rounded="full" colorScheme={"blue"} onClick={()=>addtocart({item,amount})} >Add</Button>
                                    <Button isLoading={isloadingproduct} flex={1} size={"lg"} rounded="full" colorScheme={wishList.map(item=>item.itemID).includes(item.id) ? "red" : "yellow"} color="white" 
                                    onClick={()=>addtowishlist({itemID:item.id})} ><AiFillHeart/> Wishlist</Button>
                                </HStack>
                            </Stack> : <Button onClick={()=>dispatch({type:"login"})} colorScheme="teal" >Login</Button>}
                        </Box>
                    </VStack>
                </Stack>
                <VStack alignItems={"flex-start"} pt={10}>
                    <Text borderBottom="2px solid" w="fit-content" px={3} borderBottomColor="blue" fontWeight={"bold"} >เกี่ยวกับสินค้า</Text>
                    <Divider/>
                    <Box pt={5}>
                    <Text color={"black"}> <b> รายละเอียด : </b>  {item.name} </Text>
                    <Text color={"gray"}>{item.description}</Text>
                    </Box>
                </VStack>
            </Crop>
        </Container>
    )
}

export default ItemPage