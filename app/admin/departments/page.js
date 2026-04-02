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
  HStack,
  PinInput,
  PinInputField,
  ModalCloseButton,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { MdPerson, MdPhone } from "react-icons/md";
import { useAuth } from "@/context/AuthContext";

const OTP_TIME = 60;

/* ── dept card ── */
const DeptCard = ({ dep, index }) => (
  <Box
    bg="white"
    borderRadius="16px"
    border="1px solid"
    borderColor="gray.100"
    boxShadow="0 2px 8px rgba(0,0,0,0.05)"
    p={5}
    position="relative"
    overflow="hidden"
    transition="all 0.2s"
    style={{ animationDelay: `${index * 50}ms` }}
    _hover={{
      boxShadow: "0 6px 24px rgba(250,118,2,0.1)",
      borderColor: "#fa7602",
    }}
  >
    <Box position="absolute" top={0} left={0} w="100%" h="3px" bg="#fa7602" />
    <Flex justify="space-between" align="flex-start" gap={4} wrap="wrap">
      <Box flex={1}>
        <HStack mb={2} spacing={3} flexWrap="wrap">
          <Text
            fontSize="lg"
            fontWeight="800"
            color="gray.800"
            textTransform="capitalize"
          >
            {dep.name}
          </Text>
          <Box
            px={2}
            py="1px"
            borderRadius="full"
            bg="gray.100"
            fontSize="10px"
            fontWeight="700"
            color="gray.500"
            letterSpacing="0.06em"
          >
            {dep.slug}
          </Box>
        </HStack>

        <VStack align="flex-start" spacing={1}>
          <HStack spacing={2}>
            <MdPerson size={14} color="#fa7602" />
            <Text fontSize="sm" fontWeight="600" color="gray.700">
              {dep.assignedUser?.name || "Not assigned"}
            </Text>
            {dep?.designation && (
              <Box
                px={2}
                py="1px"
                borderRadius="full"
                fontSize="10px"
                fontWeight="700"
                bg="#fff3e0"
                color="#e65100"
              >
                {dep.designation}
              </Box>
            )}
          </HStack>

          {dep?.phone && (
            <HStack spacing={2}>
              <MdPhone size={14} color="#9ca3af" />
              <Text fontSize="sm" color="gray.500">
                +91 {dep.phone}
              </Text>
            </HStack>
          )}

          {dep.assignedUser?.phone && (
            <HStack spacing={2}>
              <MdPhone size={14} color="#fa7602" />
              <Text fontSize="sm" color="gray.500">
                Staff: +91 {dep.assignedUser.phone}
              </Text>
            </HStack>
          )}
        </VStack>

        <HStack mt={3} spacing={3}>
          <Text fontSize="10px" color="gray.400">
            Created by {dep.createdBy?.name}
          </Text>
          <Text fontSize="10px" color="gray.300">
            •
          </Text>
          <Text fontSize="10px" color="gray.400">
            {new Date(dep.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </Text>
        </HStack>
      </Box>

      <Button
        size="sm"
        variant="outline"
        borderColor="#fa7602"
        color="#fa7602"
        borderRadius="full"
        px={4}
        fontWeight="700"
        fontSize="12px"
        _hover={{ bg: "#fa7602", color: "white" }}
        transition="all 0.2s"
      >
        Reassign
      </Button>
    </Flex>
  </Box>
);

/* ── form field helper ── */
const Field = ({ label, required, error, children }) => (
  <FormControl isInvalid={!!error} mb={4}>
    <FormLabel fontSize="sm" fontWeight="600" color="gray.600" mb={1}>
      {label}
      {required && (
        <Text as="span" color="red.400">
          {" "}
          *
        </Text>
      )}
    </FormLabel>
    {children}
    <FormErrorMessage fontSize="xs">{error}</FormErrorMessage>
  </FormControl>
);

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newDepName, setNewDepName] = useState("");
  const [assignedName, setAssignedName] = useState("");
  const [assignedPhone, setAssignedPhone] = useState("");
  const [assignedContact, setAssignedContact] = useState("");
  const [assignedDesignation, setAssignedDesignation] = useState("");

  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null); // ← 409 conflict error
  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  /* resend countdown */
  useEffect(() => {
    if (resendTimer === 0) return;
    const t = setInterval(() => setResendTimer((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendTimer]);

  /* validation */
  const validateForm = () => {
    const e = {};
    if (!newDepName.trim()) e.newDepName = "Department name is required";
    if (!assignedName.trim()) e.assignedName = "Staff name is required";
    if (!assignedDesignation.trim())
      e.assignedDesignation = "Designation is required";
    if (!assignedPhone.trim() || !/^\d{10}$/.test(assignedPhone))
      e.assignedPhone = "Valid 10-digit phone number required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* fetch departments */
  const fetchDepartments = async () => {
    try {
      const res = await fetch("/api/departments/get");
      const data = await res.json();
      if (data.success) setDepartments(data.departments);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  /* ── STEP 1: send OTP to staff phone ── */
  const sendOtp = async () => {
    if (!validateForm()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/departments/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: assignedPhone }),
      });
      const data = await res.json();

      if (res.status === 409) {
        setError({ message: data.message, actions: data.actions });
        return;
      }

      if (!res.ok) throw new Error(data.message);
      setOtpStep(2);
      setResendTimer(OTP_TIME);
      toast({ title: `OTP sent to +91 ${assignedPhone}`, status: "success" });
    } catch (err) {
      toast({ title: err.message || "OTP भेजने में असफल", status: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  /* resend OTP */
  const resendOtp = async () => {
    setOtp("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: assignedPhone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setResendTimer(OTP_TIME);
      toast({ title: "OTP पुनः भेजा गया", status: "info" });
    } catch (err) {
      toast({ title: err.message, status: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  /* ── STEP 2: verify OTP + create dept ── */
  const verifyOtpAndCreate = async () => {
    if (otp.length !== 6) {
      toast({ title: "कृपया 6 अंकों का OTP दर्ज करें", status: "warning" });
      return;
    }
    setSubmitting(true);
    setProgressText("Creating department...");
    try {
      const res = await fetch("/api/departments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newDepName,
          assignedName,
          assignedPhone,
          assignedContact: assignedContact || assignedPhone,
          assignedDesignation,
          otp,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast({ title: "Department created!", status: "success" });
      handleClose();
      fetchDepartments();
    } catch (err) {
      setOtp("");
      toast({ title: err.message, status: "error" });
    } finally {
      setSubmitting(false);
      setProgressText("");
    }
  };

  /* reset + close */
  const handleClose = () => {
    onClose();
    setOtpStep(1);
    setOtp("");
    setResendTimer(0);
    setProgressText("");
    setNewDepName("");
    setAssignedName("");
    setAssignedPhone("");
    setAssignedContact("");
    setAssignedDesignation("");
    setErrors({});
    setError(null); // ← clear conflict error on close
  };

  const goBack = () => {
    setOtpStep(1);
    setOtp("");
    setResendTimer(0);
  };

  return (
    <Box minH="100vh" bg="#fafafa" py={10} px={{ base: 4, md: 8 }}>
      <Box maxW="860px" mx="auto">
        {/* ── header ── */}
        <Flex justify="space-between" align="center" mb={6}>
          <Box>
            <Text fontSize="2xl" fontWeight="800" color="gray.800">
              Departments
            </Text>
            <Text fontSize="sm" color="gray.400" mt="1px">
              {departments.length} department
              {departments.length !== 1 ? "s" : ""} registered
            </Text>
          </Box>
          <Button
            leftIcon={<AddIcon />}
            bg="#fa7602"
            color="white"
            borderRadius="full"
            fontWeight="700"
            px={5}
            _hover={{ bg: "#e06800" }}
            onClick={onOpen}
          >
            Create
          </Button>
        </Flex>

        {/* ── list ── */}
        {loading ? (
          <VStack spacing={3}>
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} height="130px" borderRadius="16px" w="100%" />
            ))}
          </VStack>
        ) : departments.length === 0 ? (
          <Flex
            h="50vh"
            align="center"
            justify="center"
            flexDir="column"
            gap={3}
          >
            <Box fontSize="48px">🏢</Box>
            <Text color="gray.400" fontSize="lg" fontWeight="600">
              No departments yet
            </Text>
            <Button
              bg="#fa7602"
              color="white"
              borderRadius="full"
              onClick={onOpen}
              _hover={{ bg: "#e06800" }}
            >
              Create First Department
            </Button>
          </Flex>
        ) : (
          <VStack spacing={3} align="stretch">
            {departments.map((dep, i) => (
              <DeptCard key={dep._id} dep={dep} index={i} />
            ))}
          </VStack>
        )}
      </Box>

      {/* ── MODAL ── */}
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        isCentered
        closeOnOverlayClick={false}
        size="md"
      >
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="16px" overflow="hidden">
          <Box h="3px" bg="#fa7602" />
          <ModalHeader fontWeight="800" fontSize="lg">
            {otpStep === 1 ? "Create Department" : "Verify Staff Phone"}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {/* ── STEP 1: form ── */}
            {otpStep === 1 && (
              <>
                <Field
                  label="Department Name"
                  required
                  error={errors.newDepName}
                >
                  <Input
                    value={newDepName}
                    onChange={(e) => setNewDepName(e.target.value)}
                    borderRadius="10px"
                    focusBorderColor="#fa7602"
                    placeholder="e.g. Electric"
                  />
                </Field>

                <Field
                  label="Designation"
                  required
                  error={errors.assignedDesignation}
                >
                  <Input
                    value={assignedDesignation}
                    onChange={(e) =>
                      setAssignedDesignation(e.target.value.replace(/\s/g, ""))
                    }
                    borderRadius="10px"
                    focusBorderColor="#fa7602"
                    placeholder="No spaces (e.g. SectionOfficer)"
                  />
                </Field>

                <Field label="Staff Name" required error={errors.assignedName}>
                  <Input
                    value={assignedName}
                    onChange={(e) => setAssignedName(e.target.value)}
                    borderRadius="10px"
                    focusBorderColor="#fa7602"
                  />
                </Field>

                <Field
                  label="Staff Mobile Number"
                  required
                  error={errors.assignedPhone}
                >
                  <InputGroup>
                    <InputLeftAddon
                      children="+91"
                      bg="gray.100"
                      borderRadius="10px 0 0 10px"
                    />
                    <Input
                      type="tel"
                      maxLength={10}
                      placeholder="10 अंकों का नंबर"
                      value={assignedPhone}
                      onChange={(e) => {
                        setAssignedPhone(e.target.value.replace(/\D/g, ""));
                        setErrors((er) => ({ ...er, assignedPhone: false }));
                        setError(null); // clear conflict error on retype
                      }}
                      borderRadius="0 10px 10px 0"
                      focusBorderColor="#fa7602"
                    />
                  </InputGroup>
                </Field>

                {/* ── 409 conflict error banner ── */}
                {error && (
                  <Box
                    mt={-2}
                    mb={4}
                    px={4}
                    py={3}
                    borderRadius="10px"
                    border="1px solid"
                    borderColor="orange.200"
                    bg="orange.50"
                  >
                    <Text fontSize="sm" color="orange.800" mb={2}>
                      {error.message}
                    </Text>
                    <HStack spacing={3}>
                      {error.actions?.map((a) =>
                        a.href ? (
                          <Button
                            key={a.label}
                            as="a"
                            href={a.href}
                            size="xs"
                            bg="#fa7602"
                            color="white"
                            borderRadius="full"
                            _hover={{ bg: "#e06800" }}
                          >
                            {a.label}
                          </Button>
                        ) : (
                          <Button
                            key={a.label}
                            size="xs"
                            variant="outline"
                            borderColor="#fa7602"
                            color="#fa7602"
                            borderRadius="full"
                            _hover={{ bg: "orange.50" }}
                            onClick={() => {
                              setAssignedPhone("");
                              setError(null);
                            }}
                          >
                            {a.label}
                          </Button>
                        ),
                      )}
                    </HStack>
                  </Box>
                )}

                {/* optional contact */}
                <Field
                  label="Department Contact (optional)"
                  error={errors.assignedContact}
                >
                  <InputGroup>
                    <InputLeftAddon
                      children="+91"
                      bg="gray.100"
                      borderRadius="10px 0 0 10px"
                    />
                    <Input
                      type="tel"
                      maxLength={10}
                      placeholder="Leave blank to use staff number"
                      value={assignedContact}
                      onChange={(e) =>
                        setAssignedContact(e.target.value.replace(/\D/g, ""))
                      }
                      borderRadius="0 10px 10px 0"
                      focusBorderColor="#fa7602"
                    />
                  </InputGroup>
                </Field>
              </>
            )}

            {/* ── STEP 2: OTP ── */}
            {otpStep === 2 && (
              <VStack spacing={5}>
                <Box
                  bg="orange.50"
                  border="1px solid"
                  borderColor="orange.200"
                  borderRadius="xl"
                  px={5}
                  py={3}
                  textAlign="center"
                  w="100%"
                >
                  <Text fontSize="sm" color="gray.600">
                    OTP sent to{" "}
                    <Text as="span" fontWeight="700" color="gray.800">
                      +91 {assignedPhone}
                    </Text>
                  </Text>
                  <Text fontSize="xs" color="gray.400" mt={1}>
                    Staff member must share the OTP with you
                  </Text>
                </Box>

                <Text fontSize="sm" color="gray.500">
                  6 अंकों का OTP दर्ज करें
                </Text>

                <HStack justify="center">
                  <PinInput otp value={otp} onChange={setOtp}>
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

                <Flex justify="space-between" w="100%">
                  <Button
                    variant="ghost"
                    size="sm"
                    borderRadius="full"
                    onClick={goBack}
                  >
                    ← Back
                  </Button>
                  <Button
                    variant="link"
                    fontSize="sm"
                    color={resendTimer > 0 ? "gray.400" : "orange.500"}
                    isDisabled={resendTimer > 0 || submitting}
                    onClick={resendOtp}
                  >
                    {resendTimer > 0
                      ? `Resend in ${resendTimer}s`
                      : "OTP पुनः भेजें"}
                  </Button>
                </Flex>
              </VStack>
            )}
          </ModalBody>

          <ModalFooter pt={0} pb={5}>
            {otpStep === 1 && (
              <Button
                w="100%"
                bg="#fa7602"
                color="white"
                borderRadius="full"
                fontWeight="700"
                isLoading={submitting}
                loadingText="Sending OTP..."
                _hover={{ bg: "#e06800" }}
                onClick={sendOtp}
              >
                Send OTP to Staff →
              </Button>
            )}
            {otpStep === 2 && (
              <Button
                w="100%"
                bg="#fa7602"
                color="white"
                borderRadius="full"
                fontWeight="700"
                isLoading={submitting}
                loadingText={progressText || "Creating..."}
                _hover={{ bg: "#e06800" }}
                onClick={verifyOtpAndCreate}
              >
                Verify & Create Department ✓
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DepartmentsPage;
