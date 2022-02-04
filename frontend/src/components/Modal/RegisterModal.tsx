import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  ModalFooter,
  Button,
  VStack,
  Box,
  Link,
  useToast,
} from "@chakra-ui/react";
import { FC, useContext } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { modalcontroltype } from "../../contexts/ModelContext";
import { UserContext } from "../../contexts/UserContext";
import { useAxios } from "../../functions/axios/useAxios";

type registerargs = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  repassword: string;
};

const RegisterModal: FC<modalcontroltype> = ({ onClose, state, dispatch }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<registerargs>();
  const { userdispatch } = useContext(UserContext)
  const axios = useAxios();
  const toast = useToast();
  const regisOnsubmit: SubmitHandler<registerargs> = async ({
    email,
    firstname,
    lastname,
    password,
  }) => {
    try {
      const data = await axios.post("/auth/register", {
        firstname,
        lastname,
        email,
        pwd: password,
      });
      userdispatch({type:"setuser",user:data.data})
      toast({ status: "success", title: "Success" });
      dispatch({type:"close"})
      
    } catch (err) {
      toast({ status: "error", title: err.response.data.message || "error" });
    }
  };

  return (
    <Modal isOpen={state.name === "register"} onClose={onClose}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(regisOnsubmit)}>
        <ModalHeader>Reigster</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            <Input
              type="text"
              placeholder="Fistname"
              {...register("firstname", { required: true })}
            />
            <Input
              type="text"
              placeholder="Lastname"
              {...register("lastname", { required: true })}
            />
            <Input
              type="email"
              placeholder="Email"
              {...register("email", { required: true })}
            />
            <Input
              type="password"
              placeholder="Password"
              {...register("password", { required: true })}
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              {...register("repassword", { required: true })}
            />
          </VStack>
          <Box mt={5}>
            <Link onClick={() => dispatch({ type: "login" })}>Login</Link>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            colorScheme={"teal"}
            type="submit"
            isLoading={isSubmitting}
            isDisabled={
              !watch("firstname") ||
              !watch("lastname") ||
              !watch("email") ||
              !watch("password") ||
              !watch("repassword") ||
              (watch("password") !== watch("repassword"))
            }
          >
            Register
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RegisterModal;
