import { CircularProgress, VStack } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
const ItemListPage = dynamic(()=>import("../components/ItemListPage/ItemListPage"),{ssr:false})

const New = ({items})=>{
    return <>
    <Head> <title>สินค้าใหม่ | Book store</title></Head>
    {ItemListPage ? <ItemListPage name={"สินค้าใหม่"} items={items}/> : <VStack mt={10}><CircularProgress isIndeterminate /></VStack>}
    </>
}

export const getStaticProps: GetStaticProps = async (context) => {
    let newitems = []
    try{
      const bestseller = await fetch(process.env.NEXT_PUBLIC_URL + "/item/getall/false", {
        method: "GET",
        headers: {'Content-Type': 'application/json'},
      });
      newitems = await bestseller.json() || []
    }catch(err){
      console.log(err)
    }
  
    return {
      props: {
        items: newitems ? newitems : []
      },
      revalidate: 10
    };
  };

export default New