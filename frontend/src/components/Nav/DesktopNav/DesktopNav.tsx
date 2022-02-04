import {
  AspectRatio,
  Avatar,
  Box,
  Button,
  Heading,
  HStack,
  Image,
  Input,
  InputGroup,
  InputRightAddon,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Stack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Dispatch, FC, SetStateAction, useContext, useRef } from "react";
import { FiEdit, FiPenTool, FiSearch, FiShoppingCart } from "react-icons/fi";
import { AiFillCodepenCircle, AiOutlineClose } from "react-icons/ai";
import SearchBar from "../SearchBar/SearchBar";
import Link from "next/link";
import { ModalContext } from "../../../contexts/ModelContext";
import { UserContext } from "../../../contexts/UserContext";
import { useAxios } from "../../../functions/axios/useAxios";
import total from "../../../functions/cart/total";
import { getGravatar } from "../../../functions/md5/getGravatar";

export const linkpath = [
  { name: "สินค้าใหม่", path: "/new" },
  { name: "สินค้าขายดี", path: "/bestseller" },
  { name: "สินค้าลดราคา", path: "/sale" },
];

const DesktopNev: FC<{
  issearch: boolean;
  setissearch: Dispatch<SetStateAction<boolean>>;
}> = ({ issearch, setissearch }) => {
  const btnRef = useRef<HTMLButtonElement>();
  const { dispatch } = useContext(ModalContext);
  const { userdispatch, cart } = useContext(UserContext);
  const toast = useToast();
  const { user,removefromcart,isloadingproduct } = useContext(UserContext);
  const axios = useAxios();
  const logout = async () => {
    try {
      await axios.post("/auth/logout");
      userdispatch({ type: "logout" });
      location.reload();
    } catch (err) {
      toast({ status: "error", title: "Logged out error" });
    }
  };
  return (
    <HStack flex={1}>
      {issearch ? (
        <SearchBar />
      ) : (
        <Stack direction="row" flex={1}>
          {" "}
          {linkpath.map((item) => (
            <Link key={item.name} href={item.path}>
              <Box cursor="pointer">
                {" "}
                <Text  _hover={{textDecoration:"underline"}}>{item.name}</Text>{" "}
              </Box>
            </Link>
          ))}{" "}
        </Stack>
      )}

      <Stack
        direction="row"
        alignItems={"center"}
        gap={5}
        fontWeight="bold"
        fontSize={"xl"}
      >
        {!issearch ? (
          <Box cursor={"pointer"} onClick={() => setissearch(true)}>
            <FiSearch />
          </Box>
        ) : (
          <Box cursor={"pointer"} onClick={() => setissearch(false)}>
            <AiOutlineClose />
          </Box>
        )}
        {user && (
          <Popover initialFocusRef={btnRef}>
            <PopoverTrigger>
              <Button variant={"ghost"}>
                <FiShoppingCart />
              </Button>
            </PopoverTrigger>
            <Portal>
              <PopoverContent>
                <PopoverArrow />
                <PopoverHeader p={5} display={"flex"} flexDir="column" gap={2}>
                  <Heading textAlign={"center"} size="md">
                    ตระกร้าของฉัน
                  </Heading>
                  <Text textAlign={"center"}>
                    {cart.length} สินค้าในตระกร้า
                  </Text>
                  <Link href={"/cart"}>
                    <Button
                      w="100%"
                      rounded={"full"}
                      variant={"outline"}
                      colorScheme={"blue"}
                    >
                      ดูหรือแก้ไขตระกร้าของฉัน
                    </Button>
                  </Link>
                </PopoverHeader>
                <PopoverBody>
                  <VStack>
                    {cart.map((item) => (
                      <HStack key={item.item.id} w="100%" paddingX={5}>
                        <Box>
                          {" "}
                          <Heading size={"md"}>{item.amount}x</Heading>{" "}
                        </Box>
                        <HStack flex={1}>
                          <AspectRatio w="75px" maxW="75px" ratio={1 / 1}>
                            <Image
                              src={`https://${process.env.NEXT_PUBLIC_IMAGE_URL}${item.item.id}`}
                              objectFit={"cover"}
                              alt="test"
                            />
                          </AspectRatio>
                          <Text>{item.item.name}</Text>
                        </HStack>
                        <VStack gap={0}>
                          <Button
                            m={0}
                            p={0}
                            variant={"outline"}
                            rounded="full"
                            fontSize={"x-small"}
                            isLoading={isloadingproduct}
                            onClick={()=>removefromcart(item.item)}
                          >
                            x
                          </Button>
                          {user.id === item.item.ownerID && (
                            <Button
                              m={0}
                              p={0}
                              variant={"outline"}
                              rounded="full"
                              fontSize={"x-small"}
                              isLoading={isloadingproduct}
                              onClick={() =>
                                dispatch({
                                  type: "editproduct",
                                  itemdata: item.item,
                                })
                              }
                            >
                              <FiEdit />{" "}
                            </Button>
                          )}
                        </VStack>
                      </HStack>
                    ))}
                  </VStack>
                </PopoverBody>
                <PopoverFooter>
                  <VStack p={5}>
                    <HStack>
                      <Text fontSize={"sm"}>ยอดรวม:</Text>
                      <Heading size={"md"}>
                        THB
                        {total(cart)}
                      </Heading>
                    </HStack>
                    <Link href="/checkout">
                      <Button
                        ref={btnRef}
                        colorScheme={"blue"}
                        w="100%"
                        rounded={"full"}
                        isDisabled={cart.length <= 0}
                      >
                        ชำระเงิน
                      </Button>
                    </Link>
                  </VStack>
                </PopoverFooter>
              </PopoverContent>
            </Portal>
          </Popover>
        )}
        {user ? (
          <Menu>
            <MenuButton>
              <Avatar src={getGravatar(user.email)} />
            </MenuButton>
            <Portal>
              <MenuList zIndex={999}>
                <MenuItem onClick={() => dispatch({ type: "editusername" })}>
                  จัดการโปรไฟล์
                </MenuItem>
                <MenuItem onClick={() => dispatch({ type: "buylog" })}>
                  ประวัติคำสั่งซื้อ
                </MenuItem>
                <Link href="/manage">
                  <MenuItem>จัดการสินค้า</MenuItem>
                </Link>
                <MenuItem onClick={() => logout()}>ออกจากระบบ</MenuItem>
              </MenuList>
            </Portal>
          </Menu>
        ) : (
          <Button
            colorScheme={"teal"}
            onClick={() => dispatch({ type: "login" })}
          >
            Login
          </Button>
        )}
      </Stack>
    </HStack>
  );
};

export default DesktopNev;
