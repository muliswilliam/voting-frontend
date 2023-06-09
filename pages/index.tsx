import React from 'react'
import Head from 'next/head'
import { useAccount, useContractRead } from 'wagmi'
import {
  Box,
  Button,
  Flex,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'

import { useIsMounted } from '../hooks/use-is-mounted'

// abi
import contract from '../contracts/ElectoralCommission.json'

// components
import { MainLayout } from '../components/layouts/main-layout'
import { CreateElectionModal } from '../components/create-election-modal/create-election-modal'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function Home() {
  const isMounted = useIsMounted()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const { colorMode } = useColorMode()
  const { isConnected } = useAccount()
  const { data, isLoading, isError } = useContractRead({
    abi: contract.abi,
    address: process.env
      .NEXT_PUBLIC_ELECTORAL_COMMISSION_CONTRACT_ADDRESS as `0x${string}`,
    functionName: 'getElections',
    enabled: true,
  })
  const textColor = useColorModeValue('blackAlpha.800', 'whiteAlpha.800')

  if (!isMounted) return null

  if (!isLoading && !isError && data) {
    console.log(data)
  }

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
              color={textColor}
            >
              Create elections, manage candidates and facilitate voting on top
              of blockchain.
            </Text>
            <Box  mt={10}>
              {isConnected ? (
                <Button
                  w={150}
                  onClick={onOpen}
                  variant='solid'
                  colorScheme='purple'
                >
                  Create election
                </Button>
              ) : (
                <ConnectButton />
              )}
            </Box>
          </Flex>
        </Box>
      </Box>
      <CreateElectionModal
        isOpen={isOpen}
        onClose={onClose}
      />
    </MainLayout>
  )
}
