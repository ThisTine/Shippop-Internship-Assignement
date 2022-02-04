import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  Input,
  Textarea,
  ModalFooter,
  Button,
  Select,
  useToast,
  FormLabel,
  Box,
} from "@chakra-ui/react";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { modalcontroltype } from "../../contexts/ModelContext";
import { useAxios } from "../../functions/axios/useAxios";
import AddCategoryModalBody from "./modalbody/AddCategoryModalBody";
import { useDropzone } from "react-dropzone";
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop, { Crop } from "react-image-crop";
import { SubmitHandler, useForm } from "react-hook-form";
import { getCroppedImg } from "../../functions/Cropimage/getCroppedImg";

export type addcategorytype = {
  name: string;
  id: string;
};

export type categorytype = {
  name: string;
  id: string;
};

type createItemargs = {
  name: string;
  publisher: string;
  description: string;
  price: number;
  amount: number;
  categoryId: string;
};

const CreateItemModal: FC<modalcontroltype> = ({ onClose, state }) => {
  const axios = useAxios();
  const {
    register,
    watch,
    formState: { isSubmitting },
    handleSubmit,
    reset
  } = useForm<createItemargs>();
  const [categories, setcategories] = useState([]);
  const toast = useToast();
  const [file, setfile] = useState<string>(null);
  const [defaultcategory, setdefaulcategory] = useState("");
  const imgRef = useRef(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 100,
    height: 0,
    x: 0,
    y: 0,
    aspect: 1 / 1,
  });

  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);
    const reader = new FileReader();
    reader.readAsDataURL(acceptedFiles[0]);
    reader.onloadend = () => {
      if (typeof reader.result === "string") setfile(reader.result);
    };
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const getcategories = useCallback(async () => {
    try {
      const data = await axios.get("/item/allcategory");
      setcategories(data.data || []);
    } catch (err) {
      toast({ status: "error", title: "Error while getting categories" });
    }
  }, [axios]);
  const addcategory: (props: addcategorytype) => void = ({ name, id }) => {
    setcategories([...categories, { id, name }]);
    setdefaulcategory(id);
  };
  useEffect(() => {
    getcategories();
  }, []);
  const additem: SubmitHandler<createItemargs> = async(props) => {
      try{
        const image = await getCroppedImg(imgRef.current,crop)
        const data = await axios.post("/manage/createItem",{...props,price:parseFloat(props.price+""),amount:parseInt(props.amount+""),image:image})
        reset()
        setfile(null)
        setdefaulcategory("")
      }catch(err){
          toast({status:"error",title:"Error"})
      }
  };
  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);
  return (
    <Modal
      scrollBehavior="inside"
      isOpen={state.name === "createItem"}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(additem)}>
        <ModalHeader>Create Item</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            {file && (
              <ReactCrop
                onImageLoaded={onLoad}
                src={file}
                crop={crop}
                onChange={(e) => setCrop(e)}
              ></ReactCrop>
            )}
            <VStack
              {...getRootProps()}
              justifyContent="center"
              w="100%"
              h={36}
              bg={"blue.300"}
              rounded="lg"
              color={"white"}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>วางไฟล์ที่นี่</p>
              ) : (
                <p>ลากวางไฟล์หรือกดเพื่อ upload ไฟล์</p>
              )}
            </VStack>
            <Input
              type="text"
              {...register("name", { required: true })}
              placeholder="ชื่อ"
            />
            <Input
              type="text"
              {...register("publisher", { required: true })}
              placeholder="สำนักพิมพ์"
            />
            <Textarea
              type="text"
              {...register("description", { required: true })}
              placeholder="คำอธิบาย"
            />
            <Select
              {...register("categoryId", { required: true })}
              placeholder="หมวดหมู่"
              value={defaultcategory}
              onChange={(e) => setdefaulcategory(e.target.value)}
            >
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
            <Box w="100%" padding={3} bg={"blue.200"} rounded="lg">
              <FormLabel>สร้างหมวดหมู่ใหม่</FormLabel>
              <AddCategoryModalBody add={addcategory} />
            </Box>
            <Input
              type="number"
              {...register("amount", { required: true })}
              placeholder="ปริมาณ"
            />
            <Input
              type="number"
              {...register("price", { required: true })}
              placeholder="ราคา"
            />
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            colorScheme={"teal"}
            isDisabled={
              !watch("amount") ||
              !watch("categoryId") ||
              !watch("description") ||
              !watch("name") ||
              !watch("publisher") ||
              !watch("price") ||
              !file
            }
            isLoading={isSubmitting}
            type="submit"
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateItemModal;
