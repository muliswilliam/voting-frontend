import Head from 'next/head'
import { Inter } from 'next/font/google'
import { useAccount, useContract, useContractRead } from 'wagmi'
import {
  Box,
  Flex,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react'

// abi
import contract from '../contracts/ElectoralCommission.json'

// components
import { MainLayout } from '../components/layouts/main-layout'

export default function Home() {
  const { colorMode } = useColorMode()
  const {data, isError, isLoading, error } = useContractRead({
    address:  '0x4B29246C068b588b6cA35E60eB2e05F36E7CffD8',
    abi: contract.abi,
    functionName: 'getElections',
  })

  console.log({ isError, isLoading, data, error })

  return (
    <MainLayout>
      <Head>
        <title>Voting Dapp</title>
        <meta
          name='description'
          content='Create Elections, vote and monitor results'
        />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1'
        />
        <link
          rel='icon'
          href='/favicon.ico'
        />
      </Head>
      <Box
        pt='32px'
        pb='32px'
        bgGradient={
          colorMode === 'dark'
            ? 'linear-gradient(139.73deg,#313d5c,#3d2a54)'
            : 'linear-gradient(139.73deg,#e5fdff,#f3efff);'
        }
      >
        <Box
          maxW='1200px'
          marginLeft='auto'
          marginRight='auto'
        >
          <Flex
            flexDir='column'
            px='24px'
          >
            <Text
              fontSize='6xl'
              fontWeight={600}
              lineHeight={1.1}
              color={'purple.600'}
              mb='16px'
            >
              Elections
            </Text>
            <Text
              fontSize='2xl'
              fontWeight={700}
              color={useColorModeValue('blackAlpha.800', 'whiteAlpha.800')}
            >
              Create elections, manage candidates and facilitate voting on top
              of blockchain.
            </Text>
          </Flex>
        </Box>
      </Box>

    </MainLayout>
  )
}
