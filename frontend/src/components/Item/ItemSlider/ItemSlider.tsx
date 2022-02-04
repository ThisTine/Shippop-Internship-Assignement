import { Swiper,SwiperSlide } from "swiper/react"
import { Navigation } from "swiper";
import ItemComponent from "../ItemComponent"
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useBreakpointValue } from "@chakra-ui/react";
import { FC } from "react";
import { Item } from "../../../dt/Item";

const ItemSlider:FC<{items:Item[]}> = ({items})=>{
    const slides = useBreakpointValue({base:2,sm:2,md:3,lg:4,xl:5})
    return(
        <Swiper loop={items.length > slides} navigation={true} modules={[Navigation]} spaceBetween={0} slidesPerView={slides} style={{paddingTop:"20px",paddingBottom:"20px"}} >
      {items.map(item=><SwiperSlide key={item.id}><ItemComponent item={item}/></SwiperSlide>)}
    </Swiper>
    )
}



export default ItemSlider