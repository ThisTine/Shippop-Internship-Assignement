import { Input, InputProps } from "@chakra-ui/react";

const RoundInput = (props:InputProps)=><Input rounded={"full"} variant="outline" colorScheme={"cyan"} {...props} />

export default RoundInput