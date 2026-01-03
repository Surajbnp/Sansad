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
} from "@chakra-ui/react";
import { CheckCircleIcon, TimeIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ImagePreviewModal from "@/components/ImagePreviewModal";

export default function TicketDetailsPage() {
  const [ticket, setTicket] = useState(null);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");
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

    if (id) {
      fetchTicket();
      fetchDepartments();
    }
  }, [id, accessToken]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      toast({
        title: "File too large",
        description: "File must be under 500 KB",
        status: "error",
        duration: 3000,
      });
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleAssign = async () => {
    setLoading(true);
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
            <Text fontSize="sm" mt={2} color="gray.500">
              Created by: {ticket?.user?.name}
            </Text>

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
                    {/* <Text fontWeight="bold">{item.status}</Text> */}
                    {item.remarks && (
                      <Text fontWeight="bold">{item.remarks}</Text>
                    )}
                    <Text fontSize="sm" color="gray.500">
                      {new Date(item.date).toLocaleString()}
                    </Text>
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

          {ticket.status === "Awaiting User Response" && (
            <Box mt={6}>
              {!showResponseForm ? (
                <Button
                  colorScheme="blue"
                  onClick={() => setShowResponseForm(true)}
                >
                  Provide Additional Details
                </Button>
              ) : (
                <Box>
                  <Textarea
                    placeholder="Enter additional details..."
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                  />
                  <Input
                    type="file"
                    accept="image/*"
                    mt={3}
                    onChange={handleFileChange}
                  />
                  <HStack mt={2}>
                    <Button colorScheme="green">Submit</Button>
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
                      <option key={dept._id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </Select>
                </Box>
                {/* <Box mt={4}>
                  <Text mb={1} color="gray.600">
                    Remarks{" "}
                    <Text as="span" fontStyle="italic" color="gray.500">
                      (optional)
                    </Text>
                  </Text>

                  <Input
                    onChange={(e) => setRemarks(e?.target?.value)}
                    placeholder={"Add remarks"}
                  />
                </Box> */}
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
        </>
      )}
    </Box>
  );
}

/*

 setTicket((prev) => ({
        ...prev,
        status: "User Responded",
        fileUrl: selectedFile
          ? URL.createObjectURL(selectedFile)
          : prev.fileUrl,
        statusHistory: [
          ...prev.statusHistory,
          {
            status: "User Responded",
            updatedBy: { name: user?.name || "User" },
            date: new Date().toISOString(),
            note: responseText,
          },
        ],
      }));

*/
