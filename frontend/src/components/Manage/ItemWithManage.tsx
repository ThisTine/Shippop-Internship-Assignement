import { AspectRatio, Box, Button, Heading, HStack,Image, Text, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Switch, Textarea, useDisclosure, useToast, VStack } from "@chakra-ui/react";
import { FC, useContext, useState } from "react";
import { GiTrashCan, GiPencil } from "react-icons/gi";
import { RiCoupon3Fill } from "react-icons/ri";
import { ModalContext } from "../../contexts/ModelContext";
import { Item } from "../../dt/Item";
import { useAxios } from "../../functions/axios/useAxios";

const ItemWithManage:FC<{item:Item,deleteitem:(itemid: string) => void,deletecoupon:(itemId:string)=>void}> = ({item,deleteitem,deletecoupon}) => {
    const {dispatch} = useContext(ModalContext)    
    const [isloading,setisloading] = useState(false)
    const [ishideit,setishideit] = useState(item.ishide)
    const axios = useAxios()
    const toast = useToast()
    const deleteitembtn =async ()=>{
      try{
        setisloading(true)
        await axios.delete("/manage/removeitem", { data:{itemId:item.id} } )
        setisloading(false)
        deleteitem(item.id)
      }catch(err){
        toast({status:"error",title:"Deletion Error"})
        setisloading(false)
      }
    }
  const deletecp = async ()=>{
    try{
      setisloading(true)
      await axios.delete("/manage/removediscount",{data:{itemID:item.id}})
      deletecoupon(item.id)
      setisloading(false)
    }catch(err){
      toast({status:"error",title:"Deletion Error"})
      setisloading(false)
    }
  }
  const hideit = async (ishide:boolean)=>{
    try{
      setisloading(true)
      await axios.post("/manage/sethideitem",{itemId:item.id,ishide:ishide})
      setishideit(!ishideit)
      setisloading(false)
    }catch(err){
      toast({status:"error",title:"hide error"})
      setisloading(false)
    }
  }
  return (
    <HStack w="100%" justifyContent={"space-between"} p={10} shadow="lg">
      <Box flex={2}>
        <AspectRatio ratio={1 / 1} w="150px">
          <Image src={"https://"+process.env.NEXT_PUBLIC_IMAGE_URL+item.id} />
        </AspectRatio>
        <Heading size="md" fontWeight={"normal"}>
          {item.name}
        </Heading>
        <HStack alignItems={"center"} mt={10}>
        <Text>Hide : </Text>
        <Box>
        <Switch size="lg" defaultChecked={ishideit} onChange={(e)=>hideit(e.target.checked)} />
        </Box>
        </HStack>
        
        
      </Box>
      <VStack flex={1} alignItems="flex-end">
      <HStack flex={1} justifyContent="flex-end">
        <Button onClick={deleteitembtn} isLoading={isloading} colorScheme={"red"}>
          <GiTrashCan />
        </Button>
        <Button colorScheme={"yellow"}  isLoading={isloading} onClick={()=>dispatch({type:"editproduct",itemdata:item})} >
          <GiPencil />
        </Button>
        <Button colorScheme={"blue"}  isLoading={isloading} onClick={()=>dispatch({type:"addcoupon",itemdata:item})}>
          <RiCoupon3Fill />
        </Button>
        
      </HStack> 
      {item?.saleprice && <Box >
          <Button colorScheme={"red"} onClick={()=>deletecp()} >Delete coupon</Button>
        </Box>} 
      </VStack>
      
    </HStack>
  );
};

export default ItemWithManage;
