import {
  Tr,
  Td,
  HStack,
  AspectRatio,
  Input,
  VStack,
  Text,
  Image,
  Button,
  NumberInput,
  NumberInputField,
  NumberIncrementStepper,
  NumberDecrementStepper,
  NumberInputStepper,
} from "@chakra-ui/react";
import { FC, useContext, useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { GiPencil } from "react-icons/gi";
import { ModalContext } from "../../contexts/ModelContext";
import { UserContext } from "../../contexts/UserContext";
import { Cart } from "../../dt/Item";

const CartItem:FC<{item:Cart}> = ({item}) => {
  const {removefromcart,isloadingproduct,addtocart,user} = useContext(UserContext)
  const {dispatch} = useContext(ModalContext)
  const [amount,setamount] = useState(item.amount)
  useEffect(()=>{
    setamount(item.amount)
  },[item])
  

  return (
    <Tr>
      <Td>
        <HStack>
          <AspectRatio w="95px" ratio={1 / 1}>
            <Image
              src={`https://${process.env.NEXT_PUBLIC_IMAGE_URL}${item.item.id}`}
              objectFit="cover"
            />
          </AspectRatio>
          <Text>{item.item.name}</Text>
        </HStack>
      </Td>
      <Td>
        <Text>THB{item.item.saleprice ? item.item.saleprice.newprice : item.item.price}</Text>
      </Td>
      <Td>
        <NumberInput step={1} min={1} w={16} as="form" onChange={e=>{setamount(parseInt(e));addtocart({item:item.item,amount:parseInt(e)})}} value={amount} >
            <NumberInputField/>
            <NumberInputStepper>
    <NumberIncrementStepper />
    <NumberDecrementStepper />
  </NumberInputStepper>
        </NumberInput>
      </Td>
      <Td>
        <HStack>
          <Text>THB{item.item.saleprice ? (item.item.saleprice.newprice*item.amount) : (item.item.price*item.amount)}</Text>
          <VStack pl={5}>
              <Button variant={"outline"} rounded={"full"} isLoading={isloadingproduct} onClick={()=>removefromcart(item.item)}>
              <AiOutlineClose />
              </Button>
              {item.item.ownerID === user.id &&<Button variant={"outline"} rounded={"full"} isLoading={isloadingproduct} onClick={()=>dispatch({type:"editproduct",itemdata:item.item})}  >
              <GiPencil />
              </Button>}
          </VStack>
        </HStack>
      </Td>
    </Tr>
  );
};
export default CartItem;
