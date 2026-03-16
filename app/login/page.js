"use client";

import {
  Box,
  Button,
  Divider,
  Grid,
  Input,
  Text,
  FormControl,
  InputGroup,
  InputRightElement,
  useToast,
  Spinner,
  Link,
  Image,
  HStack
} from "@chakra-ui/react";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import styles from "./login.module.css";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import NextLink from "next/link";
import { Flex } from '@chakra-ui/react';

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    const { email, password } = formData;

    if (!email.trim()) {
      newErrors.email = "कृपया ईमेल दर्ज करें";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "मान्य ईमेल पता दर्ज करें";
    }

    if (!password.trim()) {
      newErrors.password = "कृपया पासवर्ड दर्ज करें";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const firstKey = Object.keys(newErrors)[0];
      toast({
        title: newErrors[firstKey],
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setIsLoading(true);
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        toast({
          title: data.message || "Login failed.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // If login is successful
      setIsLoading(false);
      toast({
        title: data.message || "Login successful.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Store token if needed
      localStorage.setItem("sansadapptoken", data.token);
      login(data.user, data.token);
      router.push("/profile");
    } catch (err) {
      setIsLoading(false);
      console.error("Login error:", err);
      toast({
        title: "Server error. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box className={styles.page}>
      <Box
        className={styles.hero}
        w="100%"
        minH={{ base: "auto", md: "90vh" }}
        position="relative"
      >

        {/* LOGO LEFT SIDE */}
        <Image
          src="/SSASatna_White_Logo.png"
          alt="logo"
          position="absolute"
          top={{ base: "15px", md: "100px" }}
          left={{ base: "20px", md: "100px" }}
          w={{ base: "70px", md: "200px" }}
        />

      </Box>


      {/* ICONS SECTION */}
      <Box w="100%" className={styles.iconsWrapper}>

        {/* DESKTOP ICONS */}
        <Box
          display={{ base: "none", md: "block" }}
          h={{ md: "300px", lg: "350px" }}
          className={styles.icons}
          my="50px"
        />

        {/* MOBILE ICONS */}
        <Flex
          display={{ base: "flex", md: "none" }}
          direction="column"
          align="center"
          gap={6}
          p={6}
          mt="-350px"
        >
          <Image src="/SSK-Satna_Point1.webp" alt="icon1" w="170px" />
          <Image src="/SSK-Satna_Point2.webp" alt="icon2" w="170px" />
          <Image src="/SSK-Satna_Point3.webp" alt="icon3" w="170px" />
        </Flex>

      </Box>

    <HStack
        justify="center"
        spacing={4}
        maxW="80%"
        m="auto"
        my={2}
        flexWrap="wrap"
        overflow="hidden"
        h="12px"
      >
        {[...Array(24)].map((_, i) => (
          <Box
            key={i}
            w="2px"
            h="2px"
            bg="black"
            borderRadius="full"
            flexShrink={0}
          />
        ))}
      </HStack>

      <Box
        p={{ base: "30px", md: "50px" }}
        borderRadius="lg"
        maxW="600px"
        w="100%"
      >


        <Grid gap={4}>
          <FormControl isInvalid={!!errors.email}>
            <Text mb={2}
              fontWeight="bold"
              color="gray.700"
              fontSize="md">Mobile No./Email ID/Username</Text>
            <Input
              name="email"
              type="email"
              placeholder="Mobile No./Email ID/Username"
              value={formData.email}
              onChange={handleChange}
              fontWeight="semibold"
              h="50px"
              borderRadius="md"
              borderColor="gray.400"
              bg="gray.50"
              color="black"
              focusBorderColor="#fa7602"
              _placeholder={{ color: "gray.300", fontWeight: "normal" }}
              _hover={{ borderColor: "gray.500" }}
            />
          </FormControl>

          <FormControl isInvalid={!!errors.password}>
            <Text mb={2} fontWeight="bold" color="gray.700" fontSize="md">
              Password
            </Text>
            <InputGroup>
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                fontWeight="semibold"
                h="50px"
                borderRadius="md"
                borderColor="gray.400"
                bg="gray.50"
                color="black"
                focusBorderColor="#fa7602"
                _placeholder={{ color: "gray.300", fontWeight: "normal" }}
                _hover={{ borderColor: "gray.500" }}
              />
              <InputRightElement
                onClick={() => setShowPassword(!showPassword)}
                cursor="pointer"
                color="gray.500"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Button
            onClick={handleSubmit}

            bg="#fa7602"
            color="white"
            _hover={{
              bg: "#e66a00",
              transform: "scale(1.02)",
            }}
            _active={{
              bg: "#d46200",
            }}

            h="60px"
            w="140px"
            fontSize="28px"
            fontWeight="800"
            borderRadius="10px"
            boxShadow="md"

            justifySelf="center"
            mt={4}
          >
            {isLoading ? <Spinner size="md" color="white" /> : "लॉगिन"}
          </Button>
        </Grid>
        {/* <Text mt={8} textAlign={"center"} fontSize="md" color="gray.600">
          <Link
            as={NextLink}
            href="/forgot-password"
            color="blue"
            fontWeight="sm"
            _hover={{ textDecoration: "underline" }}
          >
            Forget password?
          </Link>
        </Text>
        <Text mt={8} textAlign={"center"} fontSize="md" color="gray.600">
          Not a user?{" "}
          <Link
            as={NextLink}
            href="/signup"
            color="orange.400"
            fontWeight="medium"
            _hover={{ textDecoration: "underline", color: "orange.500" }}
          >
            Signup
          </Link>
        </Text> */}

<Flex 
  direction={{ base: "column", md: "row" }} // Mobile par niche-uupar, desktop par ek line mein
  justify="center" 
  align="center" 
  gap={{ base: 1, md: 2 }} // Mobile par gap thoda kam
  fontSize={{ base: "md", md: "lg" }} // Mobile par font thoda chota
  color="gray.600" 
  mt={8}
>
  <Link
    as={NextLink}
    href="/forgot-password"
    _hover={{ textDecoration: "underline" }}
    textAlign="center"
  >
    Forgot Password ?
  </Link>
  
  {/* Mobile par separator hide kar denge */}
  <Text color="gray.600" display={{ base: "none", md: "block" }}>|</Text>
  
  <Box textAlign="center">
    <Link
      as={NextLink}
      href="/signup"
      color="#fa7602"
      fontWeight="bold"
      _hover={{ textDecoration: "underline" }}
    >
      Click Here
    </Link>
    <Text as="span" ml={1}>to sign up</Text>
  </Box>
</Flex>
 <HStack
          justify="center"
          spacing={4}
          maxW="80%"
          m="auto"
          mt={8}
          flexWrap="wrap"
          overflow="hidden"
          h="12px"
        >
          {[...Array(40)].map((_, i) => (
            <Box
              key={i}
              w="2px"
              h="2px"
              bg="black"
              borderRadius="full"
              flexShrink={0}
            />
          ))}
        </HStack>

       

          <Text mt={{ base: 4, md: 6 }} fontSize={{ base: "22px", md: "40px" }} fontWeight={600} textAlign="center" 
  w="100%">
          हेल्पलाइन: +91 123456789
        </Text>
      </Box>
    </Box >
  );
}


// forget password route is missing
// sending reset link functionality is missing
// sending email functionality is missing
// sending token generation is missing
// reset password route is missing
// reset password functionality is missing
// token verification is missing
// password update functionality is missing
// success and error handling for all above functionalities is missing
// UI for all above functionalities is missing
// validation for all above functionalities is missing
// loading states for all above functionalities is missing
// integration with backend for all above functionalities is missing
// security measures for all above functionalities is missing
// accessibility considerations for all above functionalities is missing
// responsiveness for all above functionalities is missing