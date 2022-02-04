import { CircularProgress, Heading, VStack } from "@chakra-ui/react"
import { GetServerSideProps, GetServerSidePropsContext } from "next"
import Head from "next/head"
import {  useState } from "react"
import ItemPage from "../../components/Itempage"

const Product = ({item})=>{
  const [validitem] = useState(item)
  // const axios = useAxios()
  // const router = useRouter()
  // const getitem = useCallback(async(id:string)=>{
  //   try{
  //     const data = await axios.get("item/findOne/"+id)
  //     console.log(data)
  //     setitem(data.data)
  //   }catch(err){
  //     console.log(err)
  //   }
  // },[])
  // useEffect(()=>{
  //   if(!item && router.query.id){
  //     getitem(typeof router.query.id === "string" ? router.query.id : router.query.id[0] || "")
  //   }
  // },[router.query])

    if(!validitem){
     return <VStack mt={10}><Heading>ไม่พบสินค้า</Heading></VStack>
    }
    return <> 
    <Head> <title>{item.name} - {item.owner.firstname} | Book store</title></Head>
    <ItemPage {...validitem}/></>
}
export const getServerSideProps: GetServerSideProps = async (context:GetServerSidePropsContext) => {
    let item = null
    try{
        const {id} = context.query
      const recommenddata = await fetch(process.env.NEXT_PUBLIC_URL + "/item/findOne/"+id, {
        method: "GET",
        headers: {'Content-Type': 'application/json'},
      });
      if(recommenddata.status !== 200){
        throw new Error("Error")
      }
      let itemdata = await recommenddata.json()
      item = itemdata
    }catch(err){
      console.log(err)
    }
  
    return {
      props: {
        item: item
      },
    };
    // ...
  };
export default Product