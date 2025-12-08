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
import { set } from "mongoose";
import { useRouter } from "next/navigation";
import { Link } from "@chakra-ui/react";
import NextLink from "next/link";

const initialState = {
  name: "",
  address: "",
  sex: "",
  email: "",
  voterId: "",
  aadhar: "",
  whatsapp: "",
  password: "",
};

export default function Home() {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const fields = [
    {
      key: "email",
      label: "ईमेल (Email)",
      required: true,
      type: "email",
    },
    {
      key: "password",
      label: "पासवर्ड (Password)",
      required: true,
      type: "password",
    },
    { key: "name", label: "नाम (Name)", required: true },
    { key: "address", label: "वर्तमान पता (Address)", required: true },
    {
      key: "sex",
      label: "लिंग (Sex)",
      required: true,
      type: "select",
      options: ["Male", "Female"],
    },
    {
      key: "vidhansabha",
      label: "विधान सभा (Vidhan Sabha)",
      required: true,
      type: "select",
      options: [
        "Ranchi Central",
        "Ranchi East",
        "Ranchi West",
        "Ranchi North",
        "Ranchi South",
      ],
    },
    {
      key: "voterId",
      label: "वोटर आईडी (Voter ID)",
      required: false,
    },
    {
      key: "aadhar",
      label: "आधार संख्या (Aadhar Number)",
      required: true,
      type: "number",
    },
    {
      key: "whatsapp",
      label: "व्हाट्सएप नंबर (WhatsApp Number)",
      required: false,
      type: "number",
    },
  ];

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
    setErrors({ ...errors, [key]: false });
  };

  const validate = () => {
    const newErrors = {};

    fields.forEach((field) => {
      const value = formData[field.key]?.toString().trim();

      if (field.required && !value) {
        newErrors[field.key] = true;
      }

      // Aadhar validation
      if (field.key === "aadhar" && value && !/^\d{12}$/.test(value)) {
        newErrors[field.key] = "आधार संख्या 12 अंकों की होनी चाहिए";
      }

      // WhatsApp number validation
      if (field.key === "whatsapp" && value && !/^\d{10}$/.test(value)) {
        newErrors[field.key] = "व्हाट्सएप नंबर 10 अंकों का होना चाहिए";
      }

      // Email validation
      if (
        field.key === "email" &&
        value &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ) {
        newErrors[field.key] = "कृपया एक मान्य ईमेल दर्ज करें";
      }

      // Password length check (min 6)
      if (field.key === "password" && value && value.length < 6) {
        newErrors[field.key] = "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!validate()) {
      setIsLoading(false);
      toast({
        title: "कृपया सभी आवश्यक फ़ील्ड भरें",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const payload = {
      ...formData,
      aadhar: Number(formData.aadhar),
      whatsapp: formData.whatsapp ? Number(formData.whatsapp) : undefined,
    };

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setIsLoading(false);
        toast({
          title: "सफलतापूर्वक रजिस्टर किया गया!",
          description: result?.message || "",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setFormData(initialState);
        router.push("/login");
      } else {
        setIsLoading(false);
        toast({
          title: "रजिस्ट्रेशन विफल",
          description: result?.message || "कुछ गलत हो गया।",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "सर्वर त्रुटि",
        description: "कृपया पुनः प्रयास करें।",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error("Signup error:", error);
    }
  };

  return (
    <Box className={styles.page}>
      <Box className={styles.hero} minH={{ base: "28vh", md: "90vh" }}></Box>
      <Box
        w="100%"
        h="30vh"
        backgroundSize={{ base: "350px", md: "600px", lg: "700px" }}
        className={styles.icons}
      ></Box>
      <Divider maxW={"80%"} m={"auto"} borderColor="gray.300" />

      <Box className={styles.form} p={{ base: "40px", md: "80px" }}>
        <Box maxW="900px" p={4}>
          <Text
            textAlign="center"
            color="black"
            fontSize="2xl"
            fontWeight="bold"
            mb={8}
          >
            रजिस्ट्रेशन फॉर्म (Registration Form)
          </Text>

          <Grid
            className={styles.formGrid}
            color="black"
            templateColumns={{ base: "1fr", md: "1fr 1fr" }}
            gap={8}
          >
            {fields.map((field) => (
              <GridItem key={field.key}>
                <FormControl isInvalid={errors[field.key]}>
                  <Text mb={1}>
                    {field.label}
                    {field.required && (
                      <Text as="span" color="red">
                        *
                      </Text>
                    )}
                  </Text>

                  {field.type === "select" ? (
                    <Select
                      placeholder="Select option"
                      value={formData[field.key]}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      borderColor="gray.300"
                      bg="gray.50"
                      color="black"
                      focusBorderColor="#fa7602"
                      _focus={{
                        borderColor: "#fa7602",
                      }}
                    >
                      {field.options.map((opt) => (
                        <option
                          style={{ background: "white" }}
                          key={opt}
                          value={opt}
                        >
                          {opt}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <Input
                      placeholder={field.label}
                      type={field.type || "text"}
                      value={formData[field.key]}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      borderColor="gray.300"
                      bg="gray.50"
                      color="black"
                      focusBorderColor="#fa7602"
                      _placeholder={{ color: "gray.400" }}
                      _focus={{
                        borderColor: "#fa7602",
                        boxShadow: "0 0 0 1px #fa7602",
                      }}
                    />
                  )}
                  <FormErrorMessage>
                    {typeof errors[field.key] === "string"
                      ? errors[field.key]
                      : "यह फ़ील्ड आवश्यक है"}
                  </FormErrorMessage>
                </FormControl>
              </GridItem>
            ))}
          </Grid>

          <Box w="100%" mt="60px" textAlign="center">
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
              {isLoading ? (
                <Spinner size="md" color="#fa7602" />
              ) : (
                "रजिस्टर करें"
              )}
            </Button>
          </Box>
          <Text mt={8} textAlign={"center"} fontSize="md" color="gray.600">
            Already a user?{" "}
            <Link
              as={NextLink}
              href="/login"
              color="orange.400"
              fontWeight="medium"
              _hover={{ textDecoration: "underline", color: "orange.500" }}
            >
              Login
            </Link>
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
