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
} from "@chakra-ui/react";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import styles from "./login.module.css";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import NextLink from "next/link";

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
        p={{ base: "30px", md: "50px" }}
        borderRadius="lg"
        maxW="600px"
        w="90%"
      >
        <Text
          textAlign="center"
          color="black"
          fontSize="2xl"
          fontWeight="bold"
          mb={8}
        >
          लॉग इन फॉर्म (Login Form)
        </Text>

        <Grid gap={4}>
          <FormControl isInvalid={!!errors.email}>
            <Text mb={1}>Email ID</Text>
            <Input
              name="email"
              type="email"
              placeholder="Email ID"
              value={formData.email}
              onChange={handleChange}
              borderColor="gray.300"
              bg="gray.50"
              color="black"
              focusBorderColor="#fa7602"
              _placeholder={{ color: "gray.400" }}
            />
          </FormControl>

          <FormControl isInvalid={!!errors.password}>
            <Text mb={1}>Password</Text>
            <InputGroup>
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                borderColor="gray.300"
                bg="gray.50"
                color="black"
                focusBorderColor="#fa7602"
                _placeholder={{ color: "gray.400" }}
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
            _hover={{
              bg: "white",
              color: "#fa7602",
              outline: "2px solid #fa7602",
            }}
            bg="#fa7602"
            color="white"
            fontWeight="bold"
            px={8}
            py={6}
            fontSize="lg"
          >
            {isLoading ? <Spinner size="md" color="#fa7602" /> : "लॉग इन करें"}
          </Button>
        </Grid>
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
        </Text>
      </Box>
    </Box>
  );
}
