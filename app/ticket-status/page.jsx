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
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  SlideFade,
  Fade,
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
        body: JSON.stringify({ email, ticketId }),
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
    <Box
      className={styles.page}
      minH="80vh"
      px={{ base: 3, md: 0 }}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        maxW="480px"
        w="100%"
        bg="white"
        p={{ base: 5, md: 7 }}
        borderRadius="xl"
        boxShadow={{
          base: "none",
          md: "rgba(67, 71, 85, 0.2) 0px 4px 16px",
        }}
        overflow="hidden"
      >
        <VStack spacing={5} align="stretch">
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
            <SlideFade in offsetY="20px">
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
            </SlideFade>
          )}

          {/* ================= STEP 2 ================= */}
          {step === 2 && (
            <SlideFade in offsetY="20px">
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
            </SlideFade>
          )}

          {/* ================= STEP 3 ================= */}
          {step === 3 && ticket && (
            <Fade in>
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontSize="sm" fontWeight="600">
                    Ticket ID: {ticket._id}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Last updated: {new Date(ticket.updatedAt).toLocaleString()}
                  </Text>
                </Box>

                <Divider />

                <SlideFade in offsetY="16px">
                  <Box bg="gray.50" borderRadius="lg" p={4}>
                    <Stepper
                      index={activeStep}
                      orientation="vertical"
                      gap={5}
                      size="sm"
                      colorScheme="green"
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

                          <Box flex="1" minW={0} ml={3}>
                            <StepTitle
                              fontSize="sm"
                              fontWeight={index === activeStep ? "600" : "500"}
                              noOfLines={2}
                            >
                              {item.status}
                            </StepTitle>

                            {item.remarks && (
                              <StepDescription
                                fontSize="xs"
                                color="gray.600"
                                noOfLines={3}
                              >
                                {item.remarks}
                              </StepDescription>
                            )}
                          </Box>

                          <StepSeparator />
                        </Step>
                      ))}
                    </Stepper>
                  </Box>
                </SlideFade>
              </VStack>
            </Fade>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default Page;
