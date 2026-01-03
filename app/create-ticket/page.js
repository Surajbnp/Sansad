"use client";

import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Textarea,
  Text,
  useToast,
  Spinner,
  HStack,
  Image,
} from "@chakra-ui/react";
import { useState } from "react";
import styles from "./page.module.css";
import { useAuth } from "@/context/AuthContext";

const initialState = {
  title: "",
  description: "",
  mobile: "",
  fileUrl: "",
};

export default function TicketCreatePage() {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const toast = useToast();
  const { user, accessToken } = useAuth();

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
    setErrors({ ...errors, [key]: false });
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim())
      newErrors.title = "शीर्षक आवश्यक है";

    if (!formData.description.trim())
      newErrors.description = "विवरण आवश्यक है";

    if (!formData.mobile)
      newErrors.mobile = "मोबाइल नंबर आवश्यक है";
    else if (!/^\d{10}$/.test(formData.mobile))
      newErrors.mobile = "मोबाइल नंबर 10 अंकों का होना चाहिए";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!validate()) {
      toast({
        title: "कृपया सभी आवश्यक फ़ील्ड भरें",
        status: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        user: {
          name: user?.name,
          userId: user?.userId,
        },
      };

      const response = await fetch("/api/ticket/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      toast({
        title: "शिकायत सफलतापूर्वक दर्ज की गई",
        status: "success",
      });

      setFormData(initialState);
    } catch (err) {
      toast({
        title: "शिकायत दर्ज करने में असफल",
        description: err.message,
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= IMAGE UPLOAD (OPTIONAL) ================= */
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

          setFormData((prev) => ({
            ...prev,
            fileUrl: optimizedUrl,
          }));

          toast({ title: "छवि सफलतापूर्वक अपलोड हुई", status: "success" });
        }
      }
    );

    widget.open();
  };

  return (
    <Box className={styles.container} p={6} maxW="600px" mx="auto">
      <Text fontSize="2xl" mb={6} fontWeight="bold">
        नई शिकायत दर्ज करें
      </Text>

      {/* ===== TITLE ===== */}
      <FormControl isInvalid={errors.title} mb={4}>
        <Text mb={1}>
          शीर्षक (Title) <Text as="span" color="red">*</Text>
        </Text>
        <Input
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          bg="gray.50"
          borderColor="gray.300"
          _focus={{
            borderColor: "#fa7602",
            boxShadow: "0 0 0 1px #fa7602",
          }}
        />
        <FormErrorMessage>{errors.title}</FormErrorMessage>
      </FormControl>

      {/* ===== DESCRIPTION ===== */}
      <FormControl isInvalid={errors.description} mb={4}>
        <Text mb={1}>
          विवरण (Description) <Text as="span" color="red">*</Text>
        </Text>
        <Textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          bg="gray.50"
          borderColor="gray.300"
          _focus={{
            borderColor: "#fa7602",
            boxShadow: "0 0 0 1px #fa7602",
          }}
        />
        <FormErrorMessage>{errors.description}</FormErrorMessage>
      </FormControl>

      {/* ===== MOBILE ===== */}
      <FormControl isInvalid={errors.mobile} mb={4}>
        <Text mb={1}>
          मोबाइल नंबर (Mobile Number) <Text as="span" color="red">*</Text>
        </Text>
        <Input
          value={formData.mobile}
          onChange={(e) => handleChange("mobile", e.target.value)}
          bg="gray.50"
          borderColor="gray.300"
          _focus={{
            borderColor: "#fa7602",
            boxShadow: "0 0 0 1px #fa7602",
          }}
        />
        <FormErrorMessage>{errors.mobile}</FormErrorMessage>
      </FormControl>

      {/* ===== IMAGE UPLOAD ===== */}
      <FormControl mb={6}>
        <Text mb={2}>समर्थन दस्तावेज़ (Image - optional)</Text>

        <HStack spacing={4}>
          <Button
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

          {formData.fileUrl && (
            <Image
              src={formData.fileUrl}
              alt="Uploaded"
              boxSize="80px"
              objectFit="cover"
              borderRadius="md"
              border="1px solid #fa7602"
            />
          )}
        </HStack>
      </FormControl>

      {/* ===== SUBMIT ===== */}
      <Button
        w="100%"
        bg="#fa7602"
        color="white"
        _hover={{
          bg: "white",
          color: "#fa7602",
          outline: "2px solid #fa7602",
        }}
        onClick={handleSubmit}
        isDisabled={isLoading}
      >
        {isLoading ? <Spinner size="sm" /> : "Submit Complaint"}
      </Button>
    </Box>
  );
}
