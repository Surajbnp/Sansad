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
  Flex,
  VStack,
  Divider,
  Badge,
  Link,
  Select,
} from "@chakra-ui/react";
import { useState } from "react";
import styles from "./page.module.css";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useTitle } from "@/hooks/useTitle";

const TICKET_TYPES = [
  "जिला पंचायत / जनपद पंचायत",
  "तहसील से संबंधित कार्य",
  "पुलिस",
  "सड़क / PWD / प्रधानमंत्री ग्रामीण सड़क योजना एवं अन्य सड़क",
  "पुल / ब्रिज संबंधी कार्य",
  "नगर निगम / नगर पालिका / नगर परिषद",
  "कृषि विभाग",
  "खनिज विभाग",
  "महिला एवं बाल विकास विभाग",
  "शिक्षा विभाग",
  "आदिम जाति कल्याण विभाग",
  "सामाजिक न्याय एवं दिव्यांगजन सशक्तिकरण विभाग",
  "स्वास्थ्य विभाग",
  "आबकारी विभाग",
  "खाद्य विभाग",
  "वन विभाग",
  "जल विभाग (PHE)",
  "विद्युत विभाग",
  "रेलवे विभाग",
  "रोजगार",
  "अन्य (Others)",
];
const TITLE_OPTIONS = [
  "प्रधानमंत्री राहत कोष से सहायता प्रदान करने हेतु आवेदन",
  "सांसद सहायता निधि से आर्थिक सहायता हेतु आवेदन",
  "स्वेच्छानुदान मद से आर्थिक सहायता प्रदान करने हेतु आवेदन",
  "आकस्मिक मृत्यु होने पर आर्थिक सहायता हेतु आवेदन",
  "बिजली का खंभा लगवाने हेतु आवेदन",
  "बिजली ट्रांसफार्मर लगवाने हेतु आवेदन",
  "बिजली बिल संबंधी समस्या के निराकरण हेतु आवेदन",
  "पेयजल समस्या के निराकरण हेतु आवेदन",
  "हैंडपंप स्थापना / मरम्मत हेतु आवेदन",
  "नाली निर्माण हेतु आवेदन",
  "सड़क निर्माण / मरम्मत हेतु आवेदन",
  "सीसी रोड निर्माण हेतु आवेदन",
  "स्टॉप डैम निर्माण हेतु आवेदन",
  "पुल / पुलिया निर्माण हेतु आवेदन",
  "स्ट्रीट लाइट लगवाने / मरम्मत हेतु आवेदन",
  "प्रधानमंत्री आवास योजना संबंधी आवेदन",
  "राशन कार्ड बनवाने / संशोधन हेतु आवेदन",
  "बीपीएल (BPL) कार्ड बनवाने हेतु आवेदन",
  "खाद्यान्न पात्रता पर्ची में नाम जोड़ने / संशोधन हेतु आवेदन",
  "आयुष्मान कार्ड बनवाने / सुधार हेतु आवेदन",
  "आधार कार्ड संबंधी समस्या के निराकरण हेतु आवेदन",
  "संबल कार्ड बनवाने / सुधार हेतु आवेदन",
  "वृद्धा पेंशन बनवाने हेतु आवेदन",
  "विधवा पेंशन बनवाने हेतु आवेदन",
  "दिव्यांग पेंशन बनवाने हेतु आवेदन",
  "दिव्यांग उपकरण उपलब्ध कराने हेतु आवेदन",
  "किसान सम्मान निधि संबंधी आवेदन",
  "स्कूल भवन निर्माण / मरम्मत हेतु आवेदन",
  "छात्रवृत्ति संबंधी आवेदन",
  "चिकित्सा सहायता / स्वास्थ्य संबंधी आवेदन",
  "शौचालय निर्माण संबंधी आवेदन",
  "भूमि / राजस्व संबंधी आवेदन",
  "अन्य (Others)",
];
const initialState = {
  title: "",
  otherTitle: "",
  description: "",
  type: "",
  otherType: "",
  fileUrl: "",
};

/* ─── field label ─── */
function FieldLabel({ children, optional = false }) {
  return (
    <Text mb={1} fontSize="sm" fontWeight="600" color="gray.700">
      {children}{" "}
      {optional ? (
        <Text as="span" fontSize="xs" color="gray.400" fontWeight="400">
          (वैकल्पिक)
        </Text>
      ) : (
        <Text as="span" color="red.500">
          *
        </Text>
      )}
    </Text>
  );
}

/* ─── numbered guideline row ─── */
function GuidelineItem({ number, children }) {
  return (
    <Flex gap={3} align="flex-start">
      <Flex
        flexShrink={0}
        w="22px"
        h="22px"
        rounded="full"
        bg="orange.500"
        color="white"
        fontSize="xs"
        fontWeight="700"
        align="center"
        justify="center"
        mt="1px"
      >
        {number}
      </Flex>
      <Text fontSize="sm" color="gray.700" lineHeight="1.6">
        {children}
      </Text>
    </Flex>
  );
}

export default function TicketCreatePage() {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const { user, accessToken } = useAuth();
useTitle("Create Ticket");

  const isOthers = formData.type === "अन्य (Others)";
  const isOtherTitle = formData.title === "अन्य (Others)";

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: false }));
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    const newErrors = {};
  if (!formData.title)
  newErrors.title = "विषय चुनें";

if (
  isOtherTitle &&
  !formData.otherTitle.trim()
)
  newErrors.otherTitle = "कृपया विषय लिखें";
    if (!formData.description.trim()) newErrors.description = "विवरण आवश्यक है";
    if (!formData.type) newErrors.type = "शिकायत का प्रकार चुनें";
    if (isOthers && !formData.otherType.trim())
      newErrors.otherType = "कृपया प्रकार निर्दिष्ट करें";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!validate()) {
      toast({ title: "कृपया सभी आवश्यक फ़ील्ड भरें", status: "error" });
      return;
    }
    setIsLoading(true);
    try {
      const payload = {
     title: isOtherTitle
  ? formData.otherTitle
  : formData.title,
        description: formData.description,
        complaintType: isOthers ? formData.otherType : formData.type,
        fileUrl: formData.fileUrl,
        user: { name: user?.name, userId: user?._id, phone : user?.phone },
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
        duration: 5000,
        isClosable: true,
        position: "bottom-center",
        render: () => (
          <Box
            bg="green.700"
            color="white"
            px={4}
            py={3}
            borderRadius="md"
            boxShadow="lg"
          >
            <Flex align="center" justify="space-between" gap={4}>
              <Text fontWeight="bold">शिकायत सफलतापूर्वक दर्ज की गई</Text>
              <Button
                size="sm"
                colorScheme="whiteAlpha"
                onClick={() => router.push(`/tickets/${result.ticket?._id}`)}
              >
                View Ticket
              </Button>
            </Flex>
          </Box>
        ),
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

  /* ================= IMAGE UPLOAD ================= */
  const handleFileUpload = () => {
    setUploading(true);
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dxwwnettz",
        uploadPreset: "sansadpreset",
        resourceType: "image",
        multiple: false,
        clientAllowedFormats: ["jpg", "jpeg", "png"],
        maxFileSize: 5000000,
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
          setFormData((prev) => ({ ...prev, fileUrl: optimizedUrl }));
          toast({ title: "छवि सफलतापूर्वक अपलोड हुई", status: "success" });
        }
      },
    );
    widget.open();
  };

  const focusStyle = { borderColor: "#fa7602", boxShadow: "0 0 0 1px #fa7602" };

  return (
    <Box
      maxW="640px"
      mx="auto"
      px={{ base: 4, md: 6 }}
      py={8}
      // mt={{ base: 16, md: 20 }}
    >
      {/* ══════════ PAGE HEADER ══════════ */}
      <Box mb={7}>
        <Badge
          bg="orange.50"
          color="orange.600"
          border="1px solid"
          borderColor="orange.200"
          px={3}
          py={1}
          rounded="full"
          fontSize="xs"
          fontWeight="700"
          letterSpacing="wide"
          mb={3}
        >
          मध्य प्रदेश शासन · शिकायत निवारण पोर्टल
        </Badge>
        <Text
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="800"
          color="gray.800"
          lineHeight="1.2"
        >
          नई शिकायत दर्ज करें
        </Text>
        <Text fontSize="sm" color="gray.500" mt={1}>
          सभी{" "}
          <Text as="span" color="red.500" fontWeight="600">
            *
          </Text>{" "}
          चिह्नित फ़ील्ड अनिवार्य हैं
        </Text>
      </Box>

      {/* ══════════ FORM CARD ══════════ */}
      <Box
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        rounded="2xl"
        p={{ base: 5, md: 7 }}
        shadow="sm"
        mb={6}

      >
        <VStack spacing={5} align="stretch">
          {/* TITLE */}
        <FormControl isInvalid={!!errors.title}>
  <FieldLabel>आवेदन / शिकायत का विषय</FieldLabel>

  <Select
    value={formData.title}
    placeholder="— विषय चुनें —"
    onChange={(e) => {
      handleChange("title", e.target.value);

      if (e.target.value !== "अन्य (Others)") {
        setFormData((prev) => ({
          ...prev,
          title: e.target.value,
          otherTitle: "",
        }));
      }
    }}
    bg="gray.50"
    rounded="lg"
    _focus={focusStyle}
  >
    {TITLE_OPTIONS.map((item) => (
      <option key={item} value={item}>
        {item}
      </option>
    ))}
  </Select>

  <FormErrorMessage>
    {errors.title}
  </FormErrorMessage>
</FormControl>

{isOtherTitle && (
  <FormControl isInvalid={!!errors.otherTitle}>
    <FieldLabel>अन्य विषय</FieldLabel>

    <Input
      value={formData.otherTitle}
      onChange={(e) =>
        handleChange("otherTitle", e.target.value)
      }
      placeholder="विषय लिखें"
      bg="gray.50"
      rounded="lg"
      _focus={focusStyle}
    />

    <FormErrorMessage>
      {errors.otherTitle}
    </FormErrorMessage>
  </FormControl>
)}

          {/* TYPE DROPDOWN */}
          <FormControl isInvalid={!!errors.type}>
            <FieldLabel>शिकायत का प्रकार (Type)</FieldLabel>
            <Select
              value={formData.type}
              onChange={(e) => {
                handleChange("type", e.target.value);
                // clear otherType when switching away from Others
                if (e.target.value !== "अन्य (Others)") {
                  setFormData((prev) => ({
                    ...prev,
                    type: e.target.value,
                    otherType: "",
                  }));
                  setErrors((prev) => ({
                    ...prev,
                    type: false,
                    otherType: false,
                  }));
                }
              }}
              placeholder="— विभाग / प्रकार चुनें —"
              bg="gray.50"
              borderColor="gray.200"
              rounded="lg"
              _focus={focusStyle}
              fontSize="sm"
              color={formData.type ? "gray.800" : "gray.400"}
              iconColor="#fa7602"
            >
              {TICKET_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
            <FormErrorMessage fontSize="xs">{errors.type}</FormErrorMessage>
          </FormControl>

          {/* OTHERS — conditional extra input */}
          {isOthers && (
            <FormControl isInvalid={!!errors.otherType}>
              <Flex align="center" gap={2} mb={1}>
                <Box w="3px" h="16px" bg="orange.400" rounded="full" />
                <Text fontSize="sm" fontWeight="600" color="gray.700">
                  प्रकार निर्दिष्ट करें{" "}
                  <Text as="span" color="red.500">
                    *
                  </Text>
                </Text>
              </Flex>
              <Input
                value={formData.otherType}
                onChange={(e) => handleChange("otherType", e.target.value)}
                placeholder="अधिकतम 25 अक्षर"
                bg="orange.50"
                borderColor="orange.200"
                rounded="lg"
                _focus={focusStyle}
                fontSize="sm"
                maxLength={25}
              />
              <Flex justify="space-between" align="center" mt={1}>
                <FormErrorMessage fontSize="xs" mt={0}>
                  {errors.otherType}
                </FormErrorMessage>
                <Text
                  fontSize="xs"
                  color={
                    formData.otherType.length >= 12 ? "red.400" : "gray.400"
                  }
                  ml="auto"
                >
                  {formData.otherType.length} / 12
                </Text>
              </Flex>
            </FormControl>
          )}

          {/* DESCRIPTION */}
          <FormControl isInvalid={!!errors.description}>
            <FieldLabel>विवरण (Description)</FieldLabel>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="समस्या का विस्तृत विवरण दें (स्थान, विभाग, तिथि आदि)"
              bg="gray.50"
              borderColor="gray.200"
              rounded="lg"
              _focus={focusStyle}
              fontSize="sm"
              rows={4}
              resize="vertical"
            />
            <FormErrorMessage fontSize="xs">
              {errors.description}
            </FormErrorMessage>
          </FormControl>

          {/* IMAGE UPLOAD */}
          <FormControl>
            <FieldLabel optional>
              समर्थन दस्तावेज़ — JPG / PNG, max 5 MB
            </FieldLabel>
            <HStack spacing={4} align="center">
              <Button
                onClick={handleFileUpload}
                bg="#186808"
                color="white"
                size="sm"
                rounded="lg"
                px={5}
                fontWeight="600"
                _hover={{ bg: "#e06800" }}
                isLoading={uploading}
                loadingText="अपलोड हो रहा है…"
              >
                📎 Image Upload करें
              </Button>
              {formData.fileUrl && (
                <Image
                  src={formData.fileUrl}
                  alt="Uploaded"
                  boxSize="64px"
                  objectFit="cover"
                  borderRadius="lg"
                  border="2px solid #fa7602"
                />
              )}
            </HStack>
          </FormControl>

          <Divider borderColor="gray.100" />

          {/* SUBMIT */}
          <Button
            w="100%"
            bg="#fa7602"
            color="white"
            rounded="xl"
            h="48px"
            fontSize="md"
            fontWeight="700"
            _hover={{
              bg: "#e06800",
              transform: "translateY(-1px)",
              shadow: "md",
            }}
            _active={{ transform: "translateY(0)" }}
            transition="all 0.2s"
            onClick={handleSubmit}
            isDisabled={isLoading}
          >
            {isLoading ? <Spinner size="sm" /> : "✅  शिकायत दर्ज करें"}
          </Button>
        </VStack>
      </Box>

      {/* ══════════ INFO / GUIDELINES CARD ══════════ */}
      <Box
        bg="orange.50"
        border="1px solid"
        borderColor="orange.200"
        rounded="2xl"
        overflow="hidden"
        shadow="sm"
      >
        <Box bg="#fa7602" px={5} py={3}>
          <Text
            fontWeight="800"
            color="white"
            fontSize="sm"
            letterSpacing="wide"
          >
            📋 सामान्य जानकारी
          </Text>
        </Box>

        <Box px={5} py={5}>
          <Text fontSize="sm" color="gray.700" lineHeight="1.75" mb={4}>
            मध्य प्रदेश शासन के शिकायत निवारण पोर्टल में आपका स्वागत है। यह मंच
            नागरिकों को अपनी शिकायतें सरल और पारदर्शी तरीके से दर्ज करने तथा
            उनकी स्थिति जानने की सुविधा प्रदान करता है।
          </Text>

          <Flex align="center" gap={2} mb={3}>
            <Box w="3px" h="18px" bg="orange.500" rounded="full" />
            <Text fontSize="sm" fontWeight="700" color="orange.700">
              कृपया ध्यान दें:
            </Text>
          </Flex>

          <VStack spacing={3} align="stretch" mb={5}>
            <GuidelineItem number={1}>
              सही और पूर्ण जानकारी ही दर्ज करें।
            </GuidelineItem>
            <GuidelineItem number={2}>
              एक ही विषय पर बार-बार शिकायत दर्ज न करें।
            </GuidelineItem>
            <GuidelineItem number={3}>
              समस्या का स्पष्ट विवरण दें (स्थान, विभाग, तिथि आदि)।
            </GuidelineItem>
            <GuidelineItem number={4}>
              आवश्यक हो तो संबंधित दस्तावेज़ संलग्न करें।
            </GuidelineItem>
            <GuidelineItem number={5}>
              गलत या भ्रामक जानकारी वाली शिकायतें निरस्त की जा सकती हैं।
            </GuidelineItem>
            <GuidelineItem number={6}>
              शिकायत दर्ज होने के बाद आपको एक{" "}
              <Text as="span" fontWeight="700" color="orange.700">
                रेफरेंस नंबर
              </Text>{" "}
              मिलेगा, जिससे आप स्थिति ट्रैक कर सकते हैं।
            </GuidelineItem>
          </VStack>

          {/* <Divider borderColor="orange.200" mb={4} /> */}

          {/* Medical CTA */}
          {/* <Box
            bg="white"
            border="1px solid"
            borderColor="red.200"
            rounded="xl"
            p={4}
          >
            <Flex gap={3} align="flex-start">
              <Text fontSize="xl" flexShrink={0}>
                🏥
              </Text>
              <Box>
                <Text fontSize="sm" fontWeight="700" color="red.700" mb={1}>
                  मेडिकल सहायता हेतु अतिरिक्त फॉर्म
                </Text>
                <Text fontSize="xs" color="gray.600" lineHeight="1.6" mb={3}>
                  अगर आप मेडिकल संबन्धित सहायता हेतु संपर्क कर रहे हैं तो साथ ही
                  निम्न फॉर्म भी अवश्य भरें ताकि त्वरित कार्यवाही की जा सके:
                </Text>
                <Link
                  href="https://google.forms"
                  isExternal
                  display="inline-flex"
                  alignItems="center"
                  gap={2}
                  bg="red.600"
                  color="white"
                  px={4}
                  py={2}
                  rounded="lg"
                  fontSize="xs"
                  fontWeight="700"
                  _hover={{ bg: "red.700", textDecoration: "none" }}
                  transition="all 0.2s"
                >
                  मेडिकल फॉर्म भरें →
                </Link>
              </Box>
            </Flex>
          </Box> */}
        </Box>
      </Box>
    </Box>
  );
}
