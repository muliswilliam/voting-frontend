import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { Text } from '@chakra-ui/react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Voting Dapp</title>
        <meta name="description" content="Create Elections, vote and monitor results" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Text>Some test text</Text>
    </>
  )
}
