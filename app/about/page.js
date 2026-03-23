"use client";

import { Box, Text, Image, Flex , VStack} from "@chakra-ui/react";
import { useTitle } from "@/hooks/useTitle";

export default function About() {
  useTitle("About Us");
  return (
    <Box>
      {/* HERO SECTION */}
      <Box
        bg="#fa7602"
        w="100%"
        minH={{ base: "130px", md: "300px" }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
        overflow="hidden"
      >
        {/* Decorative circles */}
        <Box
          position="absolute"
          top="-40px"
          right="-40px"
          w="180px"
          h="180px"
          borderRadius="full"
          bg="rgba(255,255,255,0.08)"
        />
        <Box
          position="absolute"
          bottom="-60px"
          left="10%"
          w="220px"
          h="220px"
          borderRadius="full"
          bg="rgba(255,255,255,0.05)"
        />
        <Box
          position="absolute"
          top="20px"
          left="-30px"
          w="100px"
          h="100px"
          borderRadius="full"
          bg="rgba(255,255,255,0.06)"
        />

        <VStack spacing={1} zIndex={1}>
          <Text
            color="white"
            fontWeight="800"
            fontSize={{ base: "28px", md: "38px" }}
            letterSpacing="3px"
            textTransform="uppercase"
          >
            About Us
          </Text>
        
        </VStack>
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
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </Text>

        <Text fontSize={{ base: "15px", md: "18px" }} lineHeight="1.8">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
          proident, sunt in culpa qui officia deserunt mollit anim id est
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
