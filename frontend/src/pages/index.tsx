import { Box, Heading, HStack, Text, VStack,Image } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { GetStaticProps } from "next/types";
import { useCallback, useContext, useEffect, useState } from "react";
import Container from "../components/Etc/Container";
import Crop from "../components/Etc/Crop";
// import ItemSlider from "../components/Item/ItemSlider/ItemSlider";
import { UserContext } from "../contexts/UserContext";
import { Item } from "../dt/Item";
import { useAxios } from "../functions/axios/useAxios";

const ItemSlider = dynamic(()=>import("../components/Item/ItemSlider/ItemSlider"),{ssr:false})
const Index = ({recommended,bestselleritemdata}) => {
  const [wishlist,setwishlist] = useState<Item[]>([])
  const axios = useAxios()
  const {user,isloading} = useContext(UserContext)
  const getWishList = useCallback(async()=>{
    try{
      const data = await axios.get("/user/getWhishlist")
      setwishlist(data.data)
    }catch(err){
      console.log(err)
    }
  },[])
  useEffect(()=>{
    if(!isloading && user){
      getWishList()
    }
  },[isloading,user])
  return(
  <Container mt={10}>
    <Crop gap={5}>
      <VStack  overflow="hidden" pos={"relative"} justifyContent={"center"}  w="100%" h={{ base: 40, md: 60, lg: 80 }}>
        <Heading zIndex={2} color={"blue.400"}>Shippop Internship assignment</Heading>
        <Text zIndex={2} color="white">เว็บไซต์นี้ทำโดยเป็นส่วนหนึ่งของ assignment และไม่สามารถใช้เพื่อสั่งของได้ </Text>
        <Box pos={"absolute"}  zIndex={1} w="100%" h="100%" top={"-20px"}>
        <Image pointerEvents={"none"} transform={"scale(1.2)"} filter={"blur(3px) brightness(0.5)"} src="https://storage.googleapis.com/wordpress-production-stateless-data/2020/08/e09a2ea7-ship1.jpg" objectFit={"contain"}  />
        </Box>
      </VStack>
      <Box>
        <HStack justifyContent={"space-between"}>
          <Heading size="lg">สินค้าขายดี</Heading>
          <Link href="/bestseller">
            <Text textDecor={"underline"} cursor={"pointer"}>
              ดูสินค้าขายดีทั้งหมด
            </Text>
          </Link>
        </HStack>
        <ItemSlider items={bestselleritemdata} />
      </Box>

      <Box>
        <HStack justifyContent={"space-between"}>
          <Heading size="lg">สินค้าแนะนำ</Heading>
          <Link href="/new">
            <Text textDecor={"underline"} cursor={"pointer"}>
              ดูสินค้าทั้งหมด
            </Text>
          </Link>
        </HStack>
        <ItemSlider items={recommended} />
      </Box>

      {wishlist.length > 0 && <Box>
        <HStack justifyContent={"space-between"}>
          <Heading size="lg">WishList</Heading>
          <Link href="/new">
            <Text textDecor={"underline"} cursor={"pointer"}>
              ดูสินค้าทั้งหมด
            </Text>
          </Link>
        </HStack>
        <ItemSlider items={wishlist} />
      </Box>}
    </Crop>
  </Container>
);}

export const getStaticProps: GetStaticProps = async (context) => {
  let recommendeditemdata = []
  let bestselleritemdata = []
  try{
    const recommenddata = await fetch(process.env.NEXT_PUBLIC_URL + "/item/getall/true", {
      method: "GET",
      headers: {'Content-Type': 'application/json'},
    });
    recommendeditemdata = await recommenddata.json()
    const bestseller = await fetch(process.env.NEXT_PUBLIC_URL + "/item/getbestseller/true", {
      method: "GET",
      headers: {'Content-Type': 'application/json'},
    });
    bestselleritemdata = await bestseller.json()
  }catch(err){
    console.log(err)
  }

  return {
    props: {
      recommended: Array.isArray(recommendeditemdata) ? [...recommendeditemdata] : [],
      bestselleritemdata: Array.isArray(bestselleritemdata) ? [...bestselleritemdata] : []
    },
    revalidate: 10
  };
  // ...
};

export default Index;
