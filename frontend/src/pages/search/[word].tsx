import { CircularProgress, VStack } from "@chakra-ui/react";
import { GetServerSideProps, GetServerSidePropsContext, GetStaticProps } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
// import ItemListPage from "../../components/ItemListPage/ItemListPage"
const ItemListPage = dynamic(()=>import("../../components/ItemListPage/ItemListPage"),{ssr:false})

const Search = ({items,search})=>{
    if(!ItemListPage){
        return <VStack mt={10}><CircularProgress isIndeterminate /></VStack>
    }
    return <>
    <Head>
      <title>{"ผลการค้นหา "+search}</title>
    </Head>
     <ItemListPage name={"ผลการค้นหา "+search} items={items}/></>
}

export const getServerSideProps: GetServerSideProps = async (context:GetServerSidePropsContext) => {
    let items = []
    const {word} = context.query

    try{
      const data = await fetch(process.env.NEXT_PUBLIC_URL + "/item/search/"+word, {
        method: "GET",
        headers: {'Content-Type': 'application/json'},
      });
      items = await data.json()
      console.log(items)
    }catch(err){
      console.log(err)
    }
  
    return {
      props: {
        items: items,
        search: word
      },
    };
    // ...
  };

export default Search