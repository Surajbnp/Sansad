"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Text,
  Button,
  Skeleton,
  Flex,
  HStack,
  VStack,
  SimpleGrid,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  FormControl,
  FormLabel,
  useDisclosure,
  PinInput,
  PinInputField,
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css";
import { useTitle } from "@/hooks/useTitle";
import { RiProgress6Line } from "react-icons/ri";
import { IoMdAddCircleOutline } from "react-icons/io";
import {
  MdOutlineConfirmationNumber,
  MdOutlineCheckCircle,
  MdOutlineBusinessCenter,
  MdOutlineAssignment,
  MdPhone,
  MdLocationOn,
  MdBadge,
  MdAccountCircle,
  MdLogout,
  MdArrowForwardIos,
  MdArrowBack,
} from "react-icons/md";
import { CheckCircleIcon, EditIcon } from "@chakra-ui/icons";

/* ─────────────────────────────────────────
   STAT CARD
───────────────────────────────────────── */
const StatCard = ({ title, value, subText, onClick, delay = 0, icon }) => (
  <Box
    bg="white"
    borderRadius="12px"
    p={4}
    border="1px solid"
    borderColor="gray.100"
    boxShadow="0 1px 4px rgba(0,0,0,0.05)"
    cursor="pointer"
    transition="all 0.2s ease"
    style={{ animationDelay: `${delay}ms` }}
    className={styles.cardIn}
    _hover={{
      boxShadow: "0 4px 16px rgba(250,118,2,0.1)",
      borderColor: "#fa7602",
      bg: "#fffcf9",
    }}
    onClick={onClick}
  >
    <Flex align="center" justify="space-between" mb={3}>
      <Box
        w="34px"
        h="34px"
        borderRadius="9px"
        bg="#fff3e0"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="#fa7602"
        fontSize="16px"
      >
        {icon}
      </Box>
      <Box as={MdArrowForwardIos} fontSize="11px" color="gray.300" />
    </Flex>
    <Text fontSize="22px" fontWeight="700" color="gray.800" lineHeight="1">
      {value}
    </Text>
    <Text
      fontSize="11px"
      fontWeight="500"
      color="gray.400"
      mt="4px"
      letterSpacing="0.02em"
    >
      {title}
    </Text>
    {subText && (
      <Text fontSize="10px" color="gray.300" mt="2px">
        {subText}
      </Text>
    )}
  </Box>
);

/* ─────────────────────────────────────────
   INFO ROW
───────────────────────────────────────── */
const InfoRow = ({ icon, label, value }) => (
  <HStack spacing={3} py={2}>
    <Box color="#fa7602" fontSize="15px" flexShrink={0}>
      {icon}
    </Box>
    <Box>
      <Text
        fontSize="10px"
        color="gray.400"
        fontWeight="600"
        letterSpacing="0.06em"
        textTransform="uppercase"
      >
        {label}
      </Text>
      <Text fontSize="13px" color="gray.700" fontWeight="500">
        {value || "—"}
      </Text>
    </Box>
  </HStack>
);

/* ─────────────────────────────────────────
   ROLE BADGE CONFIG
───────────────────────────────────────── */
const ROLE_META = {
  Admin: { bg: "#fff3e0", color: "#e65100", dot: "#fa7602" },
  Department: { bg: "#e8f5e9", color: "#2e7d32", dot: "#43a047" },
  User: { bg: "#e3f2fd", color: "#1565c0", dot: "#1976d2" },
};

/* ─────────────────────────────────────────
   DIFF ROW
───────────────────────────────────────── */
const DiffRow = ({ label, oldVal, newVal }) => (
  <HStack
    spacing={2}
    py="6px"
    borderBottom="0.5px solid"
    borderColor="gray.100"
    fontSize="12px"
    _last={{ borderBottom: "none" }}
  >
    <Text
      w="64px"
      flexShrink={0}
      color="gray.400"
      textTransform="uppercase"
      fontSize="10px"
      fontWeight="600"
      letterSpacing="0.05em"
    >
      {label}
    </Text>
    <Text color="gray.400" textDecoration="line-through" noOfLines={1}>
      {oldVal}
    </Text>
    <Text color="gray.400" fontSize="10px">
      →
    </Text>
    <Text color="gray.700" fontWeight="500" noOfLines={1}>
      {newVal}
    </Text>
  </HStack>
);

/* ─────────────────────────────────────────
   OTP INPUT BOX (reusable)
───────────────────────────────────────── */
const OtpBox = ({ value, onChange, error, countdown, canResend, onResend }) => (
  <Box>
    <Text
      fontSize="11px"
      fontWeight="600"
      color="gray.400"
      letterSpacing="0.06em"
      textTransform="uppercase"
      mb={2}
    >
      Enter 6-digit OTP
    </Text>
    <HStack spacing={2} justify="center">
      <PinInput
        otp
        size="md"
        value={value}
        onChange={(v) => onChange(v)}
        focusBorderColor="#fa7602"
        isInvalid={!!error}
      >
        {[...Array(6)].map((_, i) => (
          <PinInputField
            key={i}
            h="46px"
            w="46px"
            borderRadius="8px"
            fontSize="16px"
            fontWeight="600"
            borderColor="gray.200"
            _focus={{
              borderColor: "#fa7602",
              boxShadow: "0 0 0 1px #fa7602",
            }}
          />
        ))}
      </PinInput>
    </HStack>
    {error && (
      <Text fontSize="12px" color="red.500" mt={2} textAlign="center">
        {error}
      </Text>
    )}
    <Text fontSize="12px" color="gray.400" textAlign="center" mt={3}>
      {canResend ? (
        <Box
          as="span"
          color="#fa7602"
          cursor="pointer"
          fontWeight="500"
          onClick={onResend}
        >
          Resend OTP
        </Box>
      ) : (
        <>
          Resend in <strong>{countdown}s</strong>
        </>
      )}
    </Text>
  </Box>
);

/* ─────────────────────────────────────────
   EDIT PROFILE MODAL
   steps: "form" → "verify-phone" (if phone changed) → "otp" → "success"
───────────────────────────────────────── */
const EditProfileModal = ({ isOpen, onClose, user, onSaved }) => {
  const toast = useToast();

  // form state
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [address, setAddress] = useState(user?.address ?? "");

  // phone verification state
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneOtpError, setPhoneOtpError] = useState("");
  const [phoneSessionId, setPhoneSessionId] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);
  const [sendingPhoneOtp, setSendingPhoneOtp] = useState(false);
  const [phoneCountdown, setPhoneCountdown] = useState(30);
  const [phoneCanResend, setPhoneCanResend] = useState(false);

  // submit otp state
  const [submitOtp, setSubmitOtp] = useState("");
  const [submitOtpError, setSubmitOtpError] = useState("");
  const [submitSessionId, setSubmitSessionId] = useState("");
  const [verifyingSubmit, setVerifyingSubmit] = useState(false);
  const [sendingSubmitOtp, setSendingSubmitOtp] = useState(false);
  const [submitCountdown, setSubmitCountdown] = useState(30);
  const [submitCanResend, setSubmitCanResend] = useState(false);

  // modal step: "form" | "verify-phone" | "otp" | "success"
  const [step, setStep] = useState("form");

  const phoneTimerRef = useRef(null);
  const submitTimerRef = useRef(null);
  const autoCloseTimerRef = useRef(null);

  // ── original values for diff tracking ──
  const original = {
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    address: user?.address ?? "",
  };

  const changed = {};
  if (name !== original.name) changed.name = name;
  if (phone !== original.phone) changed.phone = phone;
  if (address !== original.address) changed.address = address;

  const hasChanges = Object.keys(changed).length > 0;
  const isPhoneChanging = phone !== original.phone;

  // phone is fully entered and unverified → block save
  const phoneBlocksSave =
    isPhoneChanging && !phoneVerified && phone.length === 10;
  // phone is partially entered → block save too
  const phoneIncomplete = isPhoneChanging && phone.length < 10;

  // ── reset when modal opens ──
  useEffect(() => {
    if (isOpen) {
      setName(user?.name ?? "");
      setPhone(user?.phone ?? "");
      setAddress(user?.address ?? "");
      setStep("form");
      setPhoneOtp("");
      setPhoneOtpError("");
      setPhoneSessionId("");
      setPhoneVerified(false);
      setSubmitOtp("");
      setSubmitOtpError("");
      setSubmitSessionId("");
      clearInterval(phoneTimerRef.current);
      clearInterval(submitTimerRef.current);
      clearTimeout(autoCloseTimerRef.current);
    }
  }, [isOpen, user]);

  useEffect(
    () => () => {
      clearInterval(phoneTimerRef.current);
      clearInterval(submitTimerRef.current);
      clearTimeout(autoCloseTimerRef.current);
    },
    [],
  );

  // ── generic countdown starter ──
  const startCountdown = (setCountdown, setCanResend, timerRef) => {
    setCanResend(false);
    setCountdown(30);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  // ─────────────────────────────────────────
  //  STEP 2a — SEND OTP TO NEW PHONE
  // ─────────────────────────────────────────
  const handleSendPhoneOtp = async () => {
    setSendingPhoneOtp(true);
    try {
      const res = await fetch("/api/user/edit/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "new-phone", phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? "Failed to send OTP");
      setPhoneSessionId(data.sessionId);
      setStep("verify-phone");
      startCountdown(setPhoneCountdown, setPhoneCanResend, phoneTimerRef);
    } catch (err) {
      toast({
        title: err.message || "Failed to send OTP",
        status: "error",
        duration: 3000,
      });
    } finally {
      setSendingPhoneOtp(false);
    }
  };

  const handleResendPhoneOtp = async () => {
    try {
      const res = await fetch("/api/user/edit/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "new-phone", phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? "Failed");
      setPhoneSessionId(data.sessionId);
      startCountdown(setPhoneCountdown, setPhoneCanResend, phoneTimerRef);
      toast({ title: "OTP resent", status: "info", duration: 2000 });
    } catch (err) {
      toast({
        title: err.message || "Failed to resend",
        status: "error",
        duration: 3000,
      });
    }
  };

  // ─────────────────────────────────────────
  //  STEP 2a — VERIFY NEW PHONE OTP
  // ─────────────────────────────────────────
  const handleVerifyNewPhone = async () => {
    setVerifyingPhone(true);
    setPhoneOtpError("");
    try {
      const res = await fetch("/api/user/verify/new-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          otp: phoneOtp,
          phone,
          sessionId: phoneSessionId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPhoneOtpError(data?.message ?? "Incorrect OTP. Please try again.");
        return;
      }
      clearInterval(phoneTimerRef.current);
      setPhoneVerified(true);
      setStep("form"); // return to form with phone locked + verified badge
    } catch {
      setPhoneOtpError("Verification failed. Please try again.");
    } finally {
      setVerifyingPhone(false);
    }
  };

  // ─────────────────────────────────────────
  //  STEP 2b — SEND OTP TO CURRENT PHONE (submit)
  // ─────────────────────────────────────────
  const handleSendSubmitOtp = async () => {
    setSendingSubmitOtp(true);
    try {
      const res = await fetch("/api/user/edit/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "submit" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? "Failed to send OTP");
      setSubmitSessionId(data.sessionId);
      setStep("otp");
      startCountdown(setSubmitCountdown, setSubmitCanResend, submitTimerRef);
    } catch (err) {
      toast({
        title: err.message || "Failed to send OTP",
        status: "error",
        duration: 3000,
      });
    } finally {
      setSendingSubmitOtp(false);
    }
  };

  const handleResendSubmitOtp = async () => {
    try {
      const res = await fetch("/api/user/edit/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "submit" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? "Failed");
      setSubmitSessionId(data.sessionId);
      startCountdown(setSubmitCountdown, setSubmitCanResend, submitTimerRef);
      toast({ title: "OTP resent", status: "info", duration: 2000 });
    } catch (err) {
      toast({
        title: err.message || "Failed to resend",
        status: "error",
        duration: 3000,
      });
    }
  };

  // ─────────────────────────────────────────
  //  STEP 2b — VERIFY OTP + SAVE
  // ─────────────────────────────────────────
  const handleVerifyAndSave = async () => {
    setVerifyingSubmit(true);
    setSubmitOtpError("");
    try {
      const res = await fetch("/api/user/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          otp: submitOtp,
          sessionId: submitSessionId,
          changes: changed,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitOtpError(data?.message ?? "Incorrect OTP. Please try again.");
        return;
      }
      clearInterval(submitTimerRef.current);
      setStep("success");
      onSaved?.({ ...user, ...changed });
      autoCloseTimerRef.current = setTimeout(() => {
        handleClose();
      }, 3000);
    } catch {
      setSubmitOtpError("Verification failed. Please try again.");
    } finally {
      setVerifyingSubmit(false);
    }
  };

  // ── back navigation ──
  const handleBack = () => {
    if (step === "verify-phone") {
      clearInterval(phoneTimerRef.current);
      setPhoneOtp("");
      setPhoneOtpError("");
      setStep("form");
    } else if (step === "otp") {
      clearInterval(submitTimerRef.current);
      setSubmitOtp("");
      setSubmitOtpError("");
      setStep("form");
    }
  };

  const handleClose = () => {
    clearInterval(phoneTimerRef.current);
    clearInterval(submitTimerRef.current);
    clearTimeout(autoCloseTimerRef.current);
    onClose();
  };

  // ── masked phone helpers ──
  const maskedCurrentPhone = String(user?.phone ?? "").slice(0, 5) + "XXXXX";
  const maskedNewPhone = String(phone).slice(0, 5) + "XXXXX";

  // ── header copy per step ──
  const headerMeta = {
    form: {
      title: "Edit profile",
      sub: "Update your name, phone or address",
    },
    "verify-phone": {
      title: "Verify new number",
      sub: `OTP sent to +91 ${maskedNewPhone}`,
    },
    otp: {
      title: "Confirm changes",
      sub: `OTP sent to +91 ${maskedCurrentPhone}`,
    },
    success: {
      title: "All done!",
      sub: "Your profile has been updated",
    },
  };

  const { title: hTitle, sub: hSub } = headerMeta[step] ?? headerMeta.form;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      isCentered
      size="sm"
      motionPreset="slideInBottom"
      closeOnOverlayClick={false}
      closeOnEsc={step !== "success"}
    >
      <ModalOverlay bg="blackAlpha.500" backdropFilter="blur(2px)" />
      <ModalContent
        borderRadius="14px"
        border="1px solid"
        borderColor="gray.100"
        boxShadow="0 8px 32px rgba(0,0,0,0.12)"
        overflow="hidden"
      >
        {/* ── HEADER ── */}
        <ModalHeader
          px={6}
          pt={5}
          pb={4}
          borderBottom="1px solid"
          borderColor="gray.50"
        >
          <HStack spacing={3}>
            {(step === "verify-phone" || step === "otp") && (
              <Box
                as={MdArrowBack}
                fontSize="18px"
                color="gray.400"
                cursor="pointer"
                onClick={handleBack}
                _hover={{ color: "gray.600" }}
              />
            )}
            <Box>
              <Text fontSize="15px" fontWeight="700" color="gray.800">
                {hTitle}
              </Text>
              <Text fontSize="11px" color="gray.400" fontWeight="400" mt="1px">
                {hSub}
              </Text>
            </Box>
          </HStack>
          <ModalCloseButton top={4} right={4} borderRadius="8px" />
        </ModalHeader>

        {/* ── BODY ── */}
        <ModalBody px={6} py={5}>
          {/* ══ STEP: form ══ */}
          {step === "form" && (
            <VStack spacing={4} align="stretch">
              {/* changed banner */}
              {hasChanges && (
                <HStack
                  spacing={2}
                  bg="#fff9f5"
                  border="1px solid"
                  borderColor="#ffd199"
                  borderRadius="8px"
                  px={3}
                  py="7px"
                >
                  <Box
                    w="6px"
                    h="6px"
                    borderRadius="full"
                    bg="#fa7602"
                    flexShrink={0}
                  />
                  <Text fontSize="12px" color="#c45a00" fontWeight="500">
                    {Object.keys(changed).length} field
                    {Object.keys(changed).length > 1 ? "s" : ""} changed
                    {isPhoneChanging && !phoneVerified
                      ? " — verify new phone first"
                      : " — OTP required to save"}
                  </Text>
                </HStack>
              )}

              {/* Name */}
              <FormControl>
                <FormLabel
                  fontSize="11px"
                  fontWeight="600"
                  color="gray.400"
                  letterSpacing="0.06em"
                  textTransform="uppercase"
                  mb={1}
                >
                  Full name
                </FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  fontSize="13px"
                  h="38px"
                  borderRadius="8px"
                  borderColor={name !== original.name ? "#fa7602" : "gray.200"}
                  bg={name !== original.name ? "#fff9f5" : "white"}
                  _focus={{
                    borderColor: "#fa7602",
                    boxShadow: "0 0 0 1px #fa7602",
                  }}
                />
              </FormControl>

              {/* Phone */}
              <FormControl>
                <FormLabel
                  fontSize="11px"
                  fontWeight="600"
                  color="gray.400"
                  letterSpacing="0.06em"
                  textTransform="uppercase"
                  mb={1}
                >
                  Phone number
                </FormLabel>
                <Box position="relative">
                  <Input
                    value={phone}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setPhone(v);
                      // un-verify if user edits back to original
                      if (v === original.phone) setPhoneVerified(false);
                    }}
                    isDisabled={phoneVerified}
                    placeholder="10-digit mobile number"
                    fontSize="13px"
                    h="38px"
                    borderRadius="8px"
                    pr={phoneVerified ? "100px" : "3"}
                    borderColor={
                      phoneVerified
                        ? "green.400"
                        : phone !== original.phone
                          ? "#fa7602"
                          : "gray.200"
                    }
                    bg={
                      phoneVerified
                        ? "green.50"
                        : phone !== original.phone
                          ? "#fff9f5"
                          : "white"
                    }
                    _focus={{
                      borderColor: phoneVerified ? "green.400" : "#fa7602",
                      boxShadow: `0 0 0 1px ${
                        phoneVerified ? "#48BB78" : "#fa7602"
                      }`,
                    }}
                  />
                  {/* Verified badge inside input */}
                  {phoneVerified && (
                    <HStack
                      position="absolute"
                      right="10px"
                      top="50%"
                      transform="translateY(-50%)"
                      spacing={1}
                      pointerEvents="none"
                    >
                      <MdOutlineCheckCircle color="#38A169" size={14} />
                      <Text fontSize="11px" color="green.500" fontWeight="600">
                        Verified
                      </Text>
                    </HStack>
                  )}
                </Box>

                {/* Inline "Verify new number" button */}
                {isPhoneChanging && !phoneVerified && phone.length === 10 && (
                  <Button
                    mt={2}
                    size="xs"
                    variant="outline"
                    borderColor="#fa7602"
                    color="#fa7602"
                    borderRadius="6px"
                    fontWeight="500"
                    fontSize="11px"
                    isLoading={sendingPhoneOtp}
                    loadingText="Sending…"
                    _hover={{ bg: "#fff3e0" }}
                    onClick={handleSendPhoneOtp}
                  >
                    Verify new number
                  </Button>
                )}

                {isPhoneChanging && !phoneVerified && phone.length === 10 && (
                  <Text fontSize="11px" color="orange.400" mt="4px">
                    New number must be verified before saving
                  </Text>
                )}
              </FormControl>

              {/* Address */}
              <FormControl>
                <FormLabel
                  fontSize="11px"
                  fontWeight="600"
                  color="gray.400"
                  letterSpacing="0.06em"
                  textTransform="uppercase"
                  mb={1}
                >
                  Address
                </FormLabel>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Your address"
                  fontSize="13px"
                  h="38px"
                  borderRadius="8px"
                  borderColor={
                    address !== original.address ? "#fa7602" : "gray.200"
                  }
                  bg={address !== original.address ? "#fff9f5" : "white"}
                  _focus={{
                    borderColor: "#fa7602",
                    boxShadow: "0 0 0 1px #fa7602",
                  }}
                />
              </FormControl>
            </VStack>
          )}

          {/* ══ STEP: verify-phone ══ */}
          {step === "verify-phone" && (
            <VStack spacing={4} align="stretch">
              <Box
                bg="orange.50"
                border="1px solid"
                borderColor="orange.100"
                borderRadius="8px"
                px={3}
                py={2}
              >
                <Text fontSize="12px" color="orange.700">
                  Enter the OTP sent to your <strong>new number</strong> +91{" "}
                  {maskedNewPhone}
                </Text>
              </Box>
              <OtpBox
                value={phoneOtp}
                onChange={(v) => {
                  setPhoneOtp(v);
                  setPhoneOtpError("");
                }}
                error={phoneOtpError}
                countdown={phoneCountdown}
                canResend={phoneCanResend}
                onResend={handleResendPhoneOtp}
              />
            </VStack>
          )}

          {/* ══ STEP: otp (submit verification) ══ */}
          {step === "otp" && (
            <VStack spacing={4} align="stretch">
              {/* diff preview */}
              <Box bg="gray.50" borderRadius="8px" px={3} py={2}>
                {changed.name && (
                  <DiffRow
                    label="Name"
                    oldVal={original.name}
                    newVal={changed.name}
                  />
                )}
                {changed.phone && (
                  <DiffRow
                    label="Phone"
                    oldVal={original.phone}
                    newVal={changed.phone}
                  />
                )}
                {changed.address && (
                  <DiffRow
                    label="Address"
                    oldVal={original.address}
                    newVal={changed.address}
                  />
                )}
              </Box>
              <OtpBox
                value={submitOtp}
                onChange={(v) => {
                  setSubmitOtp(v);
                  setSubmitOtpError("");
                }}
                error={submitOtpError}
                countdown={submitCountdown}
                canResend={submitCanResend}
                onResend={handleResendSubmitOtp}
              />
            </VStack>
          )}

          {/* ══ STEP: success ══ */}
          {step === "success" && (
            <VStack spacing={0} py={2} align="center">
              {/* animated SVG checkmark */}
              <Box
                w="80px"
                h="80px"
                mb={4}
                sx={{
                  "@keyframes scaleIn": {
                    "0%": { transform: "scale(0)", opacity: 0 },
                    "60%": { transform: "scale(1.15)", opacity: 1 },
                    "100%": { transform: "scale(1)", opacity: 1 },
                  },
                  "@keyframes drawCheck": {
                    "0%": { strokeDashoffset: 50 },
                    "100%": { strokeDashoffset: 0 },
                  },
                  animation:
                    "scaleIn 0.45s cubic-bezier(0.175,0.885,0.32,1.275) forwards",
                }}
              >
                <svg
                  viewBox="0 0 80 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="40"
                    cy="40"
                    r="38"
                    fill="#f0fdf4"
                    stroke="#22c55e"
                    strokeWidth="2"
                  />
                  <path
                    d="M24 41l11 11 21-22"
                    stroke="#22c55e"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="50"
                    strokeDashoffset="50"
                    style={{
                      animation: "drawCheck 0.4s ease 0.35s forwards",
                    }}
                  />
                </svg>
              </Box>

              <Text fontSize="15px" fontWeight="700" color="gray.800" mb={1}>
                Profile updated!
              </Text>
              <Text fontSize="12px" color="gray.400" textAlign="center" mb={5}>
                Your changes have been saved and verified.
              </Text>

              {/* closing countdown bar */}
              <Box
                w="100%"
                bg="gray.100"
                borderRadius="full"
                h="3px"
                overflow="hidden"
              >
                <Box
                  h="3px"
                  bg="#22c55e"
                  borderRadius="full"
                  sx={{
                    "@keyframes shrink": {
                      "0%": { width: "100%" },
                      "100%": { width: "0%" },
                    },
                    animation: "shrink 3s linear forwards",
                  }}
                />
              </Box>
              <Text fontSize="10px" color="gray.300" mt="6px">
                Closing automatically…
              </Text>
            </VStack>
          )}
        </ModalBody>

        {/* ── FOOTER: form ── */}
        {step === "form" && (
          <ModalFooter
            px={6}
            pb={5}
            pt={4}
            borderTop="1px solid"
            borderColor="gray.50"
            gap={2}
          >
            <Button
              variant="ghost"
              size="sm"
              color="gray.400"
              borderRadius="8px"
              fontWeight="500"
              fontSize="13px"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              bg="#fa7602"
              color="white"
              borderRadius="8px"
              fontWeight="500"
              fontSize="13px"
              px={5}
              _hover={{ bg: "#e06800" }}
              isDisabled={!hasChanges || phoneBlocksSave || phoneIncomplete}
              isLoading={sendingSubmitOtp}
              loadingText="Sending…"
              onClick={handleSendSubmitOtp}
            >
              Send OTP &amp; Save
            </Button>
          </ModalFooter>
        )}

        {/* ── FOOTER: verify-phone ── */}
        {step === "verify-phone" && (
          <ModalFooter
            px={6}
            pb={5}
            pt={4}
            borderTop="1px solid"
            borderColor="gray.50"
            gap={2}
          >
            <Button
              variant="ghost"
              size="sm"
              color="gray.400"
              borderRadius="8px"
              fontWeight="500"
              fontSize="13px"
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              size="sm"
              bg="#fa7602"
              color="white"
              borderRadius="8px"
              fontWeight="500"
              fontSize="13px"
              px={5}
              _hover={{ bg: "#e06800" }}
              isDisabled={phoneOtp.length < 6}
              isLoading={verifyingPhone}
              loadingText="Verifying…"
              onClick={handleVerifyNewPhone}
            >
              Verify number
            </Button>
          </ModalFooter>
        )}

        {/* ── FOOTER: otp ── */}
        {step === "otp" && (
          <ModalFooter
            px={6}
            pb={5}
            pt={4}
            borderTop="1px solid"
            borderColor="gray.50"
            gap={2}
          >
            <Button
              variant="ghost"
              size="sm"
              color="gray.400"
              borderRadius="8px"
              fontWeight="500"
              fontSize="13px"
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              size="sm"
              bg="#fa7602"
              color="white"
              borderRadius="8px"
              fontWeight="500"
              fontSize="13px"
              px={5}
              _hover={{ bg: "#e06800" }}
              isDisabled={submitOtp.length < 6}
              isLoading={verifyingSubmit}
              loadingText="Verifying…"
              onClick={handleVerifyAndSave}
            >
              Verify &amp; save
            </Button>
          </ModalFooter>
        )}

        {/* ── FOOTER: success ── */}
        {step === "success" && (
          <ModalFooter px={6} pb={5} pt={0} justifyContent="center">
            <Button
              size="sm"
              variant="ghost"
              color="gray.400"
              borderRadius="8px"
              fontWeight="500"
              fontSize="12px"
              onClick={handleClose}
            >
              Close now
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
const Page = () => {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  useTitle("Profile | सांसद सुविधा केंद्र – सतना-मैहर");

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [localUser, setLocalUser] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (!user) return;

    setStatsLoading(true);
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/user/stats");
        const data = await res.json();
        if (res.ok) setStats(data);
      } catch (err) {
        console.error("Stats fetch error:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  console.log(user)

  // optimistic UI: use localUser after save, fall back to context user
  const displayUser = localUser ?? user;
  const isLoading = loading || statsLoading;
  const badge = ROLE_META[displayUser?.role] ?? ROLE_META.User;

  return (
    <Box minH="100vh" bg="#f7f7f5" pt={8} px={{ base: 4, md: 8 }} pb={16}>
      <Box maxW="960px" mx="auto">
        {isLoading ? (
          <VStack spacing={4}>
            <Skeleton height="140px" borderRadius="14px" w="100%" />
            <SimpleGrid
              columns={{ base: 1, sm: 2, md: 4 }}
              spacing={3}
              w="100%"
            >
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} height="110px" borderRadius="12px" />
              ))}
            </SimpleGrid>
          </VStack>
        ) : (
          <>
            {/* ── PROFILE CARD ── */}
            <Box
              bg="white"
              borderRadius="14px"
              border="1px solid"
              borderColor="gray.100"
              boxShadow="0 1px 6px rgba(0,0,0,0.05)"
              overflow="hidden"
              mb={5}
            >
              <Flex
                direction={{ base: "column", sm: "row" }}
                align={{ base: "flex-start", sm: "center" }}
                justify="space-between"
                px={{ base: 5, md: 7 }}
                py={5}
                gap={4}
              >
                <HStack spacing={4}>
                  <Box position="relative">
                    <Avatar
                      size="lg"
                      name={displayUser?.name}
                      bg="#fa7602"
                      color="white"
                      fontWeight="700"
                      fontSize="lg"
                    />
                    <Box
                      position="absolute"
                      bottom="1px"
                      right="1px"
                      w="11px"
                      h="11px"
                      bg="green.400"
                      borderRadius="full"
                      border="2px solid white"
                    />
                  </Box>

                  <Box>
                    <HStack spacing={2}>
                      <Text fontSize="16px" fontWeight="700" color="gray.800">
                        {displayUser?.name}
                      </Text>
                      <Box
                        as={EditIcon}
                        fontSize="13px"
                        color="gray.500"
                        cursor="pointer"
                        transition="color 0.15s"
                        _hover={{ color: "#fa7602" }}
                        onClick={onOpen}
                      />
                    </HStack>
                    <HStack spacing={2} mt="5px">
                      <Box w="6px" h="6px" borderRadius="full" bg={badge.dot} />
                      <Text
                        fontSize="11px"
                        fontWeight="600"
                        color={badge.color}
                        letterSpacing="0.05em"
                      >
                        {displayUser?.role}
                      </Text>
                    </HStack>
                  </Box>
                </HStack>

                <Button
                  size="sm"
                  variant="ghost"
                  color="gray.400"
                  borderRadius="8px"
                  fontWeight="500"
                  fontSize="13px"
                  leftIcon={<MdLogout />}
                  _hover={{ bg: "red.50", color: "red.500" }}
                  transition="all 0.15s"
                  onClick={logout}
                >
                  Logout
                </Button>
              </Flex>

              {/* info rows */}
              <Box px={{ base: 5, md: 7 }} py={4}>
                <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={0}>
                  <InfoRow
                    icon={<MdPhone />}
                    label="Phone"
                    value={
                      displayUser?.phone ? `+91 ${displayUser.phone}` : null
                    }
                  />
                  <InfoRow
                    icon={<MdLocationOn />}
                    label="Vidhan Sabha"
                    value={displayUser?.vidhansabha}
                  />
                  <InfoRow
                    icon={<MdAccountCircle />}
                    label="Address"
                    value={displayUser?.address}
                  />
                  {displayUser?.voterId && (
                    <InfoRow
                      icon={<MdBadge />}
                      label="Voter ID"
                      value={displayUser?.voterId}
                    />
                  )}
                </SimpleGrid>
              </Box>
            </Box>

            {/* ── SECTION LABEL ── */}
            <Text
              fontSize="11px"
              fontWeight="600"
              color="gray.400"
              letterSpacing="0.1em"
              textTransform="uppercase"
              mb={3}
            >
              Overview
            </Text>

            {/* ── STAT CARDS ── */}
            <SimpleGrid columns={{ base: 2, sm: 2, md: 4 }} spacing={3}>
              {displayUser?.role === "Admin" && (
                <>
                  <StatCard
                    delay={0}
                    title="Total Tickets"
                    value={stats?.totalTickets ?? 0}
                    subText="All complaints"
                    onClick={() => router.push("/tickets?state=all")}
                    icon={<MdOutlineConfirmationNumber />}
                  />
                  <StatCard
                    delay={50}
                    title="New"
                    value={stats?.stats?.submitted ?? 0}
                    subText="Awaiting triage"
                    onClick={() => router.push("/tickets?state=submitted")}
                    icon={<IoMdAddCircleOutline />}
                  />
                  <StatCard
                    delay={100}
                    title="In Progress"
                    value={stats?.stats?.inProgress ?? 0}
                    subText="Needs action"
                    onClick={() => router.push("/tickets?state=inProgress")}
                    icon={<RiProgress6Line />}
                  />
                  <StatCard
                    delay={150}
                    title="Resolved"
                    value={stats?.stats?.completed ?? 0}
                    subText="Closed & resolved"
                    onClick={() => router.push("/tickets?state=completed")}
                    icon={<MdOutlineCheckCircle />}
                  />
                  <StatCard
                    delay={200}
                    title="Departments"
                    value={stats?.departmentCount ?? 0}
                    subText="Active departments"
                    onClick={() => router.push("/admin/departments")}
                    icon={<MdOutlineBusinessCenter />}
                  />
                </>
              )}

              {displayUser?.role === "Department" && (
                <>
                  <StatCard
                    delay={0}
                    title="Total Tickets"
                    value={stats?.totalTickets ?? 0}
                    onClick={() => router.push("/tickets")}
                    icon={<MdOutlineConfirmationNumber />}
                  />
                  <StatCard
                    delay={50}
                    title="Assigned"
                    value={stats?.stats?.assigned ?? 0}
                    onClick={() => router.push("/tickets?state=assigned")}
                    icon={<MdOutlineAssignment />}
                  />
                  <StatCard
                    delay={100}
                    title="In Progress"
                    value={stats?.stats?.inProgress ?? 0}
                    onClick={() => router.push("/tickets?state=inProgress")}
                    icon={<RiProgress6Line />}
                  />
                  <StatCard
                    delay={150}
                    title="Completed"
                    value={stats?.stats?.completed ?? 0}
                    onClick={() => router.push("/tickets?state=completed")}
                    icon={<MdOutlineCheckCircle />}
                  />
                </>
              )}

              {displayUser?.role === "User" && (
                <>
                  <StatCard
                    delay={0}
                    title="Tickets Created"
                    value={stats?.totalTickets ?? 0}
                    subText="Your issues"
                    onClick={() => router.push("/tickets")}
                    icon={<MdOutlineConfirmationNumber />}
                  />
                  <StatCard
                    delay={50}
                    title="In Progress"
                    value={stats?.stats?.inProgress ?? 0}
                    subText="Being resolved"
                    onClick={() => router.push("/tickets?state=inProgress")}
                    icon={<RiProgress6Line />}
                  />
                  <StatCard
                    delay={100}
                    title="Completed"
                    value={stats?.stats?.completed ?? 0}
                    subText="Resolved"
                    onClick={() => router.push("/tickets?state=completed")}
                    icon={<MdOutlineCheckCircle />}
                  />
                  <StatCard
                    delay={150}
                    title="New Ticket"
                    value="+"
                    subText="Raise an issue"
                    onClick={() => router.push("/create-ticket")}
                    icon={<IoMdAddCircleOutline />}
                  />
                </>
              )}
            </SimpleGrid>

            {/* ── FOOTER DECORATION ── */}
            <Box mt={16}>
              <Divider borderColor="gray.100" />
              <Box
                w="100%"
                h={{ base: "20vh", md: "30vh" }}
                className={styles.icons}
                backgroundSize={{ base: "100%", md: "600px" }}
                borderRadius="md"
                overflow="hidden"
              />
            </Box>
          </>
        )}
      </Box>

      {/* ── EDIT PROFILE MODAL ── */}
      <EditProfileModal
        isOpen={isOpen}
        onClose={onClose}
        user={displayUser}
        onSaved={(updatedUser) => setLocalUser(updatedUser)}
      />
    </Box>
  );
};

export default Page;
