import { CircularProgress, VStack } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
// import ItemListPage from "../components/ItemListPage/ItemListPage"

const ItemListPage = dynamic(()=>import("../components/ItemListPage/ItemListPage"),{ssr:false})


const Sale = ({items})=>{

    return <>
    <Head> <title>สินค้าลดราคา | Book store</title></Head>
    {ItemListPage ? <ItemListPage name={"สินค้าลดราคา"} items={items}/> : <VStack mt={10}><CircularProgress isIndeterminate /></VStack>}
    </>
}

export const getStaticProps: GetStaticProps = async (context) => {
    let onsalesitem = []
    try{
      const bestseller = await fetch(process.env.NEXT_PUBLIC_URL + "/item/onsale", {
        method: "GET",
        headers: {'Content-Type': 'application/json'},
      });
      onsalesitem = await bestseller.json() || []
    }catch(err){
      console.log(err)
    }
  
    return {
      props: {
        items: onsalesitem ? onsalesitem : []
      },
      revalidate: 10
    };
  };

export default Sale