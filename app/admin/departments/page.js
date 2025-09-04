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
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useAuth } from "@/context/AuthContext";

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newDepName, setNewDepName] = useState("");
  const [assignedName, setAssignedName] = useState("");
  const [assignedEmail, setAssignedEmail] = useState("");
  const [assignedPassword, setAssignedPassword] = useState("");
  const [assignedContact, setAssignedContact] = useState("");
  const toast = useToast();
  const { accessToken } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const res = await fetch("/api/departments/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: accessToken,
        },
      });
      const data = await res.json();

      if (data.success) {
        setDepartments(data.departments);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to load departments",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Create department
  const handleCreate = async () => {
    setLoading(true);
    if (
      !newDepName.trim() ||
      /\s/.test(newDepName) ||
      !assignedName ||
      !assignedEmail ||
      !assignedPassword
    ) {
      toast({
        title: "Validation Error",
        description:
          "Please fill all required fields (No spaces in Department Name)",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    try {
      const res = await fetch("/api/departments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: accessToken,
        },
        body: JSON.stringify({
          name: newDepName,
          assignedTo: {
            name: assignedName,
            email: assignedEmail,
            password: assignedPassword,
            contact: assignedContact || null,
          },
        }),
      });

      const data = await res.json();

      if (data.success) {
        setLoading(false);
        toast({
          title: "Department Created",
          description: `${data.department.name} created successfully`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setNewDepName("");
        setAssignedName("");
        setAssignedEmail("");
        setAssignedPassword("");
        setAssignedContact("");
        onClose();
        fetchDepartments(); // refresh list
      } else {
        setLoading(false);
        toast({
          title: "Error",
          description: data.message || "Failed to create department",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast({
        title: "Error",
        description: "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box className={styles.container} px={4} py={{ base: 4, md: 8 }}>
      {/* Header with Create Button */}
      <Flex justify="space-between" align="center" mb={6}>
        <Text fontSize="2xl" fontWeight="bold">
          Departments
        </Text>
        <Button leftIcon={<AddIcon />} colorScheme="purple" onClick={onOpen}>
          Create
        </Button>
      </Flex>

      {/* Department List */}
      {loading ? (
        <VStack spacing={4} align="stretch">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} height="50px" borderRadius="md" />
          ))}
        </VStack>
      ) : departments.length > 0 ? (
        <VStack spacing={4} align="stretch">
          {departments.map((dep) => (
            <Box
              key={dep._id}
              p={4}
              border="1px solid #e2e8f0"
              borderRadius="md"
              bg="white"
              boxShadow="sm"
            >
              <Text fontWeight="medium">{dep.name}</Text>
              <Text fontSize="sm" color="gray.500">
                #ID: {dep._id}
              </Text>
              {dep.assignedTo && (
                <Text fontSize="sm" color="gray.600">
                  Assigned: {dep.assignedTo.name} ({dep.assignedTo.email})
                </Text>
              )}
            </Box>
          ))}
        </VStack>
      ) : (
        <Text>No departments found.</Text>
      )}

      {/* Department Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Department</ModalHeader>
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Department Name</FormLabel>
              <Input
                placeholder="Enter department name"
                value={newDepName}
                onChange={(e) => setNewDepName(e.target.value)}
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Staff Name</FormLabel>
              <Input
                placeholder="Enter name"
                value={assignedName}
                onChange={(e) => setAssignedName(e.target.value)}
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Staff Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter email"
                value={assignedEmail}
                onChange={(e) => setAssignedEmail(e.target.value)}
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter password"
                value={assignedPassword}
                onChange={(e) => setAssignedPassword(e.target.value)}
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Staff Contact (optional)</FormLabel>
              <Input
                type="number"
                placeholder="Enter contact number"
                value={assignedContact}
                onChange={(e) => setAssignedContact(e.target.value)}
              />
            </FormControl>

            <FormLabel my={2} fontSize={"12px"} color={"red"}>
              Note - Once created, department name can't be modified or deleted
            </FormLabel>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="purple" onClick={handleCreate}>
              {loading ? <Spinner /> : "Create"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DepartmentsPage;
