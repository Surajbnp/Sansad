"use client";

import {
  Box,
  Button,
  Input,
  Text,
  FormControl,
  FormErrorMessage,
  useToast,
  Link,
  HStack,
  VStack,
  InputGroup,
  InputLeftAddon,
  PinInput,
  PinInputField,
  Flex,
  Divider,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { MdPhone } from "react-icons/md";
import styles from "./login.module.css";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import NextLink from "next/link";
import { useTitle } from "@/hooks/useTitle";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const toast = useToast();
  const router = useRouter();
  const { login } = useAuth();
  useTitle("Login");

  /* ── resend countdown ── */
  useEffect(() => {
    if (resendTimer === 0) return;
    const t = setInterval(() => setResendTimer((n) => n - 1), 1000);
    return () => clearInterval(t);
  }, [resendTimer]);

  /* ── STEP 1: send OTP ── */
  const sendOtp = async () => {
    if (!/^\d{10}$/.test(phone)) {
      setPhoneError("कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें");
      return;
    }
    setPhoneError("");
    setIsSending(true);
    try {
      const res = await fetch("/api/login/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setOtpSent(true);
      setResendTimer(60);
      toast({ title: "OTP भेजा गया", status: "success", duration: 3000 });
    } catch (err) {
      toast({
        title: err.message || "OTP भेजने में असफल",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsSending(false);
    }
  };

  /* ── resend OTP ── */
  const resendOtp = async () => {
    setOtp("");
    setIsSending(true);
    try {
      const res = await fetch("/api/login/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setResendTimer(60);
      toast({ title: "OTP पुनः भेजा गया", status: "info", duration: 3000 });
    } catch (err) {
      toast({
        title: err.message || "OTP पुनः भेजने में असफल",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsSending(false);
    }
  };

  /* ── STEP 2: verify OTP + login ── */
  const verifyOtp = async () => {
    if (otp.length !== 6) {
      toast({
        title: "कृपया 6 अंकों का OTP दर्ज करें",
        status: "error",
        duration: 3000,
      });
      return;
    }
    setIsVerifying(true);
    try {
      const res = await fetch("/api/login/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      await login(); // fetch user into context — cookie already set by backend
      toast({ title: "लॉगिन सफल!", status: "success", duration: 3000 });
      router.push("/profile");
    } catch (err) {
      setOtp("");
      toast({
        title: err.message || "OTP सत्यापन विफल",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      {/* ── HERO BANNER ── */}
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
        <Text
          color="white"
          fontWeight="800"
          fontSize={{ base: "28px", md: "38px" }}
          letterSpacing="3px"
          textTransform="uppercase"
          zIndex={1}
        >
          Login
        </Text>
      </Box>

      {/* ── WAVE DIVIDER ── */}
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

      {/* ── FORM CARD ── */}
      <Flex
        flex={1}
        align="center"
        justify="center"
        px={4}
        py={{ base: 6, md: 10 }}
        bg="#f5f5f0"
      >
        <Box
          bg="white"
          borderRadius="2xl"
          p={{ base: "28px", md: "48px" }}
          w="100%"
          maxW="480px"
          border="1px solid rgba(0,0,0,0.06)"
          boxShadow="0 4px 24px rgba(0,0,0,0.07)"
        >
          <Text
            fontSize={{ base: "20px", md: "24px" }}
            fontWeight="700"
            color="gray.800"
            mb={1}
          >
            अपने अकाउंट में लॉगिन करें
          </Text>
          <Text fontSize="sm" color="gray.500" mb={8}>
            अपना मोबाइल नंबर दर्ज करें, OTP से सत्यापित करें
          </Text>

          <VStack spacing={5} align="stretch">
            {/* ── PHONE INPUT ── */}
            <FormControl isInvalid={!!phoneError}>
              <Text mb={1.5} fontWeight="600" color="gray.700" fontSize="sm">
                मोबाइल नंबर
              </Text>
              <InputGroup>
                <InputLeftAddon
                  children="+91"
                  bg="gray.100"
                  border="1px solid"
                  borderColor="gray.200"
                  h="50px"
                  borderRadius="lg 0 0 lg"
                  fontSize="sm"
                  color="gray.600"
                />
                <Input
                  type="tel"
                  maxLength={10}
                  placeholder="10 अंकों का नंबर"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/\D/g, ""));
                    setPhoneError("");
                  }}
                  isDisabled={otpSent}
                  h="50px"
                  borderRadius="0 lg lg 0"
                  borderColor="gray.200"
                  bg="gray.50"
                  fontSize="sm"
                  focusBorderColor="#fa7602"
                  _placeholder={{ color: "gray.400" }}
                  _disabled={{ opacity: 0.7, cursor: "not-allowed" }}
                />
              </InputGroup>
              <FormErrorMessage fontSize="xs">{phoneError}</FormErrorMessage>
            </FormControl>

            {/* ── SEND OTP BUTTON (before OTP sent) ── */}
            {!otpSent && (
              <Button
                onClick={sendOtp}
                bg="#fa7602"
                color="white"
                w="100%"
                h="52px"
                fontSize="16px"
                fontWeight="700"
                borderRadius="lg"
                boxShadow="0 4px 16px rgba(250,118,2,0.35)"
                isLoading={isSending}
                loadingText="भेज रहे हैं..."
                _hover={{ bg: "#e56a00", transform: "translateY(-1px)" }}
                _active={{ bg: "#d46200", transform: "translateY(0)" }}
                transition="all 0.2s"
              >
                OTP भेजें →
              </Button>
            )}

            {/* ── OTP INPUT (after OTP sent) ── */}
            {otpSent && (
              <>
                {/* info box */}
                <Box
                  bg="orange.50"
                  border="1px solid"
                  borderColor="orange.200"
                  borderRadius="xl"
                  px={4}
                  py={3}
                  textAlign="center"
                >
                  <Text fontSize="sm" color="gray.600">
                    OTP भेजा गया है{" "}
                    <Text as="span" fontWeight="700" color="gray.800">
                      +91 {phone}
                    </Text>{" "}
                    पर
                  </Text>
                </Box>

                <Text fontSize="sm" color="gray.500" textAlign="center">
                  6 अंकों का OTP दर्ज करें
                </Text>

                {/* pin input */}
                <HStack justify="center">
                  <PinInput otp size="lg" value={otp} onChange={setOtp}>
                    {[...Array(6)].map((_, i) => (
                      <PinInputField
                        key={i}
                        fontSize="xl"
                        fontWeight="bold"
                        borderColor="gray.300"
                        _focus={{
                          borderColor: "#fa7602",
                          boxShadow: "0 0 0 1px #fa7602",
                        }}
                      />
                    ))}
                  </PinInput>
                </HStack>

                {/* verify button */}
                <Button
                  onClick={verifyOtp}
                  bg="#fa7602"
                  color="white"
                  w="100%"
                  h="52px"
                  fontSize="16px"
                  fontWeight="700"
                  borderRadius="lg"
                  boxShadow="0 4px 16px rgba(250,118,2,0.35)"
                  isLoading={isVerifying}
                  loadingText="सत्यापित कर रहे हैं..."
                  _hover={{ bg: "#e56a00", transform: "translateY(-1px)" }}
                  _active={{ bg: "#d46200" }}
                  transition="all 0.2s"
                >
                  OTP सत्यापित करें ✓
                </Button>

                {/* resend + change number */}
                <Flex justify="space-between" align="center">
                  <Button
                    variant="link"
                    fontSize="sm"
                    color={resendTimer > 0 ? "gray.400" : "orange.500"}
                    isDisabled={resendTimer > 0 || isSending}
                    onClick={resendOtp}
                  >
                    {resendTimer > 0
                      ? `OTP पुनः भेजें (${resendTimer}s)`
                      : "OTP पुनः भेजें"}
                  </Button>

                  <Button
                    variant="link"
                    fontSize="sm"
                    color="gray.400"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                      setResendTimer(0);
                    }}
                  >
                    नंबर बदलें
                  </Button>
                </Flex>
              </>
            )}
          </VStack>

          {/* ── SIGNUP LINK ── */}
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
    </Box>
  );
}
