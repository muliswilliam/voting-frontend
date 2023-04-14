import { ReactNode } from 'react'
import {
  Box,
  Flex,
  Button,
  Link,
  useColorModeValue,
  Stack,
  Text,
  useColorMode,
  HStack,
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NavLinks } from '../../utils/options';


const NavLink = ({ children, url }: { url: string, children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href={url}>
    {children}
  </Link>
);

export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <>
      <Box
        bg={useColorModeValue('whiteAlpha.300', 'blackAlpha.300')}
        borderBottomColor={useColorModeValue('gray.300', 'blackAlpha.200')}
        borderBottomWidth='1px'
        px={4}
      >
        <Flex
          h={16}
          alignItems={'center'}
          justifyContent={'space-between'}
        >

          <HStack spacing={8} alignItems={'center'}>
            <Text fontWeight={700}>EC</Text>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}>
              {NavLinks.map((link) => (
                <NavLink key={link.url} url={link.url}>{link.label}</NavLink>
              ))}
            </HStack>
          </HStack>

          <Flex alignItems={'center'}>
            <Stack
              direction={'row'}
              spacing={7}
            >
              <ConnectButton />
              <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  )
}
