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
  Badge,
  Icon,
  Checkbox,
  CheckboxGroup,
  Grid,
  GridItem,
  Divider,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { MdPerson, MdPhone, MdAdminPanelSettings, MdSecurity } from "react-icons/md";
import { useAuth } from "@/context/AuthContext";
import { PERMISSIONS } from "@/constants/permissions";

const OTP_TIME = 60;

// Permission groups for better organization
const PERMISSION_GROUPS = {
  Dashboard: {
    icon: "📊",
    permissions: [PERMISSIONS.VIEW_DASHBOARD],
  },
  Users: {
    icon: "👥",
    permissions: [
      PERMISSIONS.VIEW_USERS,
      PERMISSIONS.CREATE_USER,
      PERMISSIONS.EDIT_USER,
      PERMISSIONS.DELETE_USER,
    ],
  },
  Tickets: {
    icon: "🎫",
    permissions: [
      PERMISSIONS.VIEW_TICKETS,
      PERMISSIONS.CREATE_TICKET,
      PERMISSIONS.EDIT_TICKET,
      PERMISSIONS.DELETE_TICKET,
      PERMISSIONS.ASSIGN_TICKET,
      PERMISSIONS.CLOSE_TICKET,
    ],
  },
  Reports: {
    icon: "📈",
    permissions: [PERMISSIONS.VIEW_REPORTS],
  },
  Departments: {
    icon: "🏢",
    permissions: [PERMISSIONS.MANAGE_DEPARTMENTS],
  },
  Settings: {
    icon: "⚙️",
    permissions: [PERMISSIONS.MANAGE_SETTINGS],
  },
};

/* ── SubAdmin Card ── */
const SubAdminCard = ({ subAdmin, index, onEdit, onDelete, onPromote }) => (
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
            {subAdmin.name}
          </Text>
          <Badge
            colorScheme="orange"
            borderRadius="full"
            fontSize="10px"
            fontWeight="700"
            px={3}
          >
            Sub-Admin
          </Badge>
          {subAdmin.isActive === false && (
            <Badge colorScheme="red" borderRadius="full" fontSize="10px" px={3}>
              Inactive
            </Badge>
          )}
        </HStack>

        <VStack align="flex-start" spacing={1}>
          <HStack spacing={2}>
            <MdPhone size={14} color="#fa7602" />
            <Text fontSize="sm" color="gray.500">
              +91 {subAdmin.phone}
            </Text>
          </HStack>
          
          <HStack spacing={2}>
            <MdSecurity size={14} color="#fa7602" />
            <Text fontSize="sm" color="gray.600">
              {subAdmin.permissions?.length || 0} permissions
            </Text>
          </HStack>
        </VStack>

        {/* Permission badges */}
        {subAdmin.permissions?.length > 0 && (
          <Flex mt={3} gap={2} flexWrap="wrap">
            {subAdmin.permissions.slice(0, 3).map((perm) => (
              <Badge
                key={perm}
                fontSize="9px"
                px={2}
                py={1}
                borderRadius="full"
                bg="gray.100"
                color="gray.600"
                fontWeight="500"
              >
                {perm.replace(/_/g, ' ')}
              </Badge>
            ))}
            {subAdmin.permissions.length > 3 && (
              <Badge
                fontSize="9px"
                px={2}
                py={1}
                borderRadius="full"
                bg="gray.200"
                color="gray.600"
                fontWeight="500"
              >
                +{subAdmin.permissions.length - 3} more
              </Badge>
            )}
          </Flex>
        )}

        <HStack mt={3} spacing={3}>
          <Text fontSize="10px" color="gray.400">
            Created by {subAdmin.createdBy?.name || "Admin"}
          </Text>
          <Text fontSize="10px" color="gray.300">•</Text>
          <Text fontSize="10px" color="gray.400">
            {new Date(subAdmin.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </Text>
        </HStack>
      </Box>

      <VStack spacing={2} align="flex-end">
        {/* Edit button */}
        <Button
          size="sm"
          variant="outline"
          borderColor="#fa7602"
          color="#fa7602"
          borderRadius="full"
          px={4}
          fontWeight="600"
          fontSize="12px"
          _hover={{ bg: "orange.50" }}
          onClick={() => onEdit(subAdmin)}
        >
          Edit
        </Button>

        {/* Promote to Admin button */}
        <Button
          size="sm"
          variant="solid"
          bg="green.50"
          color="green.700"
          border="1px solid"
          borderColor="green.200"
          borderRadius="full"
          px={4}
          fontWeight="700"
          fontSize="12px"
          leftIcon={<MdAdminPanelSettings size={14} />}
          _hover={{
            bg: "green.600",
            color: "white",
            borderColor: "green.600",
          }}
          onClick={() => onPromote(subAdmin)}
        >
          Promote
        </Button>

        {/* Delete button */}
        <Button
          size="sm"
          variant="ghost"
          color="red.500"
          borderRadius="full"
          px={3}
          fontSize="12px"
          _hover={{ bg: "red.50" }}
          onClick={() => onDelete(subAdmin)}
        >
          Delete
        </Button>
      </VStack>
    </Flex>
  </Box>
);

/* ── Form field helper ── */
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
const SubAdminsPage = () => {
  const { user } = useAuth();
  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSubAdmin, setEditingSubAdmin] = useState(null);

  /* ── Create/Edit SubAdmin state ── */
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);

  /* ── Promote state ── */
  const [promoteSubAdmin, setPromoteSubAdmin] = useState(null);
  const [promoteOtp, setPromoteOtp] = useState("");
  const [promoteStep, setPromoteStep] = useState(1);
  const [promoteSubmitting, setPromoteSubmitting] = useState(false);
  const [promoteResendTimer, setPromoteResendTimer] = useState(0);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isPromoteOpen,
    onOpen: onPromoteOpen,
    onClose: onPromoteClose,
  } = useDisclosure();

  /* resend countdown — create */
  useEffect(() => {
    if (resendTimer === 0) return;
    const t = setInterval(() => setResendTimer((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendTimer]);

  /* resend countdown — promote */
  useEffect(() => {
    if (promoteResendTimer === 0) return;
    const t = setInterval(() => setPromoteResendTimer((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [promoteResendTimer]);

  /* validation */
  const validateForm = () => {
    const e = {};
    
    if (!name.trim()) {
      e.name = "Sub Admin name is required";
    }
    
    if (!phone.trim() || !/^\d{10}$/.test(phone)) {
      e.phone = "Valid 10-digit phone number is required";
    }
    
    if (permissions.length === 0) {
      e.permissions = "Please select at least one permission";
    }
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* fetch sub-admins */
  const fetchSubAdmins = async () => {
    try {
      const res = await fetch("/api/users/subadmins");
      const data = await res.json();
      if (data.success) setSubAdmins(data.users);
    } catch (err) {
      toast({ title: "Failed to fetch sub-admins", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubAdmins();
  }, []);

  /* ── CREATE/EDIT: STEP 1 send OTP ── */
  const sendOtp = async () => {
    if (!validateForm()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/sub-admin/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          phone, 
          isEdit: isEditMode,
          userId: editingSubAdmin?._id 
        }),
      });
      const data = await res.json();

      if (res.status === 409) {
        setError({ message: data.message, actions: data.actions });
        return;
      }

      if (!res.ok) throw new Error(data.message);
      setOtpStep(2);
      setResendTimer(OTP_TIME);
      toast({ 
        title: `OTP sent to +91 ${phone}`, 
        status: "success" 
      });
    } catch (err) {
      toast({ title: err.message || "Failed to send OTP", status: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  /* resend OTP — create */
  const resendOtp = async () => {
    setOtp("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/users/subadmin/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, isEdit: isEditMode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setResendTimer(OTP_TIME);
      toast({ title: "OTP resent successfully", status: "info" });
    } catch (err) {
      toast({ title: err.message, status: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  /* ── CREATE/EDIT: STEP 2 verify OTP + save ── */
  const verifyOtpAndSave = async () => {
    if (otp.length !== 6) {
      toast({ title: "Please enter 6-digit OTP", status: "warning" });
      return;
    }
    setSubmitting(true);
    setProgressText(isEditMode ? "Updating sub-admin..." : "Creating sub-admin...");
    try {
      const endpoint = isEditMode ? "/api/users/subadmin/update" : "/api/users/subadmin/create";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          permissions,
          otp,
          userId: editingSubAdmin?._id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast({ 
        title: isEditMode ? "Sub-Admin updated!" : "Sub-Admin created!", 
        status: "success" 
      });
      handleClose();
      fetchSubAdmins();
    } catch (err) {
      setOtp("");
      toast({ title: err.message, status: "error" });
    } finally {
      setSubmitting(false);
      setProgressText("");
    }
  };

  /* reset + close modal */
  const handleClose = () => {
    onClose();
    setOtpStep(1);
    setOtp("");
    setResendTimer(0);
    setProgressText("");
    setName("");
    setPhone("");
    setPermissions([]);
    setErrors({});
    setError(null);
    setIsEditMode(false);
    setEditingSubAdmin(null);
  };

  const goBack = () => {
    setOtpStep(1);
    setOtp("");
    setResendTimer(0);
  };

  /* ── Edit handler ── */
  const handleEdit = (subAdmin) => {
    setEditingSubAdmin(subAdmin);
    setName(subAdmin.name);
    setPhone(subAdmin.phone);
    setPermissions(subAdmin.permissions || []);
    setIsEditMode(true);
    onOpen();
  };

  /* ── Delete handler ── */
  const handleDelete = async (subAdmin) => {
    if (!confirm(`Are you sure you want to delete ${subAdmin.name}?`)) return;
    try {
      const res = await fetch(`/api/users/subadmin/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: subAdmin._id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast({ title: "Sub-Admin deleted successfully", status: "success" });
      fetchSubAdmins();
    } catch (err) {
      toast({ title: err.message, status: "error" });
    }
  };

  /* ─────────────────────────────────────────
     PROMOTE FLOW
  ───────────────────────────────────────── */

  const handlePromoteOpen = (subAdmin) => {
    setPromoteSubAdmin(subAdmin);
    setPromoteStep(1);
    setPromoteOtp("");
    setPromoteResendTimer(0);
    onPromoteOpen();
  };

  const handlePromoteClose = () => {
    onPromoteClose();
    setPromoteSubAdmin(null);
    setPromoteStep(1);
    setPromoteOtp("");
    setPromoteResendTimer(0);
  };

  const sendPromoteOtp = async () => {
    setPromoteSubmitting(true);
    try {
      const res = await fetch("/api/users/subadmin/promote/send-otp", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setPromoteStep(2);
      setPromoteResendTimer(OTP_TIME);
      toast({
        title: "OTP sent to your registered number",
        status: "success",
      });
    } catch (err) {
      toast({ title: err.message || "Failed to send OTP", status: "error" });
    } finally {
      setPromoteSubmitting(false);
    }
  };

  const resendPromoteOtp = async () => {
    setPromoteOtp("");
    setPromoteSubmitting(true);
    try {
      const res = await fetch("/api/users/subadmin/promote/send-otp", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPromoteResendTimer(OTP_TIME);
      toast({ title: "OTP resent successfully", status: "info" });
    } catch (err) {
      toast({ title: err.message, status: "error" });
    } finally {
      setPromoteSubmitting(false);
    }
  };

  const verifyAndPromote = async () => {
    if (promoteOtp.length !== 6) {
      toast({ title: "Please enter 6-digit OTP", status: "warning" });
      return;
    }
    setPromoteSubmitting(true);
    try {
      const res = await fetch("/api/users/subadmin/promote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: promoteSubAdmin._id,
          otp: promoteOtp,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast({
        title: data.message || "Promoted to Admin!",
        status: "success",
        duration: 4000,
      });
      handlePromoteClose();
      fetchSubAdmins();
    } catch (err) {
      setPromoteOtp("");
      toast({ title: err.message, status: "error" });
    } finally {
      setPromoteSubmitting(false);
    }
  };

  /* ── Permission Checkbox Group ── */
  const PermissionSection = () => (
    <Box border="1px solid" borderColor="gray.200" borderRadius="md" p={4} mb={4}>
      <FormControl isInvalid={!!errors.permissions}>
        <FormLabel fontSize="sm" fontWeight="600" color="gray.600" mb={3}>
          Permissions
          <Text as="span" color="red.400"> *</Text>
        </FormLabel>
        
        <CheckboxGroup 
          colorScheme="orange" 
          value={permissions} 
          onChange={(values) => {
            setPermissions(values);
            setErrors({ ...errors, permissions: false });
          }}
        >
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
            {Object.entries(PERMISSION_GROUPS).map(([groupName, group]) => (
              <GridItem key={groupName}>
                <Box 
                  bg="gray.50" 
                  p={3} 
                  borderRadius="md"
                  border="1px solid"
                  borderColor="gray.100"
                >
                  <Text fontWeight="700" fontSize="sm" mb={2} color="gray.700">
                    {group.icon} {groupName}
                  </Text>
                  <VStack align="start" spacing={1}>
                    {group.permissions.map((permission) => (
                      <Checkbox key={permission} value={permission} size="sm">
                        <Text fontSize="sm" textTransform="capitalize">
                          {permission.replace(/_/g, ' ')}
                        </Text>
                      </Checkbox>
                    ))}
                  </VStack>
                </Box>
              </GridItem>
            ))}
          </Grid>
        </CheckboxGroup>
        
        <FormErrorMessage fontSize="xs">
          {errors.permissions}
        </FormErrorMessage>
      </FormControl>
    </Box>
  );

  return (
    <Box minH="100vh" bg="#fafafa" py={10} px={{ base: 4, md: 8 }}>
      <Box maxW="860px" mx="auto">
        {/* ── header ── */}
        <Flex justify="space-between" align="center" mb={6}>
          <Box>
            <Text fontSize="2xl" fontWeight="800" color="gray.800">
              Sub-Admins
            </Text>
            <Text fontSize="sm" color="gray.400" mt="1px">
              {subAdmins.length} sub-admin
              {subAdmins.length !== 1 ? "s" : ""} registered
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
            onClick={() => {
              setIsEditMode(false);
              setEditingSubAdmin(null);
              setName("");
              setPhone("");
              setPermissions([]);
              setErrors({});
              onOpen();
            }}
          >
            Create Sub-Admin
          </Button>
        </Flex>

        {/* ── list ── */}
        {loading ? (
          <VStack spacing={3}>
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} height="150px" borderRadius="16px" w="100%" />
            ))}
          </VStack>
        ) : subAdmins.length === 0 ? (
          <Flex
            h="50vh"
            align="center"
            justify="center"
            flexDir="column"
            gap={3}
          >
            <Box fontSize="48px">👤</Box>
            <Text color="gray.400" fontSize="lg" fontWeight="600">
              No sub-admins yet
            </Text>
            <Button
              bg="#fa7602"
              color="white"
              borderRadius="full"
              onClick={() => {
                setIsEditMode(false);
                setEditingSubAdmin(null);
                setName("");
                setPhone("");
                setPermissions([]);
                setErrors({});
                onOpen();
              }}
              _hover={{ bg: "#e06800" }}
            >
              Create First Sub-Admin
            </Button>
          </Flex>
        ) : (
          <VStack spacing={3} align="stretch">
            {subAdmins.map((subAdmin, i) => (
              <SubAdminCard
                key={subAdmin._id}
                subAdmin={subAdmin}
                index={i}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onPromote={handlePromoteOpen}
              />
            ))}
          </VStack>
        )}
      </Box>

      {/* ══════════════════════════════════════
          CREATE/EDIT SUB-ADMIN MODAL
      ══════════════════════════════════════ */}
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        isCentered
        closeOnOverlayClick={false}
        size="xl"
      >
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="16px" overflow="hidden">
          <Box h="3px" bg="#fa7602" />
          <ModalHeader fontWeight="800" fontSize="lg">
            {otpStep === 1 
              ? (isEditMode ? "Edit Sub-Admin" : "Create Sub-Admin")
              : "Verify Phone Number"}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {otpStep === 1 && (
              <>
                <Field label="Full Name" required error={errors.name}>
                  <Input
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors({ ...errors, name: false });
                    }}
                    borderRadius="10px"
                    focusBorderColor="#fa7602"
                    placeholder="Enter sub-admin name"
                  />
                </Field>

                <Field
                  label="Mobile Number"
                  required
                  error={errors.phone}
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
                      placeholder="10-digit number"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value.replace(/\D/g, ""));
                        setErrors({ ...errors, phone: false });
                        setError(null);
                      }}
                      borderRadius="0 10px 10px 0"
                      focusBorderColor="#fa7602"
                      isDisabled={isEditMode}
                    />
                  </InputGroup>
                </Field>

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
                              setPhone("");
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

                <PermissionSection />
              </>
            )}

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
                      +91 {phone}
                    </Text>
                  </Text>
                  <Text fontSize="xs" color="gray.400" mt={1}>
                    Enter the OTP to verify this number
                  </Text>
                </Box>

                <Text fontSize="sm" color="gray.500">
                  Enter 6-digit OTP
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
                      : "Resend OTP"}
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
                loadingText={isEditMode ? "Sending OTP..." : "Sending OTP..."}
                _hover={{ bg: "#e06800" }}
                onClick={sendOtp}
              >
                {isEditMode ? "Update & Send OTP →" : "Send OTP →"}
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
                loadingText={progressText || "Saving..."}
                _hover={{ bg: "#e06800" }}
                onClick={verifyOtpAndSave}
              >
                {isEditMode ? "Verify & Update ✓" : "Verify & Create ✓"}
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ══════════════════════════════════════
          PROMOTE MODAL
      ══════════════════════════════════════ */}
      <Modal
        isOpen={isPromoteOpen}
        onClose={handlePromoteClose}
        isCentered
        closeOnOverlayClick={false}
        size="sm"
      >
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="16px" overflow="hidden">
          <Box h="3px" bg="green.500" />
          <ModalHeader fontWeight="800" fontSize="lg" pb={2}>
            {promoteStep === 1 ? "Promote to Admin" : "Verify Your Identity"}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={2}>
            {promoteStep === 1 && promoteSubAdmin && (
              <VStack spacing={4} align="stretch">
                <Box
                  bg="green.50"
                  border="1px solid"
                  borderColor="green.200"
                  borderRadius="12px"
                  p={4}
                >
                  <HStack spacing={3} mb={2}>
                    <Box
                      bg="green.100"
                      borderRadius="full"
                      p={2}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <MdAdminPanelSettings size={20} color="#276749" />
                    </Box>
                    <Box>
                      <Text
                        fontSize="sm"
                        fontWeight="800"
                        color="gray.800"
                        textTransform="capitalize"
                      >
                        {promoteSubAdmin.name}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {promoteSubAdmin.phone}
                      </Text>
                    </Box>
                  </HStack>
                  <Text fontSize="xs" color="green.700">
                    This user will be granted full Admin access.
                  </Text>
                </Box>

                <Box
                  bg="orange.50"
                  border="1px solid"
                  borderColor="orange.200"
                  borderRadius="10px"
                  px={4}
                  py={3}
                >
                  <Text fontSize="xs" color="orange.800" lineHeight="1.6">
                    ⚠️ An OTP will be sent to{" "}
                    <Text as="span" fontWeight="700">
                      your registered mobile number
                    </Text>{" "}
                    to confirm this action.
                  </Text>
                </Box>
              </VStack>
            )}

            {promoteStep === 2 && (
              <VStack spacing={5}>
                <Box
                  bg="green.50"
                  border="1px solid"
                  borderColor="green.200"
                  borderRadius="xl"
                  px={5}
                  py={3}
                  textAlign="center"
                  w="100%"
                >
                  <Text fontSize="sm" color="gray.600">
                    OTP sent to your registered number
                  </Text>
                  <Text fontSize="xs" color="gray.400" mt={1}>
                    Enter it below to confirm promotion
                  </Text>
                </Box>

                <Text fontSize="sm" color="gray.500">
                  Enter 6-digit OTP
                </Text>

                <HStack justify="center">
                  <PinInput otp value={promoteOtp} onChange={setPromoteOtp}>
                    {[...Array(6)].map((_, i) => (
                      <PinInputField
                        key={i}
                        fontSize="xl"
                        fontWeight="bold"
                        borderColor="gray.300"
                        _focus={{
                          borderColor: "green.500",
                          boxShadow: "0 0 0 1px #38a169",
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
                    onClick={() => {
                      setPromoteStep(1);
                      setPromoteOtp("");
                      setPromoteResendTimer(0);
                    }}
                  >
                    ← Back
                  </Button>
                  <Button
                    variant="link"
                    fontSize="sm"
                    color={promoteResendTimer > 0 ? "gray.400" : "green.500"}
                    isDisabled={promoteResendTimer > 0 || promoteSubmitting}
                    onClick={resendPromoteOtp}
                  >
                    {promoteResendTimer > 0
                      ? `Resend in ${promoteResendTimer}s`
                      : "Resend OTP"}
                  </Button>
                </Flex>
              </VStack>
            )}
          </ModalBody>

          <ModalFooter pt={3} pb={5}>
            {promoteStep === 1 && (
              <Button
                w="100%"
                bg="green.500"
                color="white"
                borderRadius="full"
                fontWeight="700"
                isLoading={promoteSubmitting}
                loadingText="Sending OTP..."
                _hover={{ bg: "green.600" }}
                onClick={sendPromoteOtp}
              >
                Send OTP to My Number →
              </Button>
            )}
            {promoteStep === 2 && (
              <Button
                w="100%"
                bg="green.500"
                color="white"
                borderRadius="full"
                fontWeight="700"
                isLoading={promoteSubmitting}
                loadingText="Promoting..."
                _hover={{ bg: "green.600" }}
                onClick={verifyAndPromote}
              >
                Verify & Promote to Admin ✓
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SubAdminsPage;