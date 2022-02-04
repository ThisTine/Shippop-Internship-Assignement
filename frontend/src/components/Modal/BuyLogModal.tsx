import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, VStack, FormLabel, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Input, ModalFooter, Button, useToast, Accordion, AccordionItem, AccordionButton, AccordionPanel, HStack, Image, AspectRatio, Heading, Box, AccordionIcon, Divider, Text } from "@chakra-ui/react"
import { FC, useCallback, useEffect, useState } from "react"
import { BiRefresh } from "react-icons/bi"
import { modalcontroltype } from "../../contexts/ModelContext"
import { Buylog } from "../../dt/Item"
import { useAxios } from "../../functions/axios/useAxios"

const BuyLogModal:FC<modalcontroltype> = ({state,onClose})=>{
    const axios = useAxios()
    const [buylog,setbuylog] = useState<Buylog[]>([])
    const toast = useToast()
    const [isloading,setisloading] = useState(false)
    const getbuylog = useCallback(async()=>{
        try{
            setisloading(true)
            const data = await axios.get("/user/getbuylog")
            setbuylog(data.data)
            setisloading(false)
        }catch(err){
            setisloading(false)
        }
    },[])
    useEffect(()=>{
        getbuylog()
    },[])
    return(
        <Modal isOpen={state.name === "buylog"} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ประวัติคำสั่งซื้อ <Button colorScheme={"yellow"} isLoading={isloading} onClick={()=>getbuylog()} > <BiRefresh/> </Button> </ModalHeader>
          <ModalCloseButton />
          <ModalBody >
          <Accordion>
              {buylog.map(item=> <AccordionItem key={item.createdDate} >
                <h2>
                <AccordionButton><Box flex='1' textAlign='left'>{item.createdDate}</Box>
                <AccordionIcon />
                </AccordionButton>
                </h2>
                  <AccordionPanel pb={4} >
                        {item.data.map(ite=><HStack key={ite.id}>
                            <Heading size="md">x{ite?.amount || 1}</Heading>
                            <AspectRatio ratio={1/1} width="100px">
                            <Image src={`https://${process.env.NEXT_PUBLIC_IMAGE_URL}${ite.id}`} />
                            </AspectRatio>
                            <Heading size="md">{ite.name}</Heading>
                        </HStack>)}
                        <VStack mt={10}>
                            <Divider/>
                            <Text>ชำระเงินผ่าน: {item.paymentChannel}</Text>
                            <Heading size="md" >รวม: THB{item.price}</Heading>
                        </VStack>
                  </AccordionPanel>
              </AccordionItem>  )}
            </Accordion> 
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
}

export default BuyLogModal