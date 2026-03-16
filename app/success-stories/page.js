"use client";

import { Box, Text, Image, Flex } from "@chakra-ui/react";

export default function About() {
  return (
    <Box>

      {/* HERO SECTION */}
      <Box
        bg="#fa7602"
        w="100%"
        minH={{ base: "140px", md: "250px" }}
        position="relative"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >


        {/* TITLE */}
        <Text
          color="white"
          fontWeight="bold"
          fontSize={{ base: "26px", md: "42px" }}
          letterSpacing="2px"
        >
         Success Stories
        </Text>

      </Box>

      {/* CONTENT SECTION */}
      <Flex
        direction="column"
        align="center"
        textAlign="justify"
        maxW="900px"
        m="auto"
        px={{ base: 6, md: 8 }}
        py={{ base: 10, md: 16 }}
        gap={6}
      >

        <Text fontSize={{ base: "15px", md: "18px" }} lineHeight="1.8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
          ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </Text>

        <Text fontSize={{ base: "15px", md: "18px" }} lineHeight="1.8">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
          non proident, sunt in culpa qui officia deserunt mollit anim id est
          laborum.
        </Text>

        <Text fontSize={{ base: "15px", md: "18px" }} lineHeight="1.8">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae
          asperiores, molestiae tempora pariatur eaque perspiciatis laboriosam
          unde dolore aliquam possimus.
        </Text>

      </Flex>

    </Box>
  );
}