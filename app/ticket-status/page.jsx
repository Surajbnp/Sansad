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
  Badge,
  Divider,
} from "@chakra-ui/react";
import styles from "./page.module.css";

const Page = () => {
  const [step, setStep] = useState(1); // 1=form, 2=otp, 3=status
  const [ticketId, setTicketId] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState(null);

  /* STEP 1: SEND OTP */
  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/ticket/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId, email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setStep(2);
    } catch (err) {
      alert(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* STEP 2: VERIFY OTP + FETCH STATUS */
  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId, email, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setTicket(data.ticket);
      setStep(3);
    } catch (err) {
      alert(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className={styles.page}>
      <Box
        maxW="460px"
        w="100%"
        bg="white"
        p={8}
        borderRadius="xl"
        boxShadow="lg"
      >
        <VStack spacing={5}>
          <Text fontSize="22px" fontWeight="600">Ticket Status Tracking</Text>

          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={sendOtp} style={{ width: "100%" }}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Ticket ID</FormLabel>
                  <Input
                    placeholder="TICKET-12345"
                    value={ticketId}
                    onChange={(e) => setTicketId(e.target.value)}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
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
                  Get OTP
                </Button>
              </VStack>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={verifyOtp} style={{ width: "100%" }}>
              <VStack spacing={4}>
                <Text fontSize="sm" color="gray.600">
                  OTP sent to <b>{email}</b>
                </Text>

                <HStack justify="center">
                  <PinInput otp onChange={setOtp}>
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                  </PinInput>
                </HStack>

                <Button
                  type="submit"
                  bg="#fa7602"
                  color="white"
                  w="100%"
                  isLoading={loading}
                  _hover={{ bg: "#e85f00" }}
                >
                  Verify & View Status
                </Button>
              </VStack>
            </form>
          )}

          {/* STEP 3 */}
          {step === 3 && ticket && (
            <VStack spacing={4} w="100%">
              <Alert status="success" borderRadius="md">
                <AlertIcon />
                Ticket verified successfully
              </Alert>

              <Divider />

              <Text>
                <b>Ticket ID:</b> {ticket.id}
              </Text>

              <Badge
                colorScheme={
                  ticket.status === "open"
                    ? "yellow"
                    : ticket.status === "resolved"
                    ? "green"
                    : "blue"
                }
                fontSize="md"
              >
                {ticket.status.toUpperCase()}
              </Badge>

              <Text fontSize="sm" color="gray.600" textAlign="center">
                Last updated: {ticket.updatedAt}
              </Text>
            </VStack>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default Page;
