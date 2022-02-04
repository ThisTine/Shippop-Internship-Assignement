import {
  Heading,
  Stack,
  Box,
  HStack,
  Button,
  VStack,
  Text,
  Divider,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import {  ImRadioChecked2, ImRadioUnchecked } from "react-icons/im";
import { BsFillLockFill } from "react-icons/bs";

import Container from "../components/Etc/Container";
import Crop from "../components/Etc/Crop";
import RoundInput from "../components/Etc/RoundInput";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import total from "../functions/cart/total";
import { Logistic } from "../dt/Item";
import { useAxios } from "../functions/axios/useAxios";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";

type locationarg = {
  firstname: string
  lastname: string
  country: string
  location: string
  district: string
  city: string
  province: string
  zipcode: string
  phonenumber: string
}

const Checkout = () => {
  const {cart,location,userdispatch,user,isloading:userloading} = useContext(UserContext)
  const [logis,setlogis] = useState<Logistic>(null)
  const [logistics,setlogistics] = useState<Logistic[]>([])
  const [payment,setpayment] = useState<string>(null)
  const {register,handleSubmit,formState:{isSubmitting}} = useForm<locationarg>()
  const toast = useToast()
  const axios = useAxios()
  const router = useRouter()
  const getlogis = useCallback(async()=>{
    try{
      const data = await axios.get("/user/getlogistic")
      console.log(data.data)
      if(Array.isArray(data.data))
      setlogistics(data.data)
    }catch(err){
      toast({status:"error",title:"Error getting logistic"})
    }
  },[])
  useEffect(()=>{
    getlogis()
  },[])
  useEffect(()=>{
    if(!userloading && !user){
        router.replace("/")
    }
},[user,userloading])
  const submit:SubmitHandler<locationarg> = async(args)=>{
    try{
      await axios.post("/user/checkout",{
        logisticId:logis.id,
        payment,
        updateLocation:true,
        location: {...args}
      })
      userdispatch({type:"setlocation",location:{id:"mockup",userID:user.id,...args}})
      userdispatch({type:"setcart",cart:[]})
      toast({status:"success",title:"Success"})
      router.push("/")
    }catch(err){
      toast({status:"error",title:"Error"})
    }
  } 
  return (
    <Container  >
      <Crop mt={10}>
        <Heading>ชำระเงิน</Heading>

        <Stack as="form" onSubmit={handleSubmit(submit)} pt={12} direction={{ base: "column", xl: "row" }} spacing={10}>
          <Box flex={3}>
            <Heading size="md" mb={5}>ที่อยู่ในการจัดส่ง</Heading>
            <Divider size={"lg"} />


            <VStack >
                <HStack flex={1} w="100%">
                    <FormControl flex={1}>
                        <FormLabel >ชื่อ</FormLabel>
                        <Input defaultValue={location?.firstname} {...register("firstname",{required:true})} />
                    </FormControl>
                    <FormControl  flex={1}>
                        <FormLabel>นามสกุล</FormLabel>
                        <Input defaultValue={location?.lastname} {...register("lastname",{required:true})}/>
                    </FormControl>
                </HStack>

                <FormControl flex={1}>
                        <FormLabel>ประเทศ</FormLabel>
                        <Input defaultValue={location?.country} {...register("country",{required:true})}/>
                </FormControl>
                <FormControl flex={1}>
                        <FormLabel>ที่อยู่ <span style={{color:"red"}}>(บ้านเลขที่/หมู่บ้าน/หมู่ที่/ซอย/ถนน)</span> </FormLabel>
                        <Input defaultValue={location?.location} {...register("location",{required:true})} />
                </FormControl>

                <HStack flex={1} w="100%">
                    <FormControl flex={1}>
                        <FormLabel >แขวง/ตำบล</FormLabel>
                        <Input defaultValue={location?.district} {...register("district",{required:true})}/>
                    </FormControl>
                    <FormControl  flex={1}>
                        <FormLabel>เขต/อำเภอ</FormLabel>
                        <Input defaultValue={location?.city} {...register("city",{required:true})}/>
                    </FormControl>
                </HStack>

                <HStack flex={1} w="100%">
                    <FormControl flex={1}>
                        <FormLabel >จังหวัด</FormLabel>
                        <Input defaultValue={location?.province} {...register("province",{required:true})}/>
                    </FormControl>
                    <FormControl  flex={1}>
                        <FormLabel>รหัสไปรษณีย์</FormLabel>
                        <Input defaultValue={location?.zipcode} {...register("zipcode",{required:true})}/>
                    </FormControl>
                </HStack>

                <FormControl flex={1}>
                        <FormLabel>เบอร์ติดต่อ (กรุณาระบุหมายเลขโทรศัพท์ เฉพาะตัวเลขเท่านั้น)</FormLabel>
                        <Input defaultValue={location?.phonenumber} {...register("phonenumber",{required:true})}/>
                </FormControl>
            </VStack>
            <Box mt={10}>
            <Heading size="md" mb={5}>เลือกขนส่ง</Heading>
            <Divider size={"lg"} />
            <VStack w="100%" mt={5}>
                {logistics.map(item=> <HStack w="100%" cursor={"pointer"} onClick={()=>setlogis(item)}
                 key={item.id} justifyContent={"space-between"} p={10} border="1px solid" rounded={"lg"} borderColor={item.id === logis?.id ? "blue.400" : "gray.200"}>
                    <HStack>
                    <Box color={item.id === logis?.id ? "blue.400" : "gray.500"} > {item.id === logis?.id ? <ImRadioChecked2/> : <ImRadioUnchecked/>} </Box>
                    <Heading fontWeight={"normal"}>{item.name}</Heading>
                    </HStack>
                    <Heading>THB{item.price}</Heading>
                </HStack>)}
            </VStack>
            </Box>

            <Box mt={10}>
            <Heading size="md" mb={5}>วิธีชำระเงิน</Heading>
            <Divider size={"lg"} />
            <VStack  w="100%" mt={5}>
            {["Cash","Crdit card"].map(item=><HStack w="100%" onClick={e=>setpayment(item)} key={item} justifyContent={"space-between"} cursor={"pointer"} p={10} border="1px solid" rounded={"lg"} borderColor={item === payment ? "blue.400" : "gray.200"}>
                    <HStack>
                    <Box color={item === payment ? "blue.400" : "gray.500"} > {item === payment ? <ImRadioChecked2/> : <ImRadioUnchecked/>} </Box>
                    <Heading fontWeight={"normal"}> {item}</Heading>
                    </HStack>
                </HStack>
            )}
            </VStack>
            </Box>

          </Box>

          <VStack
            spacing={14}
            alignItems={"flex-start"}
            flex={1}
            bg="blue.50"
            padding={10}
            rounded="xl"
            h="fit-content"
          >
            <Heading>สรุปคำสั่งซื้อ</Heading>
            <VStack spacing={5} w="100%">
              <HStack w="100%" justifyContent={"space-between"}>
                <Text>ยอดรวม</Text>
                <Text>THB{total(cart)}</Text>
              </HStack>
              <HStack w="100%" justifyContent={"space-between"}>
                <Text>ค่าส่ง</Text>
                <Text>THB{logis?.price || 0}</Text>
              </HStack>
              <Divider />
              <HStack w="100%" justifyContent={"space-between"}>
                <Text>ยอดสุทธิ</Text>
                <Text>THB{total(cart)+parseInt(logis?.price||"0")}</Text>
              </HStack>
            </VStack>
              <Button isLoading={isSubmitting} type={"submit"} isDisabled={!logis || !payment || cart.length <= 0 } colorScheme={"blue"} w="100%" rounded={"full"} size="lg">
               <BsFillLockFill/> ชำระเงิน
              </Button>
          </VStack>
        </Stack>
      </Crop>
    </Container>
  );
};

export default Checkout;
