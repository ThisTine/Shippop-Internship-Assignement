import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, VStack, Input, ModalFooter, Button, Textarea, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, FormLabel, useToast } from "@chakra-ui/react"
import { FC } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { modalcontroltype } from "../../contexts/ModelContext"
import { useAxios } from "../../functions/axios/useAxios"
type addcoupon ={
  price:string,
  date:Date
}

const AddCouponModal:FC<modalcontroltype> = ({onClose,state})=>{
  const {register,watch,formState:{isSubmitting},handleSubmit} = useForm<addcoupon>()
  const axios = useAxios()
  const toast = useToast()
  const addcoupon:SubmitHandler<addcoupon> = async({price,date})=>{
    try{
      await axios.post("/manage/adddiscount",{price: parseInt(price),expire:new Date(date),itemID:state?.itemdata.id })
      onClose()
      toast({status:"success",title:"Success"})
    }catch(err){
      toast({status:"error",title:"Error"})
    }
  } 
    return(
        <Modal isOpen={state.name === "addcoupon"} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(addcoupon)}>
          <ModalHeader>Add Coupon</ModalHeader>
          <ModalCloseButton />
          <ModalBody >
              <VStack alignItems={"flex-start"}>
              <FormLabel>Price</FormLabel>
              <NumberInput min={1} defaultValue={parseInt(state.itemdata?.price)} max={state.itemdata?.price}>
              <NumberInputField {...register("price",{required:true})} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormLabel>Expiry date</FormLabel>
              <Input type="date" {...register("date",{required:true})} placeholder="Expiry date" />
              </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme={"teal"} isLoading={isSubmitting} isDisabled={!watch("date") || !watch("price")} type="submit" >Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
}

export default AddCouponModal