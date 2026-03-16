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
  HStack,
  VStack
} from "@chakra-ui/react";
import { useState } from "react";
import { FiEye, FiEyeOff , FiPhone} from "react-icons/fi";
import { MdEmail, MdLock, MdPhone } from "react-icons/md";
import styles from "./login.module.css";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import NextLink from "next/link";
import { Flex } from "@chakra-ui/react";

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
    <Box minH="100vh"  display="flex" flexDirection="column">
      {/* HERO BANNER */}
      <Box
        bg="#fa7602"
        w="100%"
        minH={{ base: "130px", md: "200px" }}
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
            Login
          </Text>
         
        </VStack>
      </Box>

      {/* Zigzag / wave divider */}
      <Box w="100%" lineHeight={0} bg="#fa7602">
        <svg
          viewBox="0 0 1200 30"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ display: "block", width: "100%", height: "30px" }}
        >
          <path
            d="M0,0 L0,15 Q150,30 300,15 Q450,0 600,15 Q750,30 900,15 Q1050,0 1200,15 L1200,0 Z"
            fill="#fa7602"
          />
          <path
            d="M0,15 Q150,30 300,15 Q450,0 600,15 Q750,30 900,15 Q1050,0 1200,15 L1200,30 L0,30 Z"
            fill="#f5f5f0"
          />
        </svg>
      </Box>

      {/* FORM CARD */}
      <Flex
        flex={1}
        align="center"
        justify="center"
        px={4}
        py={{ base: 6, md: 10 }}
      >
        <Box
          borderRadius="2xl"
          p={{ base: "28px", md: "48px" }}
          w="100%"
          maxW="480px"
          border="1px solid rgba(0,0,0,0.06)"
        >
          {/* Form heading */}
          <Text
            fontSize={{ base: "20px", md: "24px" }}
            fontWeight="700"
            color="gray.800"
            mb={1}
          >
            Sign in to your account
          </Text>
          <Text fontSize="sm" color="gray.500" mb={8}>
            Enter your credentials below to continue
          </Text>

          <VStack spacing={5}>
            {/* Email / Username field */}
            <FormControl isInvalid={!!errors.email}>
              <Text mb={1.5} fontWeight="600" color="gray.700" fontSize="sm">
                Mobile No. / Email ID / Username
              </Text>
              <InputGroup>
                <Input
                  name="email"
                  type="text"
                  placeholder="Enter your email or username"
                  value={formData.email}
                  onChange={handleChange}
                  h="50px"
                  borderRadius="lg"
                  borderColor="gray.200"
                  bg="gray.50"
                  color="gray.800"
                  fontSize="sm"
                  focusBorderColor="#fa7602"
                  _placeholder={{ color: "gray.400" }}
                  _hover={{ borderColor: "gray.300" }}
                  pl={10}
                />
                <Box
                  position="absolute"
                  left={3}
                  top="50%"
                  transform="translateY(-50%)"
                  color="gray.400"
                  zIndex={1}
                  pointerEvents="none"
                >
                  <MdEmail size={18} />
                </Box>
              </InputGroup>
              {errors.email && (
                <FormErrorMessage fontSize="xs">
                  {errors.email}
                </FormErrorMessage>
              )}
            </FormControl>

            {/* Password field */}
            <FormControl isInvalid={!!errors.password}>
              <Text mb={1.5} fontWeight="600" color="gray.700" fontSize="sm">
                Password
              </Text>
              <InputGroup>
                <Box
                  position="absolute"
                  left={3}
                  top="50%"
                  transform="translateY(-50%)"
                  color="gray.400"
                  zIndex={1}
                  pointerEvents="none"
                >
                  <MdLock size={18} />
                </Box>
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  h="50px"
                  borderRadius="lg"
                  borderColor="gray.200"
                  bg="gray.50"
                  color="gray.800"
                  fontSize="sm"
                  focusBorderColor="#fa7602"
                  _placeholder={{ color: "gray.400" }}
                  _hover={{ borderColor: "gray.300" }}
                  pl={10}
                />
                <InputRightElement
                  h="50px"
                  onClick={() => setShowPassword(!showPassword)}
                  cursor="pointer"
                  color="gray.400"
                  _hover={{ color: "#fa7602" }}
                >
                  {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                </InputRightElement>
              </InputGroup>
              {errors.password && (
                <FormErrorMessage fontSize="xs">
                  {errors.password}
                </FormErrorMessage>
              )}
            </FormControl>

            {/* Forgot password */}
            <Flex w="100%" justify="flex-end" mt={-2}>
              <Link
                as={NextLink}
                href="/forgot-password"
                fontSize="sm"
                color="#fa7602"
                fontWeight="500"
                _hover={{ textDecoration: "underline" }}
              >
                Forgot Password?
              </Link>
            </Flex>

            {/* Submit button */}
            <Button
              onClick={handleSubmit}
              bg="#fa7602"
              color="white"
              w="100%"
              h="52px"
              fontSize="16px"
              fontWeight="700"
              borderRadius="lg"
              boxShadow="0 4px 16px rgba(250,118,2,0.35)"
              _hover={{
                bg: "#e56a00",
                transform: "translateY(-1px)",
                boxShadow: "0 6px 20px rgba(250,118,2,0.4)",
              }}
              _active={{ bg: "#d46200", transform: "translateY(0)" }}
              transition="all 0.2s"
              mt={1}
            >
              {isLoading ? <Spinner size="sm" color="white" /> : "लॉगिन करें"}
            </Button>
          </VStack>

          {/* Divider + Signup */}
          <HStack my={6} spacing={3}>
            <Divider borderColor="gray.200" />
            <Text
              fontSize="xs"
              color="gray.400"
              whiteSpace="nowrap"
              flexShrink={0}
            >
              नया खाता बनाएं
            </Text>
            <Divider borderColor="gray.200" />
          </HStack>

          <Flex
            justify="center"
            align="center"
            gap={1}
            fontSize="sm"
            color="gray.600"
          >
            <Text>पहली बार आए हैं?</Text>
            <Link
              as={NextLink}
              href="/signup"
              color="#fa7602"
              fontWeight="700"
              _hover={{ textDecoration: "underline" }}
              ml={1}
            >
              Sign Up करें →
            </Link>
          </Flex>
        </Box>
      </Flex>

      {/* HELPLINE FOOTER STRIP */}
     
    </Box>
  );
}
