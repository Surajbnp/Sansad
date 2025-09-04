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
} from "@chakra-ui/react";
import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  return (
    <Box className={styles.page} minH={{base : 'fit-content' , md : "100vh"}}>
      <Box className={styles.hero} minH={{base : '28vh' , md : "90vh"}}></Box>
      <Box
        w="100%"
        h="30vh"
        backgroundSize={{ base: "350px", md: "600px", lg: "700px" }}
        className={styles.icons}
      ></Box>
      <Divider maxW={"80%"} m={"auto"} borderColor="gray.300" />
    </Box>
  );
}
