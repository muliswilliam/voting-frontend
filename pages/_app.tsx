import type { AppProps } from 'next/app'
import { WagmiConfig, createClient } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import { ChakraProvider, useColorMode } from '@chakra-ui/react'
import { mainnet, sepolia } from 'wagmi';

const chains = [mainnet, sepolia]
const alchemyId = process.env.ALCHEMY_ID;
const client = createClient(
  getDefaultClient({
    appName: "Electoral Commission",
    alchemyId,
    chains,
    autoConnect: true
  }),
);

export default function App({ Component, pageProps }: AppProps) {
  const { colorMode } = useColorMode();

  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider theme='auto' mode={colorMode === 'light' ? 'light' : 'dark'} >
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  )
}
