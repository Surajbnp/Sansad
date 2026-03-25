"use client";

import {
  Box,
  Text,
  Flex,
  VStack,
  HStack,
  Icon,
  Badge,
  Avatar,
  Button,
  Textarea,
  Image,
  Input,
  useToast,
  SkeletonText,
  SkeletonCircle,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Select,
  useDisclosure,
  Spinner,
  Checkbox,
} from "@chakra-ui/react";
import { CheckCircleIcon, TimeIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ImagePreviewModal from "@/components/ImagePreviewModal";

/* ── status colour map ── */
const STATUS_CONFIG = {
  Submitted: { color: "#2563eb", bg: "#eff6ff" },
  Assigned: { color: "#7c3aed", bg: "#f5f3ff" },
  "In Progress": { color: "#d97706", bg: "#fffbeb" },
  "Awaiting User Response": { color: "#ea580c", bg: "#fff7ed" },
  "User Respond Received": { color: "#0891b2", bg: "#ecfeff" },
  Resolved: { color: "#16a34a", bg: "#f0fdf4" },
  Closed: { color: "#6b7280", bg: "#f9fafb" },
};
const getS = (s) => STATUS_CONFIG[s] || { color: "#6b7280", bg: "#f9fafb" };

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
const fmtDateTime = (d) =>
  new Date(d).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

/* ── info chip ── */
const Chip = ({ label, value }) => (
  <Box bg="gray.50" borderRadius="10px" px={3} py={2}>
    <Text
      fontSize="9px"
      color="gray.400"
      fontWeight="700"
      letterSpacing="0.1em"
      textTransform="uppercase"
    >
      {label}
    </Text>
    <Text fontSize="sm" fontWeight="600" color="gray.700">
      {value || "—"}
    </Text>
  </Box>
);

export default function TicketDetailsPage() {
  const [ticket, setTicket] = useState(null);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [updateStatus, setUpdateStatus] = useState("");
  const [updateRemarks, setUpdateRemarks] = useState("");
  const [requireFile, setRequireFile] = useState(false);
  const [expectedResolvedDate, setExpectedResolvedDate] = useState("");
  const [updating, setUpdating] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const {
    isOpen: isAssignOpen,
    onOpen: onAssignOpen,
    onClose: onAssignClose,
  } = useDisclosure();
  const {
    isOpen: isUpdateOpen,
    onOpen: onUpdateOpen,
    onClose: onUpdateClose,
  } = useDisclosure();

  const toast = useToast();
  const { id } = useParams();
  const { user } = useAuth(); // ← removed accessToken

  /* ── fetch ticket — cookie automatic ── */
  const fetchTicket = async () => {
    try {
      const res = await fetch(`/api/ticket/${id}`);
      const data = await res.json();
      setTicket(data.ticket);
    } catch (err) {
      console.error("Error fetching ticket:", err);
    }
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch(`/api/departments/get`);
        const data = await res.json();
        setDepartments(data.departments || []);
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    };

    if (id && user?.role !== "User") fetchDepartments();
    if (id) fetchTicket();
  }, [id, user]);

  /* ── assign ── */
  const handleAssign = async () => {
    if (!selectedDept) {
      toast({
        title: "Please select a department",
        status: "warning",
        duration: 3000,
      });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/ticket/${id}/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Assigned",
          remarks: `Assigned to ${selectedDept} department`,
          assignedDept: selectedDept,
        }),
      });
      const data = await res.json();
      toast({
        title: data.message || "Assigned!",
        status: "success",
        duration: 3000,
      });
      onAssignClose();
      fetchTicket();
    } catch (err) {
      toast({ title: "Assignment failed", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  /* ── update status ── */
  const handleUpdateTicket = async () => {
    if (!updateStatus) {
      toast({
        title: "Please select a status",
        status: "warning",
        duration: 3000,
      });
      return;
    }
    if (updateStatus === "In Progress" && !expectedResolvedDate) {
      toast({
        title: "Expected resolved date required",
        status: "warning",
        duration: 3000,
      });
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch(`/api/ticket/${id}/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: updateStatus,
          remarks: updateRemarks,
          fileRequired:
            updateStatus === "Awaiting User Response" ? requireFile : false,
          expectedResolvedDate:
            updateStatus === "In Progress" ? expectedResolvedDate : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      toast({
        title: data.message || "Ticket updated",
        status: "success",
        duration: 3000,
      });
      onUpdateClose();
      setUpdateStatus("");
      setUpdateRemarks("");
      setRequireFile(false);
      setExpectedResolvedDate("");
      fetchTicket();
    } catch (err) {
      toast({ title: err.message || "Update failed", status: "error" });
    } finally {
      setUpdating(false);
    }
  };

  /* ── user respond ── */
  const handleUserResponseSubmit = async () => {
    if (!responseText.trim()) {
      toast({
        title: "Please enter your response",
        status: "warning",
        duration: 3000,
      });
      return;
    }
    const lastHistory =
      ticket?.statusHistory?.[ticket.statusHistory.length - 1];
    if (lastHistory?.fileRequired && !fileUrl) {
      toast({
        title: "Please upload the required file",
        status: "warning",
        duration: 3000,
      });
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch(`/api/ticket/${id}/respond`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          remarks: responseText,
          ...(fileUrl && { fileUrl }),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submission failed");
      toast({
        title: "Response submitted!",
        status: "success",
        duration: 3000,
      });
      setResponseText("");
      setFileUrl(null);
      setShowResponseForm(false);
      fetchTicket();
    } catch (err) {
      toast({ title: err.message || "Submission failed", status: "error" });
    } finally {
      setUpdating(false);
    }
  };

  /* ── cloudinary upload ── */
  const handleFileUpload = () => {
    setUploading(true);
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dxwwnettz",
        uploadPreset: "sansadpreset",
        resourceType: "image",
        multiple: false,
        clientAllowedFormats: ["jpg", "jpeg", "png"],
        maxFileSize: 1000000,
        folder: "tickets",
        sources: ["local", "camera"],
      },
      (error, result) => {
        setUploading(false);
        if (error) {
          toast({ title: "Upload failed", status: "error" });
          return;
        }
        if (result.event === "success") {
          const { public_id, format } = result.info;
          setFileUrl(
            `https://res.cloudinary.com/dxwwnettz/image/upload/w_1280,h_1280,c_limit,q_auto:eco,f_auto/${public_id}.${format}`,
          );
          toast({ title: "Image uploaded!", status: "success" });
        }
      },
    );
    widget.open();
  };

  const s = getS(ticket?.status);
  const lastHistory =
    ticket?.statusHistory?.[ticket?.statusHistory?.length - 1];

  return (
    <Box minH="100vh" bg="#fafafa" py={10}   px={{ base: 4, md: 8 }}>
      <Box maxW="800px" mx="auto">
        {!ticket ? (
          <Box bg="white" borderRadius="16px" p={6}>
            <SkeletonCircle size="10" mb={4} />
            <SkeletonText noOfLines={8} spacing="4" />
          </Box>
        ) : (
          <>
            {/* ── TICKET HEADER CARD ── */}
            <Box
              bg="white"
              borderRadius="16px"
              border="1px solid"
              borderColor="gray.100"
              boxShadow="0 2px 16px rgba(0,0,0,0.06)"
              overflow="hidden"
              mb={5}
            >
              {/* coloured top bar matching status */}
              <Box h="4px" bg={s.color} />

              <Box p={{ base: 5, md: 7 }}>
                {/* id + badges */}
                <Flex
                  justify="space-between"
                  align="center"
                  wrap="wrap"
                  gap={3}
                  mb={4}
                >
                  <Text
                    fontSize="11px"
                    color="gray.400"
                    fontWeight="600"
                    letterSpacing="0.08em"
                    bg="gray.50"
                    px={2}
                    py="3px"
                    borderRadius="6px"
                  >
                    #{ticket._id?.slice(-10).toUpperCase()}
                  </Text>
                  <HStack spacing={2} flexWrap="wrap">
                    <Box
                      px={3}
                      py="3px"
                      borderRadius="full"
                      fontSize="11px"
                      fontWeight="700"
                      bg={s.bg}
                      color={s.color}
                      letterSpacing="0.04em"
                    >
                      {ticket.status}
                    </Box>
                    {ticket.assignedDept && (
                      <Box
                        px={3}
                        py="3px"
                        borderRadius="full"
                        fontSize="11px"
                        fontWeight="600"
                        bg="#f5f3ff"
                        color="#7c3aed"
                      >
                        {ticket.assignedDept}
                      </Box>
                    )}
                  </HStack>
                </Flex>

                {/* title + description */}
                <Text
                  fontSize={{ base: "xl", md: "2xl" }}
                  fontWeight="800"
                  color="gray.800"
                  textTransform="capitalize"
                  mb={2}
                >
                  {ticket.title}
                </Text>
                <Text color="gray.500" fontSize="sm" lineHeight="1.7">
                  {ticket.description}
                </Text>

                {/* attached image */}
                {ticket.fileUrl && (
                  <Box mt={4}>
                    <Text
                      fontSize="xs"
                      fontWeight="700"
                      color="gray.400"
                      letterSpacing="0.08em"
                      textTransform="uppercase"
                      mb={2}
                    >
                      Attached File
                    </Text>
                    <Image
                      src={ticket.fileUrl}
                      alt="Attachment"
                      maxH="200px"
                      borderRadius="10px"
                      cursor="pointer"
                      onClick={() => {
                        setPreviewImage(ticket.fileUrl);
                        setPreviewOpen(true);
                      }}
                      _hover={{ opacity: 0.9 }}
                      transition="opacity 0.2s"
                    />
                    <ImagePreviewModal
                      isOpen={previewOpen}
                      onClose={() => setPreviewOpen(false)}
                      imageUrl={previewImage}
                    />
                  </Box>
                )}

                {/* meta chips */}
                <Flex mt={5} gap={3} wrap="wrap">
                  <Chip label="Created by" value={ticket?.user?.name} />
                  <Chip label="Created on" value={fmtDate(ticket?.createdAt)} />
                  <Chip
                    label="Expected by"
                    value={
                      lastHistory?.expectedResolvedDate
                        ? fmtDate(lastHistory.expectedResolvedDate)
                        : "N/A"
                    }
                  />
                  {ticket.assignedDept && (
                    <Chip label="Department" value={ticket.assignedDept} />
                  )}
                </Flex>

                {/* action buttons */}
                <HStack mt={5} spacing={3} flexWrap="wrap">
                  {user?.role === "Admin" && ticket?.status === "Submitted" && (
                    <Button
                      bg="#7c3aed"
                      color="white"
                      borderRadius="full"
                      size="sm"
                      px={5}
                      fontWeight="700"
                      _hover={{ bg: "#6d28d9" }}
                      onClick={onAssignOpen}
                    >
                      Assign Department
                    </Button>
                  )}
                  {(user?.role === "Admin" || user?.role === "Department") && (
                    <Button
                      bg="#16a34a"
                      color="white"
                      borderRadius="full"
                      size="sm"
                      px={5}
                      fontWeight="700"
                      _hover={{ bg: "#15803d" }}
                      onClick={onUpdateOpen}
                    >
                      Update Status
                    </Button>
                  )}
                </HStack>
              </Box>
            </Box>

            {/* ── TIMELINE ── */}
            <Box
              bg="white"
              borderRadius="16px"
              border="1px solid"
              borderColor="gray.100"
              boxShadow="0 2px 16px rgba(0,0,0,0.06)"
              p={{ base: 5, md: 7 }}
              mb={5}
            >
              <HStack mb={5} spacing={3}>
                <Box w="4px" h="22px" bg="#fa7602" borderRadius="full" />
                <Text fontSize="md" fontWeight="700" color="gray.700">
                  Status Timeline
                </Text>
              </HStack>

              <VStack align="start" spacing={0} position="relative" pl={6}>
                {/* vertical line */}
                <Box
                  position="absolute"
                  left="8px"
                  top="10px"
                  bottom="10px"
                  w="2px"
                  bg="gray.100"
                  borderRadius="full"
                />

                {ticket?.statusHistory?.map((item, index) => {
                  const isLast = index === ticket.statusHistory.length - 1;
                  const hs = getS(item.status);
                  return (
                    <Flex
                      key={index}
                      align="flex-start"
                      position="relative"
                      pb={6}
                      w="100%"
                    >
                      {/* dot */}
                      <Box
                        position="absolute"
                        left="-22px"
                        top="2px"
                        w="18px"
                        h="18px"
                        borderRadius="full"
                        bg={isLast ? "#fa7602" : "white"}
                        border="2px solid"
                        borderColor={isLast ? "#fa7602" : "gray.200"}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        zIndex={1}
                      >
                        {!isLast && (
                          <Box
                            w="6px"
                            h="6px"
                            borderRadius="full"
                            bg="gray.300"
                          />
                        )}
                      </Box>

                      <Box w="100%" pl={4}>
                        {/* status pill */}
                        {item.status && (
                          <Box
                            display="inline-block"
                            px={2}
                            py="1px"
                            borderRadius="full"
                            fontSize="10px"
                            fontWeight="700"
                            bg={hs.bg}
                            color={hs.color}
                            mb={1}
                          >
                            {item.status}
                          </Box>
                        )}

                        {item.remarks && (
                          <Text fontWeight="600" color="gray.800" fontSize="sm">
                            {item.remarks}
                          </Text>
                        )}

                        <Text fontSize="11px" color="gray.400" mt="2px">
                          {fmtDateTime(item.date)}
                        </Text>

                        {item?.fileUrl && (
                          <Image
                            src={item.fileUrl}
                            alt="attachment"
                            maxH="120px"
                            borderRadius="8px"
                            mt={2}
                            cursor="pointer"
                            onClick={() => {
                              setPreviewImage(item.fileUrl);
                              setPreviewOpen(true);
                            }}
                          />
                        )}

                        <HStack mt={2} spacing={1}>
                          <Avatar size="2xs" name={item?.updatedBy?.name} />
                          <Text
                            fontSize="11px"
                            color="gray.500"
                            fontStyle="italic"
                          >
                            {item?.updatedBy?.userId === user?._id
                              ? "You"
                              : item?.updatedBy?.name}
                            {` (${item?.updatedBy?.role})`}
                          </Text>
                        </HStack>
                      </Box>
                    </Flex>
                  );
                })}
              </VStack>
            </Box>

            {/* ── USER RESPOND ── */}
            {ticket.status === "Awaiting User Response" &&
              user?.role === "User" && (
                <Box
                  bg="white"
                  borderRadius="16px"
                  border="1px solid"
                  borderColor="orange.200"
                  boxShadow="0 2px 16px rgba(250,118,2,0.08)"
                  p={{ base: 5, md: 7 }}
                >
                  <HStack mb={4} spacing={3}>
                    <Box w="4px" h="22px" bg="#fa7602" borderRadius="full" />
                    <Text fontSize="md" fontWeight="700" color="gray.700">
                      Your Response Needed
                    </Text>
                  </HStack>

                  {!showResponseForm ? (
                    <Button
                      bg="#fa7602"
                      color="white"
                      borderRadius="full"
                      fontWeight="700"
                      _hover={{ bg: "#e06800" }}
                      onClick={() => setShowResponseForm(true)}
                    >
                      Respond to Ticket
                    </Button>
                  ) : (
                    <VStack spacing={4} align="stretch">
                      <Textarea
                        placeholder="Enter your response..."
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        borderRadius="10px"
                        borderColor="gray.200"
                        focusBorderColor="#fa7602"
                        minH="120px"
                        fontSize="sm"
                      />

                      {lastHistory?.fileRequired && (
                        <HStack>
                          <Button
                            onClick={handleFileUpload}
                            bg="#fa7602"
                            color="white"
                            borderRadius="full"
                            size="sm"
                            isLoading={uploading}
                            _hover={{ bg: "#e06800" }}
                          >
                            Upload File
                          </Button>
                          {fileUrl && (
                            <Image
                              src={fileUrl}
                              alt="Uploaded"
                              boxSize="60px"
                              borderRadius="8px"
                            />
                          )}
                        </HStack>
                      )}

                      <HStack spacing={3}>
                        <Button
                          bg="#16a34a"
                          color="white"
                          borderRadius="full"
                          fontWeight="700"
                          isLoading={updating}
                          loadingText="Submitting..."
                          _hover={{ bg: "#15803d" }}
                          onClick={handleUserResponseSubmit}
                        >
                          Submit Response
                        </Button>
                        <Button
                          variant="outline"
                          borderRadius="full"
                          borderColor="gray.200"
                          color="gray.500"
                          onClick={() => setShowResponseForm(false)}
                        >
                          Cancel
                        </Button>
                      </HStack>
                    </VStack>
                  )}
                </Box>
              )}

            {/* ── ASSIGN MODAL ── */}
            <Modal isOpen={isAssignOpen} onClose={onAssignClose} isCentered>
              <ModalOverlay backdropFilter="blur(4px)" />
              <ModalContent borderRadius="16px" overflow="hidden">
                <Box h="3px" bg="#7c3aed" />
                <ModalHeader fontWeight="800" fontSize="lg">
                  Assign Department
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={2}>
                  <Text mb={2} fontSize="sm" color="gray.500">
                    Select the department to handle this ticket
                  </Text>
                  <Select
                    placeholder="Select Department"
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    borderRadius="10px"
                    focusBorderColor="#7c3aed"
                  >
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </Select>
                </ModalBody>
                <ModalFooter gap={2}>
                  <Button
                    variant="ghost"
                    onClick={onAssignClose}
                    borderRadius="full"
                  >
                    Cancel
                  </Button>
                  <Button
                    bg="#7c3aed"
                    color="white"
                    borderRadius="full"
                    fontWeight="700"
                    isLoading={loading}
                    onClick={handleAssign}
                    _hover={{ bg: "#6d28d9" }}
                  >
                    Assign
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            {/* ── UPDATE MODAL ── */}
            <Modal
              isOpen={isUpdateOpen}
              onClose={onUpdateClose}
              isCentered
              closeOnOverlayClick={false}
            >
              <ModalOverlay backdropFilter="blur(4px)" />
              <ModalContent borderRadius="16px" overflow="hidden">
                <Box h="3px" bg="#16a34a" />
                <ModalHeader fontWeight="800" fontSize="lg">
                  Update Ticket Status
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack spacing={4} align="stretch">
                    <Box>
                      <Text
                        mb={1}
                        fontSize="sm"
                        fontWeight="600"
                        color="gray.600"
                      >
                        Status
                      </Text>
                      <Select
                        placeholder="Select status"
                        value={updateStatus}
                        onChange={(e) => setUpdateStatus(e.target.value)}
                        borderRadius="10px"
                        focusBorderColor="#16a34a"
                      >
                        <option value="In Progress">In Progress</option>
                        <option value="Awaiting User Response">
                          Awaiting User Response
                        </option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </Select>
                    </Box>

                    <Box>
                      <Text
                        mb={1}
                        fontSize="sm"
                        fontWeight="600"
                        color="gray.600"
                      >
                        Remarks
                      </Text>
                      <Textarea
                        placeholder="Add remarks..."
                        value={updateRemarks}
                        onChange={(e) => setUpdateRemarks(e.target.value)}
                        borderRadius="10px"
                        focusBorderColor="#16a34a"
                        fontSize="sm"
                      />
                    </Box>

                    {updateStatus === "In Progress" && (
                      <Box>
                        <Text
                          mb={1}
                          fontSize="sm"
                          fontWeight="600"
                          color="gray.600"
                        >
                          Expected Resolution Date
                        </Text>
                        <Input
                          type="date"
                          value={expectedResolvedDate}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) =>
                            setExpectedResolvedDate(e.target.value)
                          }
                          borderRadius="10px"
                          focusBorderColor="#16a34a"
                        />
                      </Box>
                    )}

                    {updateStatus === "Awaiting User Response" && (
                      <Checkbox
                        isChecked={requireFile}
                        onChange={(e) => setRequireFile(e.target.checked)}
                        colorScheme="orange"
                        fontSize="sm"
                      >
                        Require file upload from user
                      </Checkbox>
                    )}
                  </VStack>
                </ModalBody>
                <ModalFooter gap={2}>
                  <Button
                    variant="ghost"
                    onClick={onUpdateClose}
                    borderRadius="full"
                  >
                    Cancel
                  </Button>
                  <Button
                    bg="#16a34a"
                    color="white"
                    borderRadius="full"
                    fontWeight="700"
                    isLoading={updating}
                    onClick={handleUpdateTicket}
                    _hover={{ bg: "#15803d" }}
                  >
                    Update
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </>
        )}
      </Box>
    </Box>
  );
}
