"use client";

import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Select,
  Textarea,
  Text,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import styles from "./page.module.css";
import { useAuth } from "@/context/AuthContext";

const initialState = {
  title: "",
  description: "",
  assignedDept: "",
};

export default function TicketCreatePage() {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { user, accessToken } = useAuth();

  // const departments = [
  //   { id: "dep1", name: "IT Support" },
  //   { id: "dep2", name: "Maintenance" },
  //   { id: "dep3", name: "HR" },
  // ];

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
    setErrors({ ...errors, [key]: false });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    // if (!formData.assignedDept)
    //   newErrors.assignedDept = "Please select a department";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      toast({
        title: "Please fix the errors",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        user: { name: user?.name, userId: user?.userId },
        fileUrl: formData.file ? formData.file.name : null,
      };

      console.log(payload);

      const response = await fetch("/api/ticket/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        toast({
          title: "Ticket created successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setFormData(initialState);
      } else {
        toast({
          title: "Failed to create ticket",
          description: result.message || "",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: "Server error",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className={styles.container} p={6} maxW="600px" mx="auto">
      <Text fontSize="2xl" mb={6} fontWeight="bold">
        Raise a New Complaint
      </Text>
      {/* Title */}
      <FormControl isInvalid={errors.title} mb={4}>
        <Input
          placeholder="Ticket Title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
        <FormErrorMessage>{errors.title}</FormErrorMessage>
      </FormControl>

      {/* Description */}
      <FormControl isInvalid={errors.description} mb={4}>
        <Textarea
          placeholder="Describe your issue"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
        <FormErrorMessage>{errors.description}</FormErrorMessage>
      </FormControl>

      {/* Department */}
      {/* <FormControl isInvalid={errors.assignedDept} mb={4}>
        <Select
          placeholder="Select Department"
          value={formData.assignedDept}
          onChange={(e) => handleChange("assignedDept", e.target.value)}
        >
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{errors.assignedDept}</FormErrorMessage>
      </FormControl> */}

      {/* File Upload */}
      <FormControl mb={4}>
        <Input
          type="file"
          onChange={(e) => handleChange("file", e.target.files[0])}
        />
      </FormControl>

      <Button
        mt={8}
        onClick={handleSubmit}
        bg="#fa7602"
        color="white"
        _hover={{ bg: "white", color: "#fa7602", outline: "2px solid #fa7602" }}
        isDisabled={isLoading}
      >
        {isLoading ? <Spinner size="sm" /> : "Submit Ticket"}
      </Button>
    </Box>
  );
}
