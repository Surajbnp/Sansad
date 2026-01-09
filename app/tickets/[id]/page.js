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
  SkeletonCircle,
  SkeletonText,
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
import { set } from "nprogress";

export default function TicketDetailsPage() {
  const [ticket, setTicket] = useState(null);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [updateStatus, setUpdateStatus] = useState("");
  const [updateRemarks, setUpdateRemarks] = useState("");
  const [requireFile, setRequireFile] = useState(false);
  const [expectedResolvedDate, setExpectedResolvedDate] = useState("");
  const [updating, setUpdating] = useState(false);
  const [fileUrl, setFileUrl] = useState("");

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
  const { accessToken, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchTicket = async () => {
    try {
      const res = await fetch(`/api/ticket/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: accessToken,
        },
      });
      const data = await res.json();
      setTicket(data.ticket);
    } catch (err) {
      console.error("Error fetching ticket:", err);
    }
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch(`/api/departments/get`, {
          headers: { authorization: accessToken },
        });
        const data = await res.json();
        setDepartments(data.departments || []);
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    };

    if (id && user?.role !== "User") {
      fetchDepartments();
    }

    fetchTicket();
  }, [id, accessToken]);

  const handleAssign = async () => {
    setLoading(true);
    if (selectedDept === "") {
      toast({
        title: "Please select a department",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    try {
      const payload = {
        status: "Assigned",
        remarks: `Assigned to ${selectedDept} department`,
        ...(selectedFile && { fileUrl: selectedFile }),
        assignedDept: selectedDept,
      };

      const res = await fetch(`/api/ticket/${id}/assign`, {
        method: "PATCH",
        headers: {
          authorization: accessToken,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Ticket updated:", data);
      toast({
        title: data.message || "Assigned Success!",
        description: data?.to,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // reset UI
      setShowResponseForm(false);
      setResponseText("");
      setSelectedFile(null);
      setLoading(false);
      onAssignClose();
      fetchTicket();
    } catch (error) {
      setLoading(false);
      console.error("Error updating ticket:", error);
    }
  };

  const handleUpdateTicket = async () => {
    if (!updateStatus) {
      toast({
        title: "Please select status",
        status: "warning",
        duration: 3000,
      });
      return;
    }
    // In Progress → expected resolved date is mandatory
    if (updateStatus === "In Progress" && !expectedResolvedDate) {
      toast({
        title: "Expected resolved date required",
        description:
          "Please select expected resolved date for In Progress status",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    try {
      setUpdating(true);

      const payload = {
        status: updateStatus,
        remarks: updateRemarks,

        // File requirement is OPTIONAL
        fileRequired:
          updateStatus === "Awaiting User Response" ? requireFile : false,

        // Expected date ONLY for In Progress
        expectedResolvedDate:
          updateStatus === "In Progress" ? expectedResolvedDate : null,
      };

      const res = await fetch(`/api/ticket/${id}/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: accessToken,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      toast({
        title: data.message || "Ticket updated",
        status: "success",
        duration: 3000,
      });

      // reset
      onUpdateClose();
      setUpdateStatus("");
      setUpdateRemarks("");
      setRequireFile(false);
      setExpectedResolvedDate("");
      fetchTicket();
    } catch (err) {
      toast({
        title: err.message || "Update failed",
        status: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleUserResponseSubmit = async () => {
    // Text is mandatory
    if (!responseText.trim()) {
      toast({
        title: "Please enter your response",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    // File required ONLY if admin requested it
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

    try {
      setUpdating(true);

      const payload = {
        remarks: responseText,
        ...(fileUrl && { fileUrl }),
      };

      const res = await fetch(`/api/ticket/${id}/respond`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: accessToken,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Submission failed");
      }

      toast({
        title: data.message || "Response submitted successfully",
        status: "success",
        duration: 3000,
      });

      // ✅ reset UI
      setResponseText("");
      setFileUrl(null);
      setShowResponseForm(false);
      fetchTicket();
    } catch (err) {
      toast({
        title: err.message || "Submission failed",
        status: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  // Image Upload Handler
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
        transformation: [
          {
            width: 1280,
            height: 1280,
            crop: "limit",
            quality: "auto:eco",
            fetch_format: "auto",
          },
        ],
        folder: "tickets",
        showAdvancedOptions: false,
        cropping: false,
        sources: ["local", "camera"],
      },
      (error, result) => {
        setUploading(false);

        if (error) {
          toast({ title: "छवि अपलोड विफल", status: "error" });
          return;
        }

        if (result.event === "success") {
          const { public_id, format } = result.info;
          const optimizedUrl = `https://res.cloudinary.com/dxwwnettz/image/upload/w_1280,h_1280,c_limit,q_auto:eco,f_auto/${public_id}.${format}`;

          setFileUrl(optimizedUrl);

          toast({ title: "छवि सफलतापूर्वक अपलोड हुई", status: "success" });
        }
      }
    );

    widget.open();
  };

  console.log(ticket)

  return (
    <Box
      className={styles.container}
      pb={"80px"}
      maxW="800px"
      minH={"70vh"}
      mx="auto"
      px={4}
      py={8}
      mb={16}
    >
      {!ticket ? (
        <Box m={" auto"} maxW={"800px"} minH={"70vh"}>
          <SkeletonCircle size="10" />
          <SkeletonText mt="4" noOfLines={10} spacing="4" />
        </Box>
      ) : (
        <>
          <Box
            mb={6}
            p={4}
            boxShadow={
              " rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px"
            }
            borderRadius="md"
          >
            <Flex
              flexDir={{ base: "column-reverse", md: "row" }}
              align={{ base: "start", md: "center" }}
              justify={{ base: "start", md: "space-between" }}
            >
              <Text fontSize="sm" mt={2} color="gray.500">
                #Id: {ticket._id}
              </Text>
              <Flex gap={4}>
                <Badge
                  fontStyle={"italic"}
                  colorScheme={
                    ticket.status === "Resolved" ? "green" : "orange"
                  }
                >
                  {ticket.status}
                </Badge>
                {ticket?.assignedDept !== null && (
                  <Badge fontStyle={"italic"} colorScheme={"purple"}>
                    {ticket?.assignedDept}
                  </Badge>
                )}
              </Flex>
            </Flex>

            <Text fontSize="2xl" textTransform={"capitalize"} fontWeight="bold">
              {ticket.title}
            </Text>
            <Text color="gray.600" mt={2}>
              {ticket.description}
            </Text>
            {ticket.fileUrl && (
              <Box mt={4}>
                <Text fontSize="sm" fontWeight="medium" mb={1}>
                  Attached File:
                </Text>
                <Image
                  src={ticket.fileUrl}
                  alt="Ticket Attachment"
                  maxH="200px"
                  borderRadius="md"
                  onClick={() => {
                    setPreviewImage(ticket.fileUrl);
                    setPreviewOpen(true);
                  }}
                  cursor={"pointer"}
                />

                {/* Image Preview Modal */}
                <ImagePreviewModal
                  isOpen={previewOpen}
                  onClose={() => setPreviewOpen(false)}
                  imageUrl={previewImage}
                />
              </Box>
            )}
            <HStack spacing={4} mt={4}>
              <Badge colorScheme="blue">{ticket?.assignedDept?.name}</Badge>
            </HStack>
            <Flex
              flexDir={{ base: "column", md: "row" }}
              align={{ base: "start", md: "center" }}
              justify={"space-between"}
              lineHeight={1}
            >
              <Text fontSize="sm" mt={2} color="gray.900">
                Created by: {ticket?.user?.name}
              </Text>
              <Text fontSize="sm" mt={2} color="gray.900">
                Expected Resolution Date :{" "}
                {ticket?.statusHistory[ticket.statusHistory.length - 1]
                  ?.expectedResolvedDate
                  ? new Date(
                      ticket.statusHistory[
                        ticket.statusHistory.length - 1
                      ].expectedResolvedDate
                    ).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A"}
              </Text>
            </Flex>

            {/* Admin Assign Button */}
            {user?.role === "Admin" && ticket?.status === "Submitted" && (
              <Button mr={4} mt={4} colorScheme="purple" onClick={onAssignOpen}>
                Assign
              </Button>
            )}
            {(user?.role === "Admin" || user?.role === "Department") && (
              <Button mt={4} colorScheme="green" onClick={onUpdateOpen}>
                Update
              </Button>
            )}
          </Box>

          {/* Timeline */}
          <Box>
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Status Timeline
            </Text>
            <VStack align="start" spacing={6} position="relative" ml={4}>
              <Box
                position="absolute"
                left="-8px"
                top="0"
                bottom="0"
                w="2px"
                borderLeft={"4px dotted"}
                borderColor={"gray.600"}
              />

              {ticket?.statusHistory?.map((item, index) => (
                <Flex key={index} align="flex-start" position="relative">
                  <Box position="absolute" left="-16px" mt={1} bg={"white"}>
                    <Icon
                      as={
                        index === ticket.statusHistory.length - 1
                          ? TimeIcon
                          : CheckCircleIcon
                      }
                      color={
                        index === ticket.statusHistory.length - 1
                          ? "orange.400"
                          : "green.500"
                      }
                      boxSize={5}
                    />
                  </Box>

                  <Box pl={8}>
                    {item.remarks && (
                      <Text fontWeight="bold">{item.remarks}</Text>
                    )}
                    <Text fontSize="sm" color="gray.500">
                      {new Date(item.date).toLocaleString()}
                    </Text>
                    {item?.fileUrl && (
                      <Box
                        my={3}
                        w={{ base: "100%", md: "200px" }}
                      >
                       <Image src={item?.fileUrl} alt={'image'} />
                      </Box>
                    )}
                    <HStack mt={1}>
                      <Text fontStyle={"italic"}>By: </Text>
                      <Avatar size="xs" name={item?.updatedBy?.name} />
                      <Text fontStyle={"italic"} fontSize="sm">{`${
                        item?.updatedBy?.userId === user?.userId
                          ? "You"
                          : item?.updatedBy?.name
                      } (${item?.updatedBy?.role})`}</Text>
                    </HStack>
                  </Box>
                </Flex>
              ))}
            </VStack>
          </Box>

          {ticket.status === "Awaiting User Response" &&
            user?.role === "User" && (
              <Box mt={6}>
                {!showResponseForm ? (
                  <Button
                    colorScheme="blue"
                    onClick={() => setShowResponseForm(true)}
                  >
                    Respond Ticket
                  </Button>
                ) : (
                  <Box>
                    <Textarea
                      placeholder="Enter additional details..."
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                    />
                    {ticket?.status === "Awaiting User Response" &&
                      ticket?.statusHistory[ticket?.statusHistory.length - 1]
                        ?.fileRequired && (
                        <HStack mt={2} align="center" gap={4}>
                          <Button
                            my={4}
                            onClick={handleFileUpload}
                            bg="#fa7602"
                            color="white"
                            _hover={{
                              bg: "white",
                              color: "#fa7602",
                              outline: "2px solid #fa7602",
                            }}
                            isLoading={uploading}
                          >
                            Upload Image
                          </Button>
                          {fileUrl && (
                            <Image
                              src={fileUrl}
                              alt="Uploaded"
                              boxSize="80px"
                              borderRadius="md"
                            />
                          )}
                        </HStack>
                      )}

                    <HStack mt={2} gap={4}>
                      <Button
                        colorScheme="green"
                        onClick={handleUserResponseSubmit}
                      >
                        {updating ? <Spinner /> : "Submit Response"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowResponseForm(false)}
                      >
                        Cancel
                      </Button>
                    </HStack>
                  </Box>
                )}
              </Box>
            )}

          {/* Assign Modal */}
          <Modal isOpen={isAssignOpen} onClose={onAssignClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Assign Ticket</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Box>
                  <Text mb={1} color="gray.600">
                    Select Department
                  </Text>
                  <Select
                    placeholder="Select Department"
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                  >
                    {departments.map((dept) => (
                      <option
                        style={{ textDecoration: "capitalize" }}
                        key={dept._id}
                        value={dept.name}
                      >
                        {dept.name}
                      </option>
                    ))}
                  </Select>
                </Box>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" onClick={onAssignClose}>
                  Cancel
                </Button>
                <Button colorScheme="purple" ml={3} onClick={handleAssign}>
                  {loading ? <Spinner /> : "Assign"}
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* ================= UPDATE MODAL ================= */}
          <Modal
            isOpen={isUpdateOpen}
            onClose={onUpdateClose}
            isCentered
            closeOnOverlayClick={false}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Update Ticket</ModalHeader>
              <ModalCloseButton />

              <ModalBody>
                {/* Status */}
                <Box mb={4}>
                  <Text mb={1} color="gray.600">
                    Update Status
                  </Text>
                  <Select
                    placeholder="Select status"
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value)}
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Awaiting User Response">
                      Awaiting User Response
                    </option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </Select>
                </Box>
                {/* Remarks */}
                <Box mb={4}>
                  <Text mb={1} color="gray.600">
                    Remarks
                  </Text>
                  <Textarea
                    placeholder="Add remarks"
                    value={updateRemarks}
                    onChange={(e) => setUpdateRemarks(e.target.value)}
                  />
                </Box>
                {/* Expected Resolved Date */}
                {updateStatus === "In Progress" && (
                  <Box mb={4}>
                    <Text mb={1} color="gray.600">
                      Expected Resolved Date
                    </Text>
                    <Input
                      type="date"
                      value={expectedResolvedDate}
                      min={new Date().toISOString().split("T")[0]} // ⛔ past dates
                      onChange={(e) => setExpectedResolvedDate(e.target.value)}
                    />
                  </Box>
                )}
                {/* File Required Checkbox */}
                <HStack>
                  {updateStatus === "Awaiting User Response" && (
                    <Checkbox
                      checked={requireFile}
                      onChange={(e) => setRequireFile(e.target.checked)}
                    >
                      Require file from user
                    </Checkbox>
                  )}
                </HStack>
              </ModalBody>

              <ModalFooter>
                <Button variant="ghost" onClick={onUpdateClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="green"
                  ml={3}
                  onClick={handleUpdateTicket}
                  isLoading={updating}
                >
                  Update
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </Box>
  );
}
