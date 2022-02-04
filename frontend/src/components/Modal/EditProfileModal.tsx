import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, VStack, Input, Box, ModalFooter, Button, useToast } from "@chakra-ui/react"
import { FC, useContext } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { modalcontroltype } from "../../contexts/ModelContext"
import { UserContext } from "../../contexts/UserContext"
import { useAxios } from "../../functions/axios/useAxios"

type editprofile = {
  firstname:string,
  lastname:string
}

const EditProfileModal:FC<modalcontroltype> = ({onClose,state})=>{
  const {register,handleSubmit,watch,formState:{isSubmitting}} = useForm<editprofile>()
  const {user,userdispatch} = useContext(UserContext)
  const axios = useAxios()
  const toast = useToast()
  const editprofile:SubmitHandler<editprofile> = async(props)=>{
    try{
      await axios.patch("/user",{...props})
      userdispatch({type:"setuser",user:{...user,...props}})
      toast({status:"success",title:"Update Success"})
      onClose()
    }catch(err){
      toast({
        status: "error",
        title: "error",
        description: err.response.data.message || "Edit profile error",
      });
    }
  }
    return <Modal isOpen={state.name === "editusername"} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(editprofile)} >
          <ModalHeader>Edit Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody >
              <VStack>
              <Input type="text" placeholder="Firstname" {...register("firstname",{required:"true"})} defaultValue={user?.firstname} />
              <Input type="text" placeholder="Lastname" {...register("lastname",{required:"true"})} defaultValue={user?.lastname} />
              </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme={"teal"} type="submit" isLoading={isSubmitting} isDisabled={!watch("firstname") || !watch("lastname")} >Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
}

export default EditProfileModal