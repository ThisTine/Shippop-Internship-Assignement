import { CircularProgress, VStack } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
// import ItemListPage from "../components/ItemListPage/ItemListPage"
const ItemListPage = dynamic(()=>import("../components/ItemListPage/ItemListPage"),{ssr:false})

const BestSeller = ({bestselleritemdata})=>{
    return <>
    <Head> <title>สินค้าขายดี | Book store</title></Head>
    {ItemListPage ? <ItemListPage name={"สินค้าขายดี"} items={bestselleritemdata}/> : <VStack mt={10}><CircularProgress isIndeterminate /></VStack>}
    </>
}

export const getStaticProps: GetStaticProps = async (context) => {
    let bestselleritemdata = []
    try{
      const bestseller = await fetch(process.env.NEXT_PUBLIC_URL + "/item/getbestseller/false", {
        method: "GET",
        headers: {'Content-Type': 'application/json'},
      });
      bestselleritemdata = await bestseller.json()
      console.log(bestselleritemdata)
    }catch(err){
      console.log(err)
    }
  
    return {
      props: {
        bestselleritemdata: Array.isArray(bestselleritemdata) ? bestselleritemdata :[]
      },
      revalidate: 10
    };
  };

export default BestSeller