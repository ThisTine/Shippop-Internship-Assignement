import { Box, ChakraProvider } from '@chakra-ui/react'


import theme from '../theme'
import { AppProps } from 'next/app'
import NavBar from '../components/Nav'
import NextNProgress from 'nextjs-progressbar'
import ModalContextProvider from '../contexts/ModelContext'
import '../css/swiperNavigation.css'
import UserContextProvider from '../contexts/UserContext'
import Head from 'next/head'
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Head>
        <link rel="shortcut icon" href="/favico.png" type="image/png" />
        <title>Book Shop | ร้านขายหนังสือ</title>
      </Head>
      <NextNProgress />
      <UserContextProvider>
      <ModalContextProvider>
      <NavBar/>
      <Box  h={20} w="100vw" ></Box>
      <Component {...pageProps} />
      </ModalContextProvider>
      </UserContextProvider>
    </ChakraProvider>
  )
}

export default MyApp
