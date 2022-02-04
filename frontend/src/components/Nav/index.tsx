import { Avatar, Box, Heading, Stack, Text, useBreakpointValue } from "@chakra-ui/react"
import { useState } from "react"
import "@fontsource/kanit/400.css"

import Crop from "../Etc/Crop"
// import DesktopNev from "./DesktopNav/DesktopNav"
const DesktopNev = dynamic(()=>import("./DesktopNav/DesktopNav"),{ssr:false})

// import MobileNav from "./MobileNav/MobileNav"
const MobileNav = dynamic(()=>import("./MobileNav/MobileNav"),{ssr:false})

import dynamic from "next/dynamic"
import Link from "next/link"
const SearchBar = dynamic(()=>import("./SearchBar/SearchBar"),{ssr:false})
// import SearchBar from "./SearchBar/SearchBar"
const NavBar = ()=>{
    const ismobile = useBreakpointValue({base:true,lg:false})
    const [issearch,setissearch] = useState(false)
    return <><Stack zIndex={10} bg="white" direction={"row"} w="100vw" justifyContent={"center"} pos={"fixed"} top={0} shadow="md" >
        <Crop direction={"row"} justifyContent={"space-between"} alignItems={"center"} h={20} >
        <>
        {(ismobile && issearch) ? <SearchBar/> :<Box paddingRight={5} ><Link href="/"><Heading cursor={"pointer"}>Book</Heading></Link> </Box>}
        {ismobile ? <MobileNav issearch={issearch} setissearch={setissearch}/> : <DesktopNev issearch={issearch} setissearch={setissearch} />}
        </>
        </Crop>
    </Stack>
    
    </>
}
export default NavBar