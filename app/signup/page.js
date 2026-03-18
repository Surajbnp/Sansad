"use client";

import {
  Box,
  Button,
  Grid,
  GridItem,
  Input,
  Text,
  FormControl,
  FormErrorMessage,
  useToast,
  Select,
  VStack,
  HStack,
  PinInput,
  PinInputField,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { Link } from "@chakra-ui/react";
import NextLink from "next/link";

const initialState = {
  name: "",
  address: "",
  sex: "",
  voterId: "",
  aadhar: "",
  phone: "",
  vidhansabha: "",
};

export default function Home() {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState("form"); // form | otp
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (step !== "otp" || resendTimer === 0) return;
    const timer = setInterval(() => {
      setResendTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendTimer, step]);

  const fields = [
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
    { key: "voterId", label: "वोटर आईडी (Voter ID)", required: false },
    { key: "aadhar", label: "आधार संख्या (Aadhar Number)", required: true },
    {
      key: "phone",
      label: "मोबाइल नंबर (Mobile Number)",
      required: true,
      type: "phone",
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
      if (field.required && !value) newErrors[field.key] = true;
      if (field.key === "aadhar" && value && !/^\d{12}$/.test(value))
        newErrors[field.key] = "आधार संख्या 12 अंकों की होनी चाहिए";
      if (field.key === "phone" && value && !/^\d{10}$/.test(value))
        newErrors[field.key] = "मोबाइल नंबर 10 अंकों का होना चाहिए";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      toast({ title: "कृपया सभी आवश्यक फ़ील्ड भरें", status: "error" });
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/signup/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setResendTimer(60);
      setStep("otp");
    } catch (err) {
      toast({ title: err.message || "OTP भेजने में असफल", status: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.phone }),
      });
      setResendTimer(60);
      toast({ title: "OTP पुनः भेजा गया", status: "info" });
    } catch {
      toast({ title: "OTP पुनः भेजने में असफल", status: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtpAndSignup = async () => {
    if (!otp || otp.length !== 6) {
      toast({ title: "कृपया 6 अंकों का OTP दर्ज करें", status: "error" });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/signup/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, otp }),
      });
      const data = await res.json();

      if (res.status === 409) {
        toast({ title: data.message, status: "warning" });
        router.push("/login");
        return;
      }

      if (!res.ok) throw new Error(data.message);
      
      toast({ title: "सफलतापूर्वक रजिस्टर किया गया!", status: "success" });
      router.push("/profile");
    } catch (err) {
      setOtp("");
      toast({ title: err.message || "OTP सत्यापन विफल", status: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const StepIndicator = () => (
    <HStack justify="center" spacing={3} mb={8}>
      {["विवरण भरें", "OTP सत्यापन"].map((label, i) => {
        const isActive =
          (i === 0 && step === "form") || (i === 1 && step === "otp");
        const isDone = i === 0 && step === "otp";
        return (
          <HStack key={i} spacing={2}>
            <Box
              w="28px"
              h="28px"
              borderRadius="full"
              bg={isDone ? "green.400" : isActive ? "#fa7602" : "gray.200"}
              color="white"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="sm"
              fontWeight="bold"
              transition="all 0.3s"
            >
              {isDone ? "✓" : i + 1}
            </Box>
            <Text
              fontSize="sm"
              fontWeight={isActive ? "600" : "400"}
              color={isActive ? "#fa7602" : isDone ? "green.500" : "gray.400"}
            >
              {label}
            </Text>
            {i < 1 && (
              <Box
                w="32px"
                h="2px"
                bg={step === "otp" ? "green.400" : "gray.200"}
                borderRadius="full"
                transition="all 0.3s"
              />
            )}
          </HStack>
        );
      })}
    </HStack>
  );

  return (
    <Box className={styles.page}>
      <Box className={styles.form} p={{ base: "20px", md: "80px" }} py="40px">
        <Box maxW="900px" p={4}>
          <Text textAlign="center" fontSize="2xl" fontWeight="bold" mb={4}>
            रजिस्ट्रेशन फॉर्म (Registration Form)
          </Text>

          <StepIndicator />

          {/* FORM STEP */}
          {step === "form" && (
            <>
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={8}>
                {fields.map((field) => (
                  <GridItem key={field.key}>
                    <FormControl isInvalid={!!errors[field.key]}>
                      <Text mb={1}>
                        {field.label}
                        {field.required && (
                          <Text as="span" color="red.500">
                            {" "}
                            *
                          </Text>
                        )}
                      </Text>

                      {field.type === "select" ? (
                        <Select
                          placeholder="Select option"
                          value={formData[field.key]}
                          onChange={(e) =>
                            handleChange(field.key, e.target.value)
                          }
                        >
                          {field.options.map((opt) => (
                            <option key={opt}>{opt}</option>
                          ))}
                        </Select>
                      ) : field.type === "phone" ? (
                        <InputGroup>
                          <InputLeftAddon children="+91" bg="gray.100" />
                          <Input
                            placeholder="10 अंकों का नंबर"
                            type="tel"
                            maxLength={10}
                            value={formData[field.key]}
                            onChange={(e) =>
                              handleChange(
                                field.key,
                                e.target.value.replace(/\D/g, ""),
                              )
                            }
                          />
                        </InputGroup>
                      ) : (
                        <Input
                          placeholder={field.label}
                          type={field.type || "text"}
                          value={formData[field.key]}
                          onChange={(e) =>
                            handleChange(field.key, e.target.value)
                          }
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

              <Box mt="60px" textAlign="center">
                <Button
                  onClick={handleSubmit}
                  bg="#fa7602"
                  color="white"
                  fontWeight="bold"
                  px={10}
                  py={6}
                  fontSize="lg"
                  isLoading={isLoading}
                  loadingText="भेज रहे हैं..."
                  _hover={{ bg: "#e06800" }}
                  borderRadius="xl"
                >
                  OTP भेजें →
                </Button>
              </Box>

              <Text mt={6} textAlign="center" fontSize="sm" color="gray.500">
                पहले से रजिस्टर हैं?{" "}
                <Link
                  as={NextLink}
                  href="/login"
                  color="orange.400"
                  fontWeight="600"
                >
                  Login करें
                </Link>
              </Text>
            </>
          )}

          {/* OTP STEP */}
          {step === "otp" && (
            <VStack spacing={6} mt={4}>
              <Box
                bg="orange.50"
                border="1px solid"
                borderColor="orange.200"
                borderRadius="xl"
                px={6}
                py={4}
                textAlign="center"
              >
                <Text fontSize="sm" color="gray.600">
                  OTP भेजा गया है{" "}
                  <Text as="span" fontWeight="700" color="gray.800">
                    +91 {formData.phone}
                  </Text>{" "}
                  पर
                </Text>
              </Box>

              <Text fontSize="sm" color="gray.500">
                6 अंकों का OTP दर्ज करें
              </Text>

              <HStack justify="center">
                <PinInput otp size="lg" onChange={setOtp} value={otp}>
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

              <Button
                bg="#fa7602"
                color="white"
                isLoading={isLoading}
                loadingText="सत्यापित कर रहे हैं..."
                onClick={verifyOtpAndSignup}
                px={10}
                py={6}
                fontSize="md"
                fontWeight="bold"
                borderRadius="xl"
                _hover={{ bg: "#e06800" }}
              >
                OTP सत्यापित करें ✓
              </Button>

              <Button
                variant="link"
                color={resendTimer > 0 ? "gray.400" : "orange.500"}
                isDisabled={resendTimer > 0}
                onClick={resendOtp}
                fontSize="sm"
              >
                {resendTimer > 0
                  ? `OTP पुनः भेजें (${resendTimer}s में)`
                  : "OTP पुनः भेजें"}
              </Button>

              <Button
                variant="ghost"
                colorScheme="gray"
                size="sm"
                onClick={() => {
                  setStep("form");
                  setOtp("");
                }}
              >
                ← वापस जाएँ (विवरण बदलें)
              </Button>
            </VStack>
          )}
        </Box>
      </Box>
    </Box>
  );
}
