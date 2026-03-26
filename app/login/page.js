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
  Badge,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import NextLink from "next/link";
import { useTitle } from "@/hooks/useTitle";
import styles from "./login.module.css";

const SAFFRON = "#FA7602";
const SAFFRON_DARK = "#D96200";
const SAFFRON_LIGHT = "#FFF4EC";
const SAFFRON_MID = "#FFE0C2";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [focusedPhone, setFocusedPhone] = useState(false);

  const toast = useToast();
  const router = useRouter();
  const { login } = useAuth();
  useTitle("Login | सांसद सुविधा केंद्र – सतना-मैहर");

  useEffect(() => {
    if (resendTimer === 0) return;
    const t = setInterval(() => setResendTimer((n) => n - 1), 1000);
    return () => clearInterval(t);
  }, [resendTimer]);

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
      await login();
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');

        .login-page {
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          position: relative;
          overflow-x: hidden;
        }
        .login-page::before {
          content: '';
          position: fixed;
          top: -200px;
          right: -200px;
          width: 600px;
          height: 600px;
          pointer-events: none;
        }
        .login-page::after {
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

        .login-card {
          overflow: hidden;
          width: 100%;
          max-width: 460px;
          border:1px solid rgba(250,118,2,0.12);
        }

        .login-header {
          background: linear-gradient(135deg, #e05e00 0%, #FA7602 45%, #ff9a3c 100%);
          position: relative;
          overflow: hidden;
          padding: 32px 36px 28px;
        }
        .login-header::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px);
          background-size: 18px 18px;
        }
        .login-header::after {
          content: '🔐';
          position: absolute;
          right: 28px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 64px;
          opacity: 0.10;
          pointer-events: none;
        }

        .login-body {
          padding: 28px 36px 32px;
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

        .submit-btn {
          background: linear-gradient(135deg, #FA7602, #E06000) !important;
          border-radius: 14px !important;
          height: 52px !important;
          font-size: 15px !important;
          font-weight: 700 !important;
          box-shadow: 0 4px 20px rgba(250,118,2,0.35) !important;
          transition: all 0.25s ease !important;
          width: 100%;
          letter-spacing: 0.2px;
        }
        .submit-btn:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 28px rgba(250,118,2,0.45) !important;
        }
        .submit-btn:active { transform: translateY(0) !important; }

        .otp-info-box {
          background: linear-gradient(135deg, #FFF8F2, #FFF0E4);
          border: 1.5px solid #FFD5A8;
          border-radius: 14px;
          padding: 16px 20px;
        }

        .pin-field {
          border: 2px solid #E8E0D8 !important;
          border-radius: 12px !important;
          font-size: 20px !important;
          font-weight: 700 !important;
          color: #3D2B1F !important;
          background: white !important;
          transition: all 0.2s !important;
          width: 46px !important;
          height: 54px !important;
        }
        .pin-field:focus {
          border-color: #FA7602 !important;
          box-shadow: 0 0 0 3px rgba(250,118,2,0.15) !important;
          background: #FFF8F2 !important;
        }

        .divider-text {
          font-size: 11px;
          color: #C0B0A0;
          white-space: nowrap;
          flex-shrink: 0;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          font-weight: 600;
        }

        @media (max-width: 480px) {
          .login-header { padding: 24px 20px 20px; }
          .login-header::after { font-size: 48px; right: 16px; }
          .login-body { padding: 20px 20px 24px; }
          .pin-field { width: 38px !important; height: 46px !important; font-size: 17px !important; }
        }
      `}</style>

      <div className={styles.pageWrapper}>

        <section className={styles.sansadBanner}>
          <img
            src="https://res.cloudinary.com/dxwwnettz/image/upload/v1773993978/Satna_SSK_MicroBanner_ciqocz.webp"
            alt="Sansad Suvidha Kendra Satna – Government Schemes Banner"
            fetchPriority="high"
            loading="eager"
          />
        </section>

        {/* ── Header ── */}
        {/* <div className="login-header">
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
                लॉगिन करें
              </Text>
              <Text
                fontSize="12px"
                color="rgba(255,255,255,0.72)"
                mt={1}
                fontWeight="500"
              >
                Login · Madhya Pradesh
              </Text>
            </Box>
          </div> */}




        {/* ── Body ── */}
        <div className={styles.formWrapper}>
          <div className={styles.loginCard}>

            <VStack spacing={5} align="stretch">
              {/* Phone Field */}
              <FormControl isInvalid={!!phoneError}>
                <div className="field-label">
                  <span>📱</span> मोबाइल नंबर
                </div>
                <div className="field-sublabel">Mobile Number</div>
                <InputGroup>
                  <InputLeftAddon
                    children="+91"
                    bg={focusedPhone ? SAFFRON_LIGHT : "white"}
                    color={SAFFRON_DARK}
                    fontWeight="700"
                    fontSize="14px"
                    border="2px solid"
                    borderColor={
                      phoneError
                        ? "red.400"
                        : focusedPhone
                          ? SAFFRON
                          : "#E8E0D8"
                    }
                    borderRight="none"
                    borderRadius="12px 0 0 12px"
                    h="48px"
                    transition="all 0.2s"
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
                    onFocus={() => setFocusedPhone(true)}
                    onBlur={() => setFocusedPhone(false)}
                    isDisabled={otpSent}
                    h="48px"
                    border="2px solid"
                    borderColor={
                      phoneError
                        ? "red.400"
                        : focusedPhone
                          ? SAFFRON
                          : "#E8E0D8"
                    }
                    borderLeft="none"
                    borderRadius="0 12px 12px 0"
                    bg={focusedPhone ? SAFFRON_LIGHT : "white"}
                    fontSize="14px"
                    _focus={{
                      boxShadow: `0 0 0 3px ${SAFFRON}22`,
                      outline: "none",
                      borderColor: SAFFRON,
                    }}
                    _placeholder={{ color: "#B8A898", fontSize: "13px" }}
                    _disabled={{
                      opacity: 0.65,
                      cursor: "not-allowed",
                      bg: "#F9F5F2",
                    }}
                    transition="all 0.2s"
                  />
                </InputGroup>
                <FormErrorMessage fontSize="12px" mt={1}>
                  {phoneError}
                </FormErrorMessage>
              </FormControl>

              {/* Send OTP Button */}
              {!otpSent && (
                <Button
                  className="submit-btn"
                  onClick={sendOtp}
                  isLoading={isSending}
                  loadingText="भेज रहे हैं..."
                  rightIcon={<span style={{ fontSize: "16px" }}>→</span>}
                  color={"white"}
                >
                  OTP भेजें
                </Button>
              )}

              {/* OTP Section */}
              {otpSent && (
                <>
                  <div className="otp-info-box">
                    <HStack spacing={3}>
                      <Box
                        w="36px"
                        h="36px"
                        borderRadius="full"
                        bg={SAFFRON_MID}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontSize="16px"
                        flexShrink={0}
                      >
                        📨
                      </Box>
                      <Box>
                        <Text
                          fontSize="12px"
                          color="#6B5040"
                          fontWeight="600"
                          fontFamily="'Noto Sans Devanagari', sans-serif"
                        >
                          OTP भेजा गया है
                        </Text>
                        <Text fontSize="14px" color="#3D2B1F" fontWeight="700">
                          +91 {phone}
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
                    <HStack justify="center" spacing={{ base: 1.5, md: 2 }}>
                      <PinInput otp size="lg" value={otp} onChange={setOtp}>
                        {[...Array(6)].map((_, i) => (
                          <PinInputField key={i} className="pin-field" />
                        ))}
                      </PinInput>
                    </HStack>
                  </VStack>

                  <Button
                    className="submit-btn"
                    onClick={verifyOtp}
                    isLoading={isVerifying}
                    loadingText="सत्यापित कर रहे हैं..."
                    color={'white'}
                  >
                    OTP सत्यापित करें ✓
                  </Button>

                  <Flex justify="space-between" align="center" pt={1}>
                    <Button
                      variant="link"
                      fontSize="12px"
                      fontWeight="600"
                      color={resendTimer > 0 ? "#C0B0A0" : SAFFRON}
                      isDisabled={resendTimer > 0 || isSending}
                      onClick={resendOtp}
                      _hover={{ color: SAFFRON_DARK, textDecoration: "none" }}
                    >
                      {resendTimer > 0
                        ? `OTP पुनः भेजें (${resendTimer}s)`
                        : "OTP पुनः भेजें"}
                    </Button>
                    <Button
                      variant="link"
                      fontSize="12px"
                      fontWeight="600"
                      color="#A08070"
                      _hover={{ color: "#3D2B1F", textDecoration: "none" }}
                      onClick={() => {
                        setOtpSent(false);
                        setOtp("");
                        setResendTimer(0);
                      }}
                    >
                      ← नंबर बदलें
                    </Button>
                  </Flex>
                </>
              )}

              {/* Divider */}
              <HStack spacing={3} my={1}>
                <Divider borderColor="#EDE8E3" />
                <span className="divider-text">नया खाता</span>
                <Divider borderColor="#EDE8E3" />
              </HStack>

              {/* Signup Link */}
              <Box
                textAlign="center"
                bg={SAFFRON_LIGHT}
                border="1.5px solid"
                borderColor="#FFD5A8"
                borderRadius="14px"
                py={3}
                px={4}
              >
                <Text
                  fontSize="13px"
                  color="#6B5040"
                  fontFamily="'Noto Sans Devanagari', sans-serif"
                >
                  पहली बार आए हैं?{" "}
                  <Link
                    as={NextLink}
                    href="/signup"
                    color={SAFFRON}
                    fontWeight="700"
                    _hover={{
                      color: SAFFRON_DARK,
                      textDecoration: "underline",
                    }}
                  >
                    Sign Up करें →
                  </Link>
                </Text>
              </Box>
            </VStack>
          </div>
        </div>

      </div>

    </>
  );
}
