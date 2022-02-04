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
  Link,
  Box,
  useToast,
} from "@chakra-ui/react";
import { FC, FormEventHandler, useContext } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { modalcontroltype } from "../../contexts/ModelContext";
import { UserContext } from "../../contexts/UserContext";
import { useAxios } from "../../functions/axios/useAxios";

type loginargs = {
  username: string;
  password: string;
};

const LoginModal: FC<modalcontroltype> = ({ onClose, state, dispatch }) => {
  const {
    register,
    watch,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm<loginargs>();
  const { userdispatch } = useContext(UserContext);
  const axios = useAxios();
  const toast = useToast();
  const login: SubmitHandler<loginargs> = async ({ username, password }) => {
    try {
      const data = await axios.post("/auth/login", {
        email: username,
        pwd: password,
      });
      userdispatch({ type: "lodded" });
      console.log(data);
      userdispatch({
        type: "setuser",
        user: {
          email: data.data.email,
          firstname: data.data.firstname,
          lastname: data.data.lastname,
          id: data.data.id,
        },
      });
      userdispatch({ type: "setcart", cart: data.data.cart });
      userdispatch({ type: "setwishlist", wishlist: data.data.whishlists });
      userdispatch({ type: "setReview", review: data.data.reviewes });
      dispatch({type:"close"})
    } catch (err) {
      toast({
        status: "error",
        title: "error",
        description: err.response.data.message || "Login error",
      });
    }
  };

  return (
    <Modal isOpen={state.name === "login"} onClose={onClose}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(login)}>
        <ModalHeader>Login</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            <Input type="email" placeholder="Email" {...register("username",{required:true})} />
            <Input type="password" placeholder="Password" {...register("password",{required:true})} />
          </VStack>
          <Box mt={5}>
            <Link onClick={() => dispatch({ type: "register" })}>Register</Link>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            colorScheme={"teal"}
            type="submit"
            isDisabled={!watch("username") || !watch("password")}
            isLoading={isSubmitting}
          >
            Login
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
