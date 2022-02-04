import { AspectRatio, Box, Button, CircularProgress, Heading, HStack, Image, VStack } from "@chakra-ui/react"
import { GiPencil, GiTrashCan } from "react-icons/gi"
import Container from "../components/Etc/Container"
import Crop from "../components/Etc/Crop"
import { RiCoupon3Fill } from 'react-icons/ri'
import ItemWithManage from "../components/Manage/ItemWithManage"
import { useCallback, useContext, useEffect, useState } from "react"
import { UserContext } from "../contexts/UserContext"
import { ModalContext } from "../contexts/ModelContext"
import { Item } from "../dt/Item"
import { useAxios } from "../functions/axios/useAxios"
import {BiRefresh} from 'react-icons/bi'
import { useRouter } from "next/router"
import Head from "next/head"

const Manage = ()=>{
    const { dispatch } = useContext(ModalContext)
    const {user,isloading} = useContext(UserContext)
    const [items,setitems] = useState<Item[]>([])
    const axios = useAxios()
    const [isloding,setisloading] = useState(false)
    const getitems = useCallback(async()=>{
        try{
            setisloading(true)
            const data = await axios.get("/manage/getitems")
            setitems(data.data)
            setisloading(false)
        }catch(err){
            console.log(err)
            setisloading(false)
        }
    },[])
    useEffect(()=>{
        getitems()
    },[])
    const deleteitem = (itemid:string)=>{
        setitems(items.filter(item=>item.id !== itemid))
    }
    const router = useRouter()
    useEffect(()=>{
        if(!isloading && !user){
            router.replace("/")
        }
    },[user,isloading])
    const deletecoupon = (itemid:string)=>{
        setitems(items.map(item=>{
            if(itemid === item.id){
                delete item['saleprice']
            }
            return item
        }))
    }
    return(
        <Container>
            <Head>
                <title>จัดการสินค้า</title>
            </Head>
            <Crop mt={10}>
                <Heading>จัดการสินค้า</Heading>
                <HStack alignSelf="flex-end">
                <Button onClick={()=>dispatch({type:"createItem"})} colorScheme={"teal"}  w={"fit-content"}>สร้างสินค้า</Button>
                <Button onClick={()=>getitems()} colorScheme="yellow" isLoading={isloding} > <BiRefresh/> </Button>
                </HStack>
                {isloading && <CircularProgress size='100px' isIndeterminate justifySelf={"center"} alignSelf={"center"} thickness='4px' />}
                <VStack>
                {items.map(item=><ItemWithManage item={item} deleteitem={deleteitem} deletecoupon={deletecoupon} key={item.id}/>)}
                </VStack>

            </Crop>
        </Container>
    )
}

export default Manage