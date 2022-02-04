import {
  AspectRatio,
  Box,
  Button,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { FC, useContext, useEffect, useState } from "react";
import {
  AiFillCheckCircle,
  AiFillHeart,
  AiFillStar,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { UserContext } from "../../contexts/UserContext";
import { Item } from "../../dt/Item";
import ItemInVaild from "./ItemCheck/ItemInValid";
import ItemVaild from "./ItemCheck/Itemvalid";
import ItemStar from "./ItemStar/ItemStar";

const ItemComponent: FC<{ item?: Item }> = ({ item }) => {
  const [isactive, setisactive] = useState(false);
  const { addtocart,wishList,addtowishlist,isloadingproduct } = useContext(UserContext);
  const [isinwishlist,setisinwishlist] = useState(false)
  useEffect(()=>{
      if(wishList && item?.id){
        setisinwishlist(wishList.map(item=>item.itemID).includes(item.id))
      }
  },[wishList,item.id])
  if (!item) {
    return <Heading>Wait</Heading>;
  }
  return (
    <Link href={"/product/" + item.id}>
      <VStack
        paddingY={isactive ? 3 : { base: 2, xl: 10 }}
        paddingX={{ base: 2, xl: 10 }}
        shadow={isactive ? "xl" : "none"}
        pos={"relative"}
        alignItems={"flex-start"}
        cursor="pointer"
        onMouseEnter={() => setisactive(true)}
        onMouseLeave={() => setisactive(false)}
        rounded="md"
      >
        {item.amount > 0 ? <ItemVaild /> : <ItemInVaild />}
        {isactive && (
          <Button
            onClick={(e) => {e.stopPropagation();addtowishlist({itemID:item.id})}}
            variant={"outline"}
            isLoading={isloadingproduct}
            rounded="full"
            color={ isinwishlist? "red" : "black"}
            w={10}
            h={10}
            p={0}
            pos={"absolute"}
            top={2}
            right={2}
            zIndex={5}
            bg={isinwishlist ? "red.200" : "white"}
          >
            {isinwishlist ? <AiFillHeart/> :<AiOutlineHeart />}
          </Button>
        )}
        <AspectRatio w="100%" ratio={1 / 1}>
          <Image
            src={`https://${process.env.NEXT_PUBLIC_IMAGE_URL}${item.id}`}
            objectFit={"cover"}
          />
        </AspectRatio>
        {isactive && (
          <Button
            variant={"outline"}
            onClick={(e) => {
              e.stopPropagation();
              addtocart({ amount: 1, item: item });
            }}
            w="100%"
            h={10}
            colorScheme={"blue"}
            rounded="full"
            isLoading={isloadingproduct}
          >
            <AiOutlineShoppingCart /> Add to cart
          </Button>
        )}
        <HStack>
          <ItemStar rating={item.reviewscore / item.reviewcount} />
          <Text color={"gray"}>Reviews({item.reviewcount})</Text>
        </HStack>
        <Text>{item.name}</Text>
        <VStack alignItems={"flex-start"}>
          {item?.saleprice && (
            <Heading size="sm" color={"gray"} textDecor={"line-through"}>
              THB{item.price}
            </Heading>
          )}
          <Heading size={"lg"}>
            THB{item.saleprice ? item.saleprice.newprice : item.price}
          </Heading>
        </VStack>
      </VStack>
    </Link>
  );
};

export default ItemComponent;
