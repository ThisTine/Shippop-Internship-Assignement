import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, VStack, Input, ModalFooter, Button, Textarea, useToast } from "@chakra-ui/react"
import { FC } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { modalcontroltype } from "../../contexts/ModelContext"
import { useAxios } from "../../functions/axios/useAxios"

type edititemargs = {
  name: string,
  description:string,
  price:number
}

const EditItemModal:FC<modalcontroltype> = ({onClose,state})=>{
    const {register,watch,formState:{isSubmitting},handleSubmit} = useForm<edititemargs>()
    const toast = useToast()
    const edit:SubmitHandler<edititemargs> = async (props)=>{
    const axios = useAxios()
      try{
        await axios.patch("/manage/updateitem",{itemID:state.itemdata.id,...props,price:parseFloat(props.price+"")})
        toast({status:"success",title:"Success",description:"Updated item, please refresh to see the result"})
        onClose()
      }catch(err){
        toast({status:"error",title:"Error"})
      }
    }
    return(
        <Modal isOpen={state.name === "editproduct"} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(edit)}>
          <ModalHeader>Edit {state.itemdata?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody >
              <VStack>
              <Input {...register("name",{required:true})} type="text" placeholder="Name" defaultValue={state.itemdata?.name} />
              <Textarea {...register("description",{required:true})}  type="text" placeholder="Description" defaultValue={state.itemdata?.description} />
              <Input {...register("price",{required:true})} type="number" defaultValue={state.itemdata?.price} placeholder="Price" />
              </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button type="submit" colorScheme={"teal"} isLoading={isSubmitting}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
}

export default EditItemModal