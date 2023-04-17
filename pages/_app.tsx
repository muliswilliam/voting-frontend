import type { AppProps } from 'next/app'
import { WagmiConfig, configureChains, createClient } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from '@rainbow-me/rainbowkit'

import { ChakraProvider, useColorMode } from '@chakra-ui/react'
import '@rainbow-me/rainbowkit/styles.css'

export default function App({ Component, pageProps }: AppProps) {
  const { colorMode } = useColorMode()
  const { chains, provider } = configureChains(
    [sepolia],
    [
      alchemyProvider({ apiKey: process.env.ALCHEMY_ID || '' }),
      jsonRpcProvider({
        rpc: () => ({
          http: `https://rpc.sepolia.org/`,
        }),
      }),
    ]
  )
  const { connectors } = getDefaultWallets({
    appName: 'Electoral Commission',
    projectId: 'YOUR_PROJECT_ID', // TODO: Add wallet connect project id: https://cloud.walletconnect.com
    chains,
  })
  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  })

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        theme={colorMode === 'light' ? lightTheme() : darkTheme()}
      >
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
