"use client";

import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";
import { useTitle } from "@/hooks/useTitle";

export default function PrivacyPolicy() {
  useTitle("गोपनीयता नीति | सांसद सुविधा केंद्र");

  return (
    <Box py={{ base: 12, md: 20 }} bg="gray.50">
      <Container maxW="4xl">
        <VStack align="start" spacing={8}>

          <Heading
            size="2xl"
            color="#8B5A2B"
            className="hindiText"
          >
            गोपनीयता नीति
          </Heading>

          <Text className="hindiText" color="gray.700" lineHeight="2">
            <strong>सांसद सुविधा केंद्र</strong> की आधिकारिक वेबसाइट
            <strong> www.ssksatna.com </strong>
            पर आपका स्वागत है।
            यह वेबसाइट <strong>माननीय सांसद श्री गणेश सिंह जी</strong> द्वारा
            सतना-मैहर लोकसभा क्षेत्र के नागरिकों को जनसेवा, शिकायत पंजीकरण,
            सरकारी योजनाओं की जानकारी तथा जनसुविधाओं से संबंधित सेवाएं उपलब्ध
            कराने के उद्देश्य से संचालित की जाती है।
          </Text>

          <Box>
            <Heading size="md" mb={3} className="hindiText">
              1. जानकारी का संग्रह
            </Heading>

            <Text color="gray.700" lineHeight="2" className="hindiText">
              शिकायत दर्ज करने अथवा सेवाओं का उपयोग करने के दौरान आपका नाम,
              मोबाइल नंबर, ईमेल पता, पता तथा अन्य आवश्यक जानकारी प्राप्त की जा
              सकती है। यह जानकारी केवल सेवाएं प्रदान करने एवं शिकायतों के
              निराकरण के उद्देश्य से उपयोग की जाती है।
            </Text>
          </Box>

          <Box>
            <Heading size="md" mb={3} className="hindiText">
              2. जानकारी का उपयोग
            </Heading>

            <Text color="gray.700" lineHeight="2" className="hindiText">
              आपके द्वारा उपलब्ध कराई गई जानकारी का उपयोग केवल शिकायतों के
              पंजीकरण, संबंधित विभागों तक जानकारी पहुंचाने, आवश्यक संपर्क करने,
              ओटीपी सत्यापन तथा सेवा प्रदान करने के लिए किया जाएगा।
            </Text>
          </Box>

          <Box>
            <Heading size="md" mb={3} className="hindiText">
              3. जानकारी की सुरक्षा
            </Heading>

            <Text color="gray.700" lineHeight="2" className="hindiText">
              आपकी व्यक्तिगत जानकारी को सुरक्षित रखने के लिए उचित तकनीकी एवं
              प्रशासनिक उपाय अपनाए जाते हैं। बिना वैधानिक आवश्यकता के आपकी
              जानकारी किसी तीसरे पक्ष के साथ साझा नहीं की जाएगी।
            </Text>
          </Box>

          <Box>
            <Heading size="md" mb={3} className="hindiText">
              4. कुकीज़ (Cookies)
            </Heading>

            <Text color="gray.700" lineHeight="2" className="hindiText">
              वेबसाइट के बेहतर उपयोग एवं प्रदर्शन को सुनिश्चित करने के लिए
              आवश्यक कुकीज़ का उपयोग किया जा सकता है।
            </Text>
          </Box>

          <Box>
            <Heading size="md" mb={3} className="hindiText">
              5. तृतीय पक्ष लिंक
            </Heading>

            <Text color="gray.700" lineHeight="2" className="hindiText">
              इस वेबसाइट पर सरकारी विभागों अथवा अन्य उपयोगी वेबसाइटों के लिंक
              उपलब्ध हो सकते हैं। उन वेबसाइटों की गोपनीयता नीतियों के लिए
              संबंधित वेबसाइट स्वयं उत्तरदायी होगी।
            </Text>
          </Box>

          <Box>
            <Heading size="md" mb={3} className="hindiText">
              6. नीति में परिवर्तन
            </Heading>

            <Text color="gray.700" lineHeight="2" className="hindiText">
              आवश्यकता पड़ने पर इस गोपनीयता नीति में बिना पूर्व सूचना के परिवर्तन
              किया जा सकता है। अद्यतन नीति इसी पृष्ठ पर प्रकाशित की जाएगी।
            </Text>
          </Box>

          <Box>
            <Heading size="md" mb={3} className="hindiText">
              7. संपर्क करें
            </Heading>

            <Text color="gray.700" lineHeight="2" className="hindiText">
              <strong>सांसद सुविधा केंद्र</strong>
              <br />
              संसदीय कार्यालय, सतना
              <br />
              फ्रेंड्स कॉलोनी, यादव पेट्रोल पंप के सामने,
              <br />
              बिरला रोड, सतना – 485001 (मध्य प्रदेश)
              <br />
              <br />
              📞 +91 94251 72508
              <br />
              ✉️ satnassk@gmail.com
              <br />
              🌐 https://ssksatna.com
            </Text>
          </Box>

          <Box
            w="100%"
            p={5}
            bg="orange.50"
            borderRadius="lg"
            border="1px solid"
            borderColor="orange.200"
          >
            <Text
              fontWeight="bold"
              color="#8B5A2B"
              className="hindiText"
            >
              वेबसाइट का संचालन एवं प्रबंधन
            </Text>

            <Text mt={2} color="gray.700" className="hindiText">
              यह वेबसाइट <strong>माननीय सांसद श्री गणेश सिंह जी</strong> द्वारा
              सांसद सुविधा केंद्र के माध्यम से जनसेवा एवं शिकायत निवारण सेवाएं
              उपलब्ध कराने के उद्देश्य से संचालित की जाती है।
            </Text>

            <Text mt={3} color="gray.600" fontSize="sm">
              Technical Development: <strong>SOCIYO Communications</strong>
            </Text>
          </Box>

        </VStack>
      </Container>
    </Box>
  );
}