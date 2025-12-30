"use client";

import {
  Box,
  Button,
  Divider,
  Grid,
  GridItem,
  Input,
  Text,
  FormControl,
  FormErrorMessage,
  useToast,
  Select,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  return (
    <Box className={styles.page} minH={{ base: "fit-content", md: "100vh" }}>
      <Box className={styles.hero} minH={{ base: "28vh", md: "90vh" }}></Box>
      <Box
        w="100%"
        h={{ base: "150px", md: "300px", lg: "350px" }}
        backgroundSize={{ base: "350px", md: "600px", lg: "700px" }}
        className={styles.icons}
      ></Box>
      <Divider maxW={"80%"} m={"auto"} borderColor="gray.300" />
      <Box p={8} maxW="800px" m="auto" textAlign="center">
        <Text>
          सांसद सुविधा केंद्र, आप सभी सतना-मैहर लोकसभा क्षेत्र के क्षेत्रीय जनों
          तक मूलभूत सुविधाएं पहुंचाने एवं किसी भी प्रकार की व्यक्तिगत अथवा
          सामूहिक समस्या के त्वरित निराकरण के उद्देश्य से शुरू किया गया है।
        </Text>

        <Text mt={4}>
          सुविधाओं की प्राप्ति अथवा समस्याओं के निराकरण हेतु फॉर्म भरने के लिए
          पहचान पत्र के रूप में अपना आधार कार्ड एवं वोटर आईडी कार्ड अवश्य रख
          लें।
        </Text>

        <Text mt={4}>
          सांसद सुविधा केंद्र से अब आपके लिए सुविधाओं का लाभ है बस एक क्लिक
          दूर...
        </Text>

        <Flex mt={8} gap={8} justify="center" align="center">
          <Button
            bg="#fa7602"
            color="white"
            onClick={() => (window.location.href = "/signup")}
            _hover={{
              bg: "#e85f00",
              transform: "translateY(-2px)",
            }}
            _active={{
              bg: "#d45500",
            }}
            transition="all 0.2s ease"
          >
            अभी रजिस्टर करें
          </Button>

          <Button
            bg="#2fa70b"
            color="white"
            onClick={() => (window.location.href = "/login")}
            _hover={{
              bg: "#248a09",
              transform: "translateY(-2px)",
            }}
            _active={{
              bg: "#1e7207",
            }}
            transition="all 0.2s ease"
          >
            लॉग इन करें
          </Button>
        </Flex>

        <Box>
          <Text
            mt={16}
            mb={8}
            fontSize={{ base: "22px", md: "28px" }}
            fontWeight={600}
          >
            हेल्पलाइन: +91 123456789
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
