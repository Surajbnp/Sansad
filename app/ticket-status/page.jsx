"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  HStack,
  PinInput,
  PinInputField,
  Alert,
  AlertIcon,
  Divider,
  Flex,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
} from "@chakra-ui/react";
import styles from "./page.module.css";

const Page = () => {
  const [step, setStep] = useState(1);
  const [ticketId, setTicketId] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const mailHeading = "Ticket Status OTP";
  const mailSubject = "Your Ticket Status OTP";

  /* ================= OTP TIMER ================= */
  useEffect(() => {
    if (step !== 2 || resendTimer === 0) return;

    const timer = setInterval(() => {
      setResendTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer, step]);

  /* ================= SEND OTP ================= */
  const sendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          ticketId,
          mailHeading,
          mailSubject,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setResendTimer(60);
      setStep(2);
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY OTP ================= */
  const verifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/ticket/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId, email, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setTicket(data.ticket);
      setResendTimer(0);
      setStep(3);
    } catch (err) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const steps = ticket?.statusHistory || [];
  const activeStep = steps.length - 1;

  return (
    <Box className={styles.page} px={{ base: 3, md: 0 }} minH={{base : "60vh", md : "80vh"}}>
      <Box
        maxW="460px"
        w="100%"
        bg="white"
        p={{ base: 5, md: 8 }}
        borderRadius="xl"
        boxShadow={{
          base: "none",
          md: "rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em",
        }}
      >
        <VStack spacing={5} align="stretch" pb={4}>
          <Text fontSize="22px" fontWeight="600" textAlign="center">
            Ticket Status
          </Text>

          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}

          {/* ================= STEP 1 ================= */}
          {step === 1 && (
            <form onSubmit={sendOtp}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Ticket ID</FormLabel>
                  <Input
                    value={ticketId}
                    onChange={(e) => setTicketId(e.target.value)}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
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
                >
                  Get OTP
                </Button>
              </VStack>
            </form>
          )}

          {/* ================= STEP 2 ================= */}
          {step === 2 && (
            <form onSubmit={verifyOtp}>
              <VStack spacing={4}>
                <Text fontSize="sm" textAlign="center">
                  OTP sent to <b>{email}</b>
                </Text>

                <HStack justify="center">
                  <PinInput otp onChange={setOtp}>
                    {[...Array(6)].map((_, i) => (
                      <PinInputField key={i} />
                    ))}
                  </PinInput>
                </HStack>

                <Button
                  type="submit"
                  bg="#fa7602"
                  color="white"
                  w="100%"
                  isLoading={loading}
                >
                  Verify & View Status
                </Button>

                <Button
                  variant="link"
                  colorScheme="orange"
                  isDisabled={resendTimer > 0}
                  onClick={sendOtp}
                >
                  {resendTimer > 0
                    ? `Resend OTP in ${resendTimer}s`
                    : "Resend OTP"}
                </Button>
              </VStack>
            </form>
          )}

          {/* ================= STEP 3 ================= */}
          {step === 3 && ticket && (
            <>
              <Box>
                <Text fontSize="sm">Ticket ID: {ticket._id}</Text>
                <Text fontSize="xs" color="gray.500" textAlign="start">
                  Last updated: {new Date(ticket.updatedAt).toLocaleString()}
                </Text>
              </Box>

              <Divider />

              {/* ===== CHAKRA STEPPER ===== */}
              {steps.length > 0 && (
                <Stepper
                  size="md"
                  index={activeStep}
                  orientation="vertical"
                  colorScheme="green"
                  height={"150px"}
                >
                  {steps.map((item, index) => (
                    <Step key={item._id}>
                      <StepIndicator>
                        <StepStatus
                          complete={<StepIcon />}
                          incomplete={<StepNumber />}
                          active={<StepNumber />}
                        />
                      </StepIndicator>

                      <Box flexShrink="0" textAlign="start">
                        <StepTitle fontSize="xs">{item.status}</StepTitle>

                        {index === activeStep && (
                          <StepDescription fontSize="xs" color="gray.500">
                            {item.remarks}
                          </StepDescription>
                        )}
                      </Box>

                      <StepSeparator />
                    </Step>
                  ))}
                </Stepper>
              )}
            </>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default Page;
