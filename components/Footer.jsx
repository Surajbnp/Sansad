"use client";

import {
  Box,
  Container,
  Image,
  Text,
  VStack,
  Link,
} from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box bg="white" color="black" py={{ base: 5, md: 10 }}>
      <Container maxW="7xl">
        <VStack spacing={{ base: 4, md: 6 }} align="center">

          <Box w="80%" h="2px" bg="transparent" />

          <VStack spacing={2}>
            <Image
              w={{ base: "110px", md: "160px" }}
              src="/SSASatna_Color_Logo_color.png"
              alt="Sansad Suvidha Kendra Logo"
            />
          </VStack>

          <Text
            fontSize={{ base: "10px", md: "xs" }}
            color="gray.400"
            textAlign="center"
          >
            Powered By —{" "}
            <Link
              href="https://sociyo.in"
              isExternal
              fontWeight="semibold"
              color="gray.500"
            >
              SOCIYO COMMUNICATION PVT LTD
            </Link>
          </Text>

          <Text
            fontSize={{ base: "10px", md: "xs" }}
            color="gray.500"
            textAlign="center"
          >
            Copyright (C) All Rights Reserved |{" "}
            <Link
              href="https://ssksatna.com"
              isExternal
              ml={1}
              fontWeight="medium"
            >
              ssksatna.com
            </Link>
          </Text>

        </VStack>
      </Container>
    </Box>
  );
}