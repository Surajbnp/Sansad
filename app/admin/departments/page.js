"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import {
  Box,
  Button,
  Flex,
  Text,
  Skeleton,
  VStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useDisclosure,
  Spinner,
  HStack,
  PinInput,
  PinInputField,
  ModalCloseButton,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { AddIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useAuth } from "@/context/AuthContext";

const OTP_TIME = 60;

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // form fields
  const [newDepName, setNewDepName] = useState("");
  const [assignedName, setAssignedName] = useState("");
  const [assignedEmail, setAssignedEmail] = useState("");
  const [assignedPassword, setAssignedPassword] = useState("");
  const [assignedContact, setAssignedContact] = useState("");

  // ui states
  const [showPassword, setShowPassword] = useState(false);
  const [progressText, setProgressText] = useState("");

  // validation
  const [errors, setErrors] = useState({});

  // otp flow
  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState(1); // 1=form, 2=otp
  const [submitting, setSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const toast = useToast();
  const { accessToken } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  /* ================= TIMER ================= */
  useEffect(() => {
    if (resendTimer === 0) return;
    const t = setInterval(() => {
      setResendTimer((s) => s - 1);
    }, 1000);
    return () => clearInterval(t);
  }, [resendTimer]);

  /* ================= VALIDATION ================= */
  const validateForm = () => {
    const e = {};
    if (!newDepName.trim()) e.newDepName = "Department name is required";
    if (!assignedName.trim()) e.assignedName = "Staff name is required";
    if (
      !assignedEmail.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(assignedEmail)
    )
      e.assignedEmail = "Valid email required";
    if (!assignedPassword || assignedPassword.length < 6)
      e.assignedPassword = "Min 6 characters required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================= FETCH ================= */
  const fetchDepartments = async () => {
    try {
      const res = await fetch("/api/departments/get", {
        headers: { authorization: accessToken },
      });
      const data = await res.json();
      if (data.success) setDepartments(data.departments);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  /* ================= SEND OTP ================= */
  const sendOtp = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const res = await fetch("/api/departments/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: assignedEmail,
          mailHeading: "Department Account Verification",
          mailSubject: "Verify Department Email",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setOtpStep(2);
      setResendTimer(OTP_TIME);
      toast({ title: "OTP sent successfully", status: "success" });
    } catch (err) {
      toast({ title: err.message, status: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= VERIFY OTP + AUTO CREATE ================= */
  const verifyOtp = async () => {
    if (otp.length !== 6) {
      toast({ title: "Enter valid OTP", status: "warning" });
      return;
    }

    try {
      setSubmitting(true);
      setProgressText("Verifying OTP...");

      const res = await fetch("/api/departments/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: assignedEmail, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setResendTimer(0);
      setProgressText("Creating department...");

      await handleCreate();
    } catch (err) {
      toast({ title: err.message, status: "error" });
      setProgressText("");
    }
  };

  /* ================= CREATE ================= */
  const handleCreate = async () => {
    try {
      const res = await fetch("/api/departments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: accessToken,
        },
        body: JSON.stringify({
          name: newDepName,
          assignedName,
          assignedEmail,
          assignedPassword,
          assignedContact,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast({ title: "Department created", status: "success" });
      onClose();
      fetchDepartments();

      // reset
      setOtpStep(1);
      setOtp("");
      setResendTimer(0);
      setProgressText("");
    } catch (err) {
      toast({ title: err.message, status: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= BACK ================= */
  const goBack = () => {
    setOtpStep(1);
    setOtp("");
    setResendTimer(0);
  };

  console.log(departments);

  return (
    <Box className={styles.container} px={4} py={8}>
      <Flex justify="space-between" mb={6}>
        <Text fontSize="2xl" fontWeight="bold">
          Departments
        </Text>
        <Button leftIcon={<AddIcon />} onClick={onOpen}>
          Create
        </Button>
      </Flex>

      {loading ? (
        <Skeleton height="60px" />
      ) : (
        <VStack spacing={4} align="stretch">
          {departments.map((dep) => (
            <Box
              key={dep._id}
              p={4}
              borderRadius="md"
              boxShadow="rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em"
              bg="white"
            >
              <Flex justify="space-between" align="start" gap={4}>
                {/* LEFT INFO */}
                <Box>
                  <Text
                    fontSize="lg"
                    fontWeight="600"
                    textTransform="capitalize"
                  >
                    {dep.name}
                  </Text>

                  <Text fontSize="sm" color="gray.500">
                    Slug: <b>{dep.slug}</b>
                  </Text>

                  <Box mt={2}>
                    <Text fontWeight={600} fontSize="sm" textTransform={'capitalize'}>
                      <b>Assigned Staff:</b>{" "}
                      {dep.assignedUser?.name || "Not assigned"}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {dep.assignedUser?.email}
                    </Text>
                  </Box>

                  <Box mt={2}>
                    <Text fontSize="xs" color="gray.500">
                      Created by: {dep.createdBy?.name}
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                      {new Date(dep.createdAt).toLocaleString()}
                    </Text>
                  </Box>
                </Box>

                {/* RIGHT ACTIONS */}
                <Flex direction="column" gap={2}>
                  {/* FUTURE: reassign staff */}
                  <Button size="sm" variant="outline" colorScheme="orange">
                   Reassign
                  </Button>
                </Flex>
              </Flex>
            </Box>
          ))}
        </VStack>
      )}

      {/* ================= MODAL ================= */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Department</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {otpStep === 1 && (
              <>
                <FormControl isInvalid={errors.newDepName} mb={3}>
                  <FormLabel>
                    Department Name{" "}
                    <Text as="span" color="red">
                      *
                    </Text>
                  </FormLabel>
                  <Input
                    value={newDepName}
                    onChange={(e) => setNewDepName(e.target.value)}
                  />
                  <FormErrorMessage>{errors.newDepName}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.assignedName} mb={3}>
                  <FormLabel>
                    Staff Name{" "}
                    <Text as="span" color="red">
                      *
                    </Text>
                  </FormLabel>
                  <Input
                    value={assignedName}
                    onChange={(e) => setAssignedName(e.target.value)}
                  />
                  <FormErrorMessage>{errors.assignedName}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.assignedEmail} mb={3}>
                  <FormLabel>
                    Staff Email{" "}
                    <Text as="span" color="red">
                      *
                    </Text>
                  </FormLabel>
                  <Input
                    type="email"
                    value={assignedEmail}
                    onChange={(e) => setAssignedEmail(e.target.value)}
                  />
                  <FormErrorMessage>{errors.assignedEmail}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.assignedPassword} mb={3}>
                  <FormLabel>
                    Password{" "}
                    <Text as="span" color="red">
                      *
                    </Text>
                  </FormLabel>

                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={assignedPassword}
                      onChange={(e) => setAssignedPassword(e.target.value)}
                    />
                    <InputRightElement>
                      <IconButton
                        size="sm"
                        variant="ghost"
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Toggle password"
                      />
                    </InputRightElement>
                  </InputGroup>

                  <FormErrorMessage>{errors.assignedPassword}</FormErrorMessage>
                </FormControl>
              </>
            )}

            {otpStep === 2 && (
              <>
                <Text mb={3} textAlign="center">
                  Enter OTP sent to <b>{assignedEmail}</b>
                </Text>

                <HStack justify="center" mb={4}>
                  <PinInput otp onChange={setOtp}>
                    {[...Array(6)].map((_, i) => (
                      <PinInputField key={i} />
                    ))}
                  </PinInput>
                </HStack>

                <Flex justify="space-between">
                  <Button variant="ghost" onClick={goBack}>
                    Back
                  </Button>
                  <Button
                    variant="link"
                    colorScheme="purple"
                    isDisabled={resendTimer > 0}
                    onClick={sendOtp}
                  >
                    {resendTimer > 0
                      ? `Resend OTP in ${resendTimer}s`
                      : "Resend OTP"}
                  </Button>
                </Flex>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            {otpStep === 1 && (
              <Button
                w="100%"
                colorScheme="purple"
                onClick={sendOtp}
                isLoading={submitting}
              >
                Verify Email & Proceed
              </Button>
            )}

            {otpStep === 2 && (
              <Button
                w="100%"
                colorScheme="purple"
                onClick={verifyOtp}
                isLoading={submitting}
              >
                {progressText || "Verify OTP"}
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DepartmentsPage;
