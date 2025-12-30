"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  VStack,
  HStack,
  PinInput,
  PinInputField,
  Alert,
  AlertIcon,
  Link,
} from "@chakra-ui/react";
import NextLink from "next/link";
import styles from "./page.module.css";

const Page = () => {
  const [step, setStep] = useState(1); // 1 = email, 2 = otp
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }
      setStep(2);
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      setSuccess("Password reset successfully 🎉");
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className={styles.page}>
      <Box
        maxW="420px"
        w="100%"
        bg="white"
        p={8}
        borderRadius="xl"
        boxShadow="lg"
      >
        <VStack spacing={5}>
          <Heading size="md">Reset Password</Heading>

          {success && (
            <Alert status="success" borderRadius="md">
              <AlertIcon />
              {success}
            </Alert>
          )}

          {/* STEP 1: EMAIL */}
          {step === 1 && (
            <form onSubmit={sendOtp} style={{ width: "100%" }}>
              <VStack spacing={4}>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Enter your registered email to receive OTP
                </Text>

                <FormControl isRequired>
                  <FormLabel>Email address</FormLabel>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>

                <Button
                  type="submit"
                  bg="#fa7602"
                  color="white"
                  w="100%"
                  isLoading={loading}
                  _hover={{ bg: "#e85f00" }}
                >
                  Send OTP
                </Button>
              </VStack>
            </form>
          )}

          {/* STEP 2: OTP + PASSWORD */}
          {step === 2 && !success && (
            <form onSubmit={resetPassword} style={{ width: "100%" }}>
              <VStack spacing={4}>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Enter OTP sent to <b>{email}</b>
                </Text>

                <HStack justify="center">
                  <PinInput otp onChange={(value) => setOtp(value)}>
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                  </PinInput>
                </HStack>

                <FormControl isRequired>
                  <FormLabel>New Password</FormLabel>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormControl>

                <Button
                  type="submit"
                  bg="#fa7602"
                  color="white"
                  w="100%"
                  isLoading={loading}
                  _hover={{ bg: "#e85f00" }}
                >
                  Reset Password
                </Button>

                <Button
                  variant="link"
                  color="#fa7602"
                  onClick={() => setStep(1)}
                >
                  Change email
                </Button>
              </VStack>
            </form>
          )}

          <Text fontSize="sm">
            Back to{" "}
            <Link as={NextLink} href="/login" color="#fa7602">
              Login
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default Page;
