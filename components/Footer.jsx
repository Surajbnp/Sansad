"use client";

import {
  Box,
  Container,
  Image,
  Text,
  VStack,
  Link,
  Divider,
} from "@chakra-ui/react";
import NextLink from "next/link";

export default function Footer() {
  return (
    <Box
      bg="#faf8f5"
      borderTop="1px solid"
      borderColor="gray.200"
      py={{ base: 8, md: 10 }}
    >
      <Container maxW="6xl">
        <VStack spacing={5}>

          <Image
            src="/SSASatna_Color_Logo_color.png"
            alt="Sansad Suvidha Kendra"
            w={{ base: "110px", md: "150px" }}
          />

          <Divider maxW="90px" borderColor="#d6b37a" />

          <VStack spacing={1}>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="700"
              color="#7A4A1E"
            >
              सांसद सुविधा केंद्र
            </Text>

            <Text
              fontSize={{ base: "13px", md: "14px" }}
              color="gray.600"
              textAlign="center"
            >
              माननीय सांसद श्री गणेश सिंह जी द्वारा संचालित
            </Text>
          </VStack>

          <Link
            href="https://ssksatna.com"
            isExternal
            fontSize={{ base: "13px", md: "14px" }}
            color="#7A4A1E"
            fontWeight="600"
            _hover={{
              textDecoration: "none",
              color: "#9A6024",
            }}
          >
            www.ssksatna.com
          </Link>

          <Text
            fontSize={{ base: "13px", md: "14px" }}
            color="gray.600"
            textAlign="center"
          >
            तकनीकी सहयोग :{" "}
            <Link
              href="https://www.thesociyo.com"
              isExternal
              color="#7A4A1E"
              fontWeight="600"
              _hover={{ textDecoration: "none" }}
            >
              SOCIYO Communications
            </Link>
          </Text>

          <Link
            as={NextLink}
            href="/policy"
            fontSize={{ base: "13px", md: "14px" }}
            color="gray.600"
            _hover={{
              color: "#7A4A1E",
              textDecoration: "underline",
            }}
          >
            गोपनीयता नीति
          </Link>

          <Divider w="100%" borderColor="gray.200" />

          <Text
            fontSize={{ base: "12px", md: "13px" }}
            color="gray.500"
            textAlign="center"
          >
            © {new Date().getFullYear()} सांसद सुविधा केंद्र। सर्वाधिकार सुरक्षित।
          </Text>

        </VStack>
      </Container>
    </Box>
  );
}