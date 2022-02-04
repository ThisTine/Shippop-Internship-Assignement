import { Avatar, Box, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Text, HStack, useDisclosure, DrawerFooter, useToast, Button } from "@chakra-ui/react"
import Link from "next/link"
import { Dispatch, FC, SetStateAction, useContext, useState } from "react"
import { AiOutlineClose } from "react-icons/ai"
import { FiSearch, FiShoppingCart } from "react-icons/fi"
import { GiHamburgerMenu } from "react-icons/gi"
import { ModalContext } from "../../../contexts/ModelContext"
import { UserContext } from "../../../contexts/UserContext"
import { useAxios } from "../../../functions/axios/useAxios"
import { getGravatar } from "../../../functions/md5/getGravatar"
import { linkpath } from "../DesktopNav/DesktopNav"
import MobileItemBox from "./MobileItemBox"

const MobileNav:FC<{issearch:boolean,setissearch:Dispatch<SetStateAction<boolean>>}>  = ({issearch,setissearch})=>{
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isprofile,setisprofile] = useState(false)
    const {dispatch} = useContext(ModalContext)
    const {userdispatch,user} = useContext(UserContext)
    const axios = useAxios()
    const toast = useToast()
    const logout = async ()=>{
        try{
            await axios.post("/auth/logout")
            userdispatch({type:"logout"})
            location.reload()
        }catch(err){
            toast({status:"error",title:"Logged out error"})
        }
    }
    return(
        <>
        <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          {user && <DrawerHeader bg="blue.500" color="white">
              <HStack justifyContent={"space-between"} >
              <Avatar cursor={"pointer"} src={getGravatar(user.email)}  onClick={()=>setisprofile(!isprofile)}/>
              <Link href="/cart">
                <Box cursor={"pointer"}>
              <FiShoppingCart/></Box></Link>
              </HStack>
              <Text cursor={"pointer"}  onClick={()=>setisprofile(!isprofile)} as="h2" fontSize={"2xl"} mt={5} >{user?.firstname + " "+ user?.lastname}</Text>
          </DrawerHeader>}

          <DrawerBody>
          {isprofile ? <>
            <MobileItemBox onClick={()=>dispatch({type:"editusername"})} >จัดการโปรไฟล์</MobileItemBox>
            <MobileItemBox onClick={()=>dispatch({type:"buylog"})} >ประวัติคำสั่งซื้อ</MobileItemBox>
            <Link href="/manage"><MobileItemBox>จัดการสินค้า</MobileItemBox></Link>
            <MobileItemBox onClick={()=>logout()}>ออกจากระบบ</MobileItemBox>
          </> : linkpath.map(item=><Link href={item.path} key={item.path}><MobileItemBox>{item.name}</MobileItemBox></Link>)}
        
          </DrawerBody>
          {!user && <DrawerFooter>
          <Button colorScheme={"teal"} onClick={()=>dispatch({type:"login"})} flex={1} >Login</Button>
          </DrawerFooter>}
        </DrawerContent>
      </Drawer>
        <HStack gap={5} fontSize={"xl"} >
        {!issearch ? <Box cursor={"pointer"} onClick={()=>setissearch(true)} ><FiSearch/></Box>  : <Box cursor={"pointer"} onClick={()=>setissearch(false)} ><AiOutlineClose/></Box>}
            <Box cursor={"pointer"} onClick={onOpen}>
            <GiHamburgerMenu/>
            </Box>
        </HStack>
        </>
    )
}

export default MobileNav