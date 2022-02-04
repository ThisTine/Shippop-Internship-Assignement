import { Grid, GridItem, Heading, useBreakpointValue } from "@chakra-ui/react"
import { FC } from "react"
import { Item } from "../../dt/Item"
import Container from "../Etc/Container"
import Crop from "../Etc/Crop"
import ItemComponent from "../Item/ItemComponent"

const ItemListPage:FC<{items:Item[],name:string}> = ({items,name})=>{
    const itemdisplay = useBreakpointValue({base:2,lg:3,xl:4})
    return(
        <Container>
            <Crop mt={10}>
                <Heading>{name}</Heading>
                {items.length <= 0 && <Heading textAlign={"center"}>ไม่พบสินค้า</Heading>}
                <Grid gap={2} maxW="100vw" overflow={"hidden"} templateColumns={`repeat(${itemdisplay},1fr)`}>
                {items.map(item=><GridItem key={item.id}><ItemComponent key={item.id} item={item} /></GridItem>)}
                </Grid>   
            </Crop>
        </Container>
    )
}

export default ItemListPage