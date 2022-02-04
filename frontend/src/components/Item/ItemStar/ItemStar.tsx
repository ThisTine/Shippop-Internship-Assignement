import { HStack, StackProps } from "@chakra-ui/react"
import { FC } from "react"
import { ImStarEmpty, ImStarFull, ImStarHalf } from "react-icons/im"

const ItemStar:FC<{rating:number,props?:StackProps}> = ({rating,props})=>{
    return(
        <HStack  spacing={0} fontSize={"md"} color={"yellow.400"} {...props} >
                {[0,1,2,3,4].map(item=>{
                    if(rating-item >= 1){
                        return <ImStarFull key={item}/>
                    }
                    if(rating-item < 1 && rating-item >= 0.5){
                        return <ImStarHalf key={item}/>
                    }
                    return <ImStarEmpty key={item}/>
                })}
        </HStack>
    )
}

export default ItemStar