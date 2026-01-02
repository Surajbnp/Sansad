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
  Spinner,
  VStack,
  HStack,
  PinInput,
  PinInputField,
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
  email: "",
  voterId: "",
  aadhar: "",
  whatsapp: "",
  password: "",
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

  /* ================= OTP TIMER ================= */
  useEffect(() => {
    if (step !== "otp" || resendTimer === 0) return;
    const timer = setInterval(() => {
      setResendTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendTimer, step]);

  const fields = [
    { key: "email", label: "ईमेल (Email)", required: true, type: "email" },
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
    { key: "voterId", label: "वोटर आईडी (Voter ID)", required: false },
    { key: "aadhar", label: "आधार संख्या (Aadhar Number)", required: true },
    {
      key: "whatsapp",
      label: "व्हाट्सएप नंबर (WhatsApp Number)",
      required: false,
    },
  ];

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
    setErrors({ ...errors, [key]: false });
  };

  /* ================= FORM VALIDATION ================= */
  const validate = () => {
    const newErrors = {};

    fields.forEach((field) => {
      const value = formData[field.key]?.toString().trim();

      if (field.required && !value) newErrors[field.key] = true;
      if (field.key === "aadhar" && value && !/^\d{12}$/.test(value))
        newErrors[field.key] = "आधार संख्या 12 अंकों की होनी चाहिए";
      if (field.key === "whatsapp" && value && !/^\d{10}$/.test(value))
        newErrors[field.key] = "व्हाट्सएप नंबर 10 अंकों का होना चाहिए";
      if (
        field.key === "email" &&
        value &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      )
        newErrors[field.key] = "कृपया एक मान्य ईमेल दर्ज करें";
      if (field.key === "password" && value && value.length < 6)
        newErrors[field.key] = "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= STEP 1: SEND OTP ================= */
  const handleSubmit = async () => {
    if (!validate()) {
      toast({ title: "कृपया सभी आवश्यक फ़ील्ड भरें", status: "error" });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          mailHeading: "Signup OTP",
          mailSubject: "Verify your email",
        }),
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

  /* ================= RESEND OTP (NO VALIDATION) ================= */
  const resendOtp = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          mailHeading: "Signup OTP",
          mailSubject: "Verify your email",
        }),
      });
      setResendTimer(60);
    } catch {
      toast({ title: "OTP पुनः भेजने में असफल", status: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= STEP 2: VERIFY OTP & SIGNUP ================= */
  const verifyOtpAndSignup = async () => {
    if (!otp || otp.length !== 6) {
      toast({ title: "कृपया सही OTP दर्ज करें", status: "error" });
      return;
    }

    setIsLoading(true);
    try {
      const verifyRes = await fetch("/api/signup/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.message);

      const signupRes = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const signupData = await signupRes.json();
      if (!signupRes.ok) throw new Error(signupData.message);

      toast({ title: "सफलतापूर्वक रजिस्टर किया गया!", status: "success" });
      router.push("/login");
    } catch (err) {
      toast({ title: err.message || "OTP सत्यापन विफल", status: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className={styles.page}>
      <Box className={styles.form} p={{ base: "20px", md: "80px" }} py="40px">
        <Box maxW="900px" p={4}>
          {/* ================= FORM STEP ================= */}
          {step === "form" && (
            <>
              <Text textAlign="center" fontSize="2xl" fontWeight="bold" mb={8}>
                रजिस्ट्रेशन फॉर्म (Registration Form)
              </Text>

              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={8}>
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
                          onChange={(e) =>
                            handleChange(field.key, e.target.value)
                          }
                        >
                          {field.options.map((opt) => (
                            <option key={opt}>{opt}</option>
                          ))}
                        </Select>
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
                  px={8}
                  py={6}
                  fontSize="lg"
                  isLoading={isLoading}
                >
                  रजिस्टर करें
                </Button>
              </Box>

              <Text mt={8} textAlign="center" fontSize="md" color="gray.600">
                Already a user?{" "}
                <Link as={NextLink} href="/login" color="orange.400">
                  Login
                </Link>
              </Text>
            </>
          )}

          {/* ================= OTP STEP ================= */}
          {step === "otp" && (
            <VStack spacing={5}>
              <Text fontSize="lg" fontWeight="600">
                ईमेल सत्यापन (Email Verification)
              </Text>

              <Text fontSize="sm">
                OTP भेजा गया है <b>{formData.email}</b> पर
              </Text>

              <HStack justify="center">
                <PinInput otp onChange={setOtp}>
                  {[...Array(6)].map((_, i) => (
                    <PinInputField key={i} />
                  ))}
                </PinInput>
              </HStack>

              <Button
                bg="#fa7602"
                color="white"
                isLoading={isLoading}
                onClick={verifyOtpAndSignup}
              >
                OTP सत्यापित करें
              </Button>

              <Button
                variant="link"
                isDisabled={resendTimer > 0}
                onClick={resendOtp}
              >
                {resendTimer > 0
                  ? `OTP पुनः भेजें (${resendTimer}s)`
                  : "OTP पुनः भेजें"}
              </Button>

              {/* 🔙 BACK BUTTON */}
              <Button
                variant="ghost"
                colorScheme="gray"
                onClick={() => {
                  setStep("form");
                  setOtp("");
                }}
              >
                ← वापस जाएँ (Edit Details)
              </Button>
            </VStack>
          )}
        </Box>
      </Box>
    </Box>
  );
}
