import { ComponentWithAs, Stack, StackProps } from "@chakra-ui/react";

const Crop = (props:StackProps)=>(
    <Stack w={['95%','90%','80%','70%']} direction={"column"} {...props} />
)

export default Crop