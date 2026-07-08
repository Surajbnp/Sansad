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
  Badge,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useAuth } from "@/context/AuthContext";
import LOCATION_DATA from "@/data/location";

const SAFFRON = "#FA7602";
const SAFFRON_DARK = "#D96200";
const SAFFRON_LIGHT = "#FFF4EC";
const SAFFRON_MID = "#FFE0C2";

const initialState = {
  name: "",
  address: "",
  sex: "",
  voterId: "",
  aadhar: "",
  phone: "",
  district: "",
  tehsil: "",
  vidhansabha: "",
  janpad: "",
  policeStation: "",
  upTehsil: "",
};

const DISTRICT_OPTIONS = Object.keys(LOCATION_DATA);

// ✅ Helper functions - always return an array
const getTehsilOptions = (district) =>
  LOCATION_DATA[district]?.tehsils || [];

const getUpTehsilOptions = (district) =>
  LOCATION_DATA[district]?.upTehsils || [];

const getVidhansabhaOptions = (district) =>
  LOCATION_DATA[district]?.vidhansabhas || [];

const getJanpadOptions = (district) =>
  LOCATION_DATA[district]?.janpads || [];

const getPoliceStationOptions = (district) =>
  LOCATION_DATA[district]?.policeStations || [];


export default function RegistrationForm() {
  const [formData, setFormData] = useState(initialState);
  const { login } = useAuth();
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState("form");
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (step !== "otp" || resendTimer === 0) return;
    const timer = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [resendTimer, step]);

  const fields = [
    {
      key: "name",
      label: "नाम",
      sublabel: "Full Name",
      required: true,
      icon: "👤",
    },
    {
      key: "address",
      label: "वर्तमान पता",
      sublabel: "Current Address",
      required: true,
      icon: "🏠",
    },
    {
      key: "sex",
      label: "लिंग",
      sublabel: "Gender",
      required: true,
      type: "select",
      icon: "⚥",
      options: ["Male", "Female", "Other"],
    },
    {
      key: "district",
      label: "जिला",
      sublabel: "District",
      required: true,
      type: "select",
      icon: "🗺️",
      options: DISTRICT_OPTIONS,
    },
    {
      key: "tehsil",
      label: "तहसील",
      sublabel: "Tehsil",
      required: true,
      type: "select",
      icon: "🏞️",
      options: getTehsilOptions(formData.district),
    },
      {
      key: "upTehsil", // ✅ New UP Tehsil field
      label: "उप तहसील",
      sublabel: "UP Tehsil (Optional)",
      required: false,
      type: "select",
      icon: "🏘️",
      options: getUpTehsilOptions(formData.district),
    },
    {
      key: "vidhansabha",
      label: "विधान सभा",
      sublabel: "Constituency",
      required: true,
      type: "select",
      icon: "🏛️",
      options: getVidhansabhaOptions(formData.district),
    },
    {
      key: "janpad",
      label: "जनपद",
      sublabel: "Janpad",
      required: true,
      type: "select",
      icon: "🏘️",
  options: getJanpadOptions(formData.district),
    },
    {
      key: "policeStation",
      label: "थाना",
      sublabel: "Police Station",
      required: true,
      type: "select",
      icon: "👮",
    options: getPoliceStationOptions(formData.district),
    },
    {
      key: "voterId",
      label: "वोटर आईडी",
      sublabel: "Voter ID (Optional)",
      required: false,
      icon: "🗳️",
    },
    {
      key: "aadhar",
      label: "आधार संख्या",
      sublabel: "Aadhar Number",
      required: true,
      icon: "🪪",
    },
    {
      key: "phone",
      label: "मोबाइल नंबर",
      sublabel: "Mobile Number",
      required: true,
      type: "phone",
      icon: "📱",
    },
  ];
const handleChange = (key, value) => {
  setFormData((prev) => ({
    ...prev,
    [key]: value,
  }));

  setErrors((prev) => ({
    ...prev,
    [key]: false,
  }));
};

  const validate = () => {
    const newErrors = {};
    fields.forEach((field) => {
      const value = formData[field.key]?.toString().trim();
      if (field.required && !value) newErrors[field.key] = true;
      if (field.key === "aadhar" && value && !/^\d{12}$/.test(value))
        newErrors[field.key] = "12 अंकों की होनी चाहिए";
      if (field.key === "phone" && value && !/^\d{10}$/.test(value))
        newErrors[field.key] = "10 अंकों का होना चाहिए";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      toast({
        title: "कृपया सभी आवश्यक फ़ील्ड भरें",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
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
      toast({
        title: err.message || "OTP भेजने में असफल",
        status: "error",
        duration: 3000,
      });
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
      toast({ title: "OTP पुनः भेजा गया", status: "info", duration: 3000 });
    } catch {
      toast({
        title: "OTP पुनः भेजने में असफल",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtpAndSignup = async () => {
      console.log("🚀 verifyOtpAndSignup called!"); 
    if (!otp || otp.length !== 6) {
      console.log("❌ OTP validation failed:", otp);
      toast({
        title: "कृपया 6 अंकों का OTP दर्ज करें",
        status: "error",
        duration: 3000,
      });
      return;
    }
      console.log("✅ OTP is valid:", otp);

  console.log("🔍 Full formData:", JSON.stringify(formData, null, 2));
    setIsLoading(true);
    try {
        const payload = { ...formData, otp };
    console.log("📤 Sending to API:", JSON.stringify(payload, null, 2));
      const res = await fetch("/api/signup/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, otp }),
      });

      
      const data = await res.json();
      if (res.status === 409) {
        toast({ title: data.message, status: "warning", duration: 3000 });
        router.push("/login");
        return;
      }
      if (!res.ok) throw new Error(data.message);

      await login();
      router.push("/profile");

      toast({
        title: "सफलतापूर्वक रजिस्टर किया गया!",
        status: "success",
        duration: 3000,
      });
    } catch (err) {
      setOtp("");
      toast({
        title: err.message || "OTP सत्यापन विफल",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const inputStyles = (key) => ({
    border: "2px solid",
    borderColor: errors[key]
      ? "red.400"
      : focusedField === key
        ? SAFFRON
        : "#E8E0D8",
    borderRadius: "12px",
    bg: focusedField === key ? SAFFRON_LIGHT : "white",
    fontSize: { base: "14px", md: "15px" },
    height: "48px",
    px: 4,
    transition: "all 0.2s ease",
    _hover: {
      borderColor: errors[key] ? "red.400" : SAFFRON,
      bg: SAFFRON_LIGHT,
    },
    _focus: {
      borderColor: SAFFRON,
      boxShadow: `0 0 0 3px ${SAFFRON}22`,
      bg: SAFFRON_LIGHT,
      outline: "none",
    },
    _placeholder: { color: "#B8A898", fontSize: "13px" },
  });

  const selectStyles = (key) => ({
    ...inputStyles(key),
    cursor: "pointer",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');

        .reg-page {
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow-x: hidden;
        }
        .reg-page::before {
          content: '';
          position: fixed;
          top: -200px;
          right: -200px;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          pointer-events: none;
        }
        .reg-page::after {
          content: '';
          position: fixed;
          bottom: -150px;
          left: -150px;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, #13880818 0%, transparent 70%);
          pointer-events: none;
        }

        .form-card {
          overflow: hidden;
          border: 1px solid rgba(250,118,2,0.12);
        }

        .form-header {
          background: linear-gradient(135deg, #e05e00 0%, #FA7602 45%, #ff9a3c 100%);
          position: relative;
          overflow: hidden;
          padding: 32px 40px 28px;
        }
        .form-header::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px);
          background-size: 18px 18px;
        }
        .form-header::after {
          content: '🇮🇳';
          position: absolute;
          right: 32px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 72px;
          opacity: 0.08;
          pointer-events: none;
        }

        .field-label {
          font-family: 'Noto Sans Devanagari', sans-serif;
          font-weight: 600;
          font-size: 14px;
          color: #3D2B1F;
          margin-bottom: 2px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .field-sublabel {
          font-size: 11px;
          color: #A08070;
          font-weight: 400;
          margin-bottom: 8px;
          letter-spacing: 0.3px;
        }

        .step-line {
          height: 3px;
          border-radius: 3px;
          transition: all 0.4s ease;
        }

        .otp-box {
          background: linear-gradient(135deg, #FFF8F2, #FFF0E4);
          border: 1.5px solid #FFD5A8;
          border-radius: 16px;
          padding: 20px 24px;
        }

        .submit-btn {
          background: linear-gradient(135deg, #FA7602, #E06000) !important;
          border-radius: 14px !important;
          height: 54px !important;
          font-size: 16px !important;
          font-weight: 700 !important;
          letter-spacing: 0.3px;
          box-shadow: 0 4px 20px rgba(250,118,2,0.35) !important;
          transition: all 0.25s ease !important;
          width: 100%;
        }
        .submit-btn:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 28px rgba(250,118,2,0.45) !important;
        }
        .submit-btn:active { transform: translateY(0) !important; }

        .pin-field {
          border: 2px solid #E8E0D8 !important;
          border-radius: 12px !important;
          font-size: 22px !important;
          font-weight: 700 !important;
          color: #3D2B1F !important;
          background: white !important;
          transition: all 0.2s !important;
          width: 48px !important;
          height: 56px !important;
        }
        .pin-field:focus {
          border-color: #FA7602 !important;
          box-shadow: 0 0 0 3px rgba(250,118,2,0.15) !important;
          background: #FFF8F2 !important;
        }

        @media (max-width: 640px) {
          .form-header { padding: 24px 20px 20px; }
          .form-header::after { font-size: 48px; right: 16px; }
          .pin-field { width: 40px !important; height: 48px !important; font-size: 18px !important; }
        }
      `}</style>

      <div className="reg-page">
        <Box
          maxW={{ base: "100%", sm: "600px", md: "860px", lg: "920px" }}
          mx="auto"
          px={{ base: 3, sm: 4, md: 6 }}
          py={{ base: 6, md: 10 }}
        >
          <div className="form-card">
            {/* Header */}
            <div className="form-header">
              <Box position="relative" zIndex={1}>
                <HStack spacing={3} mb={2}>
                  <Badge
                    bg="rgba(255,255,255,0.2)"
                    color="white"
                    borderRadius="full"
                    px={3}
                    py={1}
                    fontSize="11px"
                    fontWeight="600"
                    letterSpacing="1.5px"
                    textTransform="uppercase"
                  >
                    सांसद सुविधा केंद्र
                  </Badge>
                </HStack>
                <Text
                  fontSize={{ base: "xl", md: "2xl" }}
                  fontWeight="800"
                  color="white"
                  fontFamily="'Noto Sans Devanagari', sans-serif"
                  lineHeight="1.3"
                >
                  रजिस्ट्रेशन फॉर्म
                </Text>
                <Text
                  fontSize={{ base: "12px", md: "13px" }}
                  color="rgba(255,255,255,0.7)"
                  mt={1}
                  fontWeight="500"
                >
                  Registration Form · Madhya Pradesh
                </Text>
              </Box>
            </div>

            {/* Step Indicator */}
            <Box px={{ base: 4, md: 8 }} pt={6} pb={2}>
              <HStack spacing={0} align="center">
                {["विवरण भरें", "OTP सत्यापन"].map((label, i) => {
                  const isActive =
                    (i === 0 && step === "form") || (i === 1 && step === "otp");
                  const isDone = i === 0 && step === "otp";
                  return (
                    <HStack
                      key={i}
                      flex={i < 1 ? 1 : "none"}
                      spacing={0}
                      align="center"
                    >
                      <HStack spacing={{ base: 2, md: 3 }}>
                        <Box
                          w={{ base: "28px", md: "32px" }}
                          h={{ base: "28px", md: "32px" }}
                          borderRadius="full"
                          bg={
                            isDone ? "#22C55E" : isActive ? SAFFRON : "#EDE8E3"
                          }
                          color={isDone || isActive ? "white" : "#A08070"}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          fontSize={{ base: "12px", md: "13px" }}
                          fontWeight="800"
                          flexShrink={0}
                          boxShadow={
                            isActive ? `0 3px 12px ${SAFFRON}44` : "none"
                          }
                          transition="all 0.3s ease"
                        >
                          {isDone ? "✓" : i + 1}
                        </Box>
                        <Text
                          fontSize={{ base: "12px", md: "13px" }}
                          fontWeight={isActive ? "700" : "500"}
                          color={
                            isActive ? SAFFRON : isDone ? "#22C55E" : "#A08070"
                          }
                          fontFamily="'Noto Sans Devanagari', sans-serif"
                          transition="all 0.3s"
                          whiteSpace="nowrap"
                        >
                          {label}
                        </Text>
                      </HStack>
                      {i < 1 && (
                        <Box
                          flex={1}
                          mx={{ base: 2, md: 4 }}
                          h="3px"
                          bg={step === "otp" ? "#22C55E" : "#EDE8E3"}
                          borderRadius="full"
                          transition="all 0.4s ease"
                          minW={{ base: "30px", md: "60px" }}
                        />
                      )}
                    </HStack>
                  );
                })}
              </HStack>
            </Box>

            <Box px={{ base: 4, md: 8 }} pb={{ base: 6, md: 8 }} pt={4}>
              {/* FORM STEP */}
              {step === "form" && (
                <>
                  <Grid
                    templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                    gap={{ base: 4, md: 6 }}
                    mt={4}
                  >
                    {fields.map((field) => (
                      <GridItem
                        key={field.key}
                        colSpan={
                          field.key === "address" ? { base: 1, md: 2 } : 1
                        }
                      >
                        <FormControl isInvalid={!!errors[field.key]}>
                          <div className="field-label">
                            <span>{field.icon}</span>
                            {field.label}
                            {field.required && (
                              <Text as="span" color="red.400" ml={0.5}>
                                *
                              </Text>
                            )}
                          </div>
                          <div className="field-sublabel">{field.sublabel}</div>

                          {field.type === "select" ? (
                        <Select
  placeholder="चुनें / Select"
  value={formData[field.key]}
  onChange={(e) => handleChange(field.key, e.target.value)}
  onFocus={() => setFocusedField(field.key)}
  onBlur={() => setFocusedField(null)}
  sx={selectStyles(field.key)}
>
  {field.options.map((opt) => (
    <option key={opt} value={opt}>
      {opt}
    </option>
  ))}
</Select>
                          ) : field.type === "phone" ? (
                            <InputGroup>
                              <InputLeftAddon
                                children="+91"
                                bg={SAFFRON_LIGHT}
                                color={SAFFRON_DARK}
                                fontWeight="700"
                                fontSize="14px"
                                border="2px solid"
                                borderColor={
                                  focusedField === field.key
                                    ? SAFFRON
                                    : "#E8E0D8"
                                }
                                borderRight="none"
                                borderRadius="12px 0 0 12px"
                                h="48px"
                                transition="all 0.2s"
                              />
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
                                onFocus={() => setFocusedField(field.key)}
                                onBlur={() => setFocusedField(null)}
                                borderRadius="0 12px 12px 0"
                                border="2px solid"
                                borderColor={
                                  errors[field.key]
                                    ? "red.400"
                                    : focusedField === field.key
                                      ? SAFFRON
                                      : "#E8E0D8"
                                }
                                borderLeft="none"
                                h="48px"
                                fontSize={{ base: "14px", md: "15px" }}
                                bg={
                                  focusedField === field.key
                                    ? SAFFRON_LIGHT
                                    : "white"
                                }
                                _focus={{
                                  boxShadow: `0 0 0 3px ${SAFFRON}22`,
                                  outline: "none",
                                  borderColor: SAFFRON,
                                }}
                                _placeholder={{
                                  color: "#B8A898",
                                  fontSize: "13px",
                                }}
                                transition="all 0.2s"
                              />
                            </InputGroup>
                          ) : (
                            <Input
                              placeholder={field.sublabel}
                              type={field.type || "text"}
                              value={formData[field.key]}
                              onChange={(e) =>
                                handleChange(field.key, e.target.value)
                              }
                              onFocus={() => setFocusedField(field.key)}
                              onBlur={() => setFocusedField(null)}
                              sx={inputStyles(field.key)}
                            />
                          )}

                          <FormErrorMessage fontSize="12px" mt={1}>
                            {typeof errors[field.key] === "string"
                              ? errors[field.key]
                              : "यह फ़ील्ड आवश्यक है"}
                          </FormErrorMessage>
                        </FormControl>
                      </GridItem>
                    ))}
                  </Grid>

                  <Box mt={8}>
                    <Button
                      className="submit-btn"
                      onClick={handleSubmit}
                      isLoading={isLoading}
                      loadingText="OTP भेज रहे हैं..."
                      rightIcon={<span style={{ fontSize: "18px" }}>→</span>}
                      color={"white"}
                    >
                      OTP भेजें
                    </Button>
                  </Box>

                  <Text
                    mt={5}
                    textAlign="center"
                    fontSize="13px"
                    color="#A08070"
                  >
                    पहले से रजिस्टर हैं?{" "}
                    <Link
                      as={NextLink}
                      href="/login"
                      color={SAFFRON}
                      fontWeight="700"
                      _hover={{ color: SAFFRON_DARK }}
                    >
                      Login करें
                    </Link>
                  </Text>
                </>
              )}

              {/* OTP STEP */}
              {step === "otp" && (
                <VStack spacing={6} mt={4} align="stretch">
                  <div className="otp-box">
                    <HStack spacing={3}>
                      <Box
                        w="40px"
                        h="40px"
                        borderRadius="full"
                        bg={SAFFRON_MID}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontSize="18px"
                        flexShrink={0}
                      >
                        📱
                      </Box>
                      <Box>
                        <Text
                          fontSize="13px"
                          color="#6B5040"
                          fontWeight="600"
                          fontFamily="'Noto Sans Devanagari', sans-serif"
                        >
                          OTP भेजा गया है
                        </Text>
                        <Text fontSize="14px" color="#3D2B1F" fontWeight="700">
                          +91 {formData.phone}
                        </Text>
                      </Box>
                    </HStack>
                  </div>

                  <VStack spacing={3} align="center">
                    <Text
                      fontSize="13px"
                      color="#A08070"
                      fontFamily="'Noto Sans Devanagari', sans-serif"
                    >
                      6 अंकों का OTP दर्ज करें
                    </Text>
                    <HStack justify="center" spacing={{ base: 2, md: 3 }}>
                      <PinInput otp size="lg" onChange={setOtp} value={otp}>
                        {[...Array(6)].map((_, i) => (
                          <PinInputField key={i} className="pin-field" />
                        ))}
                      </PinInput>
                    </HStack>
                  </VStack>

                  <Button
                    className="submit-btn"
                    isLoading={isLoading}
                    loadingText="सत्यापित कर रहे हैं..."
                    onClick={verifyOtpAndSignup}
                  >
                    OTP सत्यापित करें ✓
                  </Button>

                  <VStack spacing={2}>
                    <Button
                      variant="link"
                      color={resendTimer > 0 ? "#C0B0A0" : SAFFRON}
                      isDisabled={resendTimer > 0}
                      onClick={resendOtp}
                      fontSize="13px"
                      fontWeight="600"
                      _hover={{ color: SAFFRON_DARK, textDecoration: "none" }}
                    >
                      {resendTimer > 0
                        ? `OTP पुनः भेजें (${resendTimer}s में)`
                        : "OTP पुनः भेजें"}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      color="#A08070"
                      fontWeight="600"
                      fontSize="13px"
                      borderRadius="10px"
                      _hover={{ bg: SAFFRON_LIGHT, color: SAFFRON }}
                      onClick={() => {
                        setStep("form");
                        setOtp("");
                      }}
                    >
                      ← वापस जाएँ
                    </Button>
                  </VStack>
                </VStack>
              )}
            </Box>
          </div>
        </Box>
      </div>
    </>
  );
}