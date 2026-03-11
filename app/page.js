// "use client";

// import {
//   Box,
//   Button,
//   Divider,
//   Grid,
//   GridItem,
//   Input,
//   Text,
//   FormControl,
//   FormErrorMessage,
//   useToast,
//   Select,
//   Spinner,
//   Flex,
// } from "@chakra-ui/react";
// import { useState } from "react";
// import styles from "./page.module.css";

// export default function Home() {
//   return (
//     <Box className={styles.page} minH={{ base: "fit-content", md: "100vh" }}>
//       <Box className={styles.hero} w="100%" minH={{ base: "auto", md: "90vh" }}></Box>
//       <Box
//         w="100%"
//         h={{ base: "150px", md: "300px", lg: "350px" }}
//         backgroundSize={{ base: "350px", md: "600px", lg: "700px" }}
//         className={styles.icons}
//       ></Box>
//       <Divider maxW={"80%"} m={"auto"} borderColor="gray.300" />
//       <Box p={8} maxW="800px" m="auto" textAlign="center">
//         <Text>
//           सांसद सुविधा केंद्र, आप सभी सतना-मैहर लोकसभा क्षेत्र के क्षेत्रीय जनों
//           तक मूलभूत सुविधाएं पहुंचाने एवं किसी भी प्रकार की व्यक्तिगत अथवा
//           सामूहिक समस्या के त्वरित निराकरण के उद्देश्य से शुरू किया गया है।
//         </Text>

//         <Text mt={4}>
//           सुविधाओं की प्राप्ति अथवा समस्याओं के निराकरण हेतु फॉर्म भरने के लिए
//           पहचान पत्र के रूप में अपना आधार कार्ड एवं वोटर आईडी कार्ड अवश्य रख
//           लें।
//         </Text>

//         <Text mt={4}>
//           सांसद सुविधा केंद्र से अब आपके लिए सुविधाओं का लाभ है बस एक क्लिक
//           दूर...
//         </Text>

//         <Flex mt={8} gap={8} justify="center" align="center">
//           <Button
//             bg="#fa7602"
//             color="white"
//             onClick={() => (window.location.href = "/signup")}
//             _hover={{
//               bg: "#e85f00",
//               transform: "translateY(-2px)",
//             }}
//             _active={{
//               bg: "#d45500",
//             }}
//             transition="all 0.2s ease"
//           >
//             रजिस्टर/लॉग इन
//           </Button>

//           <Button
//             bg="#2fa70b"
//             color="white"
//             onClick={() => (window.location.href = "/ticket-status")}
//             _hover={{
//               bg: "#248a09",
//               transform: "translateY(-2px)",
//             }}
//             _active={{
//               bg: "#1e7207",
//             }}
//             transition="all 0.2s ease"
//           >
//             टिकट स्टेटस देखें
//           </Button>
//         </Flex>

//         <Box>
//           <Text
//             mt={16}
//             mb={8}
//             fontSize={{ base: "22px", md: "28px" }}
//             fontWeight={600}
//           >
//             हेल्पलाइन: +91 123456789
//           </Text>
//         </Box>
//       </Box>
//     </Box>
//   );
// }


"use client";

import {
  Box,
  Button,
  Divider,
  Text,
  Flex,
  Image,
  HStack
} from "@chakra-ui/react";
import styles from "./page.module.css";

export default function Home() {
  return (
    <Box className={styles.page} minH={{ base: "fit-content", md: "100vh" }}>

      {/* HERO SECTION */}
      <Box
        className={styles.hero}
        w="100%"
        minH={{ base: "auto", md: "90vh" }}
        position="relative"
      >

        {/* LOGO LEFT SIDE */}
        <Image
          src="/SSASatna_White_Logo.png"
          alt="logo"
          position="absolute"
          top={{ base: "15px", md: "100px" }}
          left={{ base: "20px", md: "100px" }}
          w={{ base: "70px", md: "200px" }}
        />

      </Box>

      {/* ICONS SECTION */}
      <Box w="100%" className={styles.iconsWrapper}>

        {/* DESKTOP ICONS */}
        <Box
          display={{ base: "none", md: "block" }}
          h={{ md: "300px", lg: "350px" }}
          className={styles.icons}
          my="50px"
        />

        {/* MOBILE ICONS */}
        <Flex
          display={{ base: "flex", md: "none" }}
          direction="column"
          align="center"
          gap={6}
          p={6}
          mt="-350px"
        >
          <Image src="/SSK-Satna_Point1.webp" alt="icon1" w="120px" />
          <Image src="/SSK-Satna_Point2.webp" alt="icon2" w="120px" />
          <Image src="/SSK-Satna_Point3.webp" alt="icon3" w="120px" />
        </Flex>

      </Box>

      <HStack
        justify="center"
        spacing={4}
        maxW="80%"
        m="auto"
        my={2}
        flexWrap="wrap"
        overflow="hidden"
        h="12px"
      >
        {[...Array(30)].map((_, i) => (
          <Box
            key={i}
            w="2px"
            h="2px"
            bg="black"
            borderRadius="full"
            flexShrink={0}
          />
        ))}
      </HStack>

      {/* TEXT SECTION */}
      <Box p={8} maxW="800px" m="auto" textAlign="center" fontSize={{ base: "14px", md: "20px" }}>

        <Text>
          सांसद सुविधा केंद्र, आप सभी सतना-मैहर लोकसभा क्षेत्र के क्षेत्रीय जनों
          तक मूलभूत सुविधाएं पहुंचाने एवं किसी भी प्रकार की व्यक्तिगत अथवा
          सामूहिक समस्या के त्वरित निराकरण के उद्देश्य से शुरू किया गया है।
        </Text>

        <Text mt={4}>
          सुविधाओं की प्राप्ति अथवा समस्याओं के निराकरण हेतु फॉर्म भरने के लिए
          पहचान पत्र के रूप में अपना आधार कार्ड एवं वोटर आईडी कार्ड अवश्य रख लें।
        </Text>

        <Text mt={4}>
          सांसद सुविधा केंद्र से अब आपके लिए सुविधाओं का लाभ है बस एक क्लिक दूर...
        </Text>

        <HStack
          justify="center"
          spacing={4}
          maxW="80%"
          m="auto"
          mt={8}
          flexWrap="wrap"
          overflow="hidden"
          h="12px"
        >
          {[...Array(30)].map((_, i) => (
            <Box
              key={i}
              w="2px"
              h="2px"
              bg="black"
              borderRadius="full"
              flexShrink={0}
            />
          ))}
        </HStack>

       <Flex 
  mt={8} 
  gap={{ base: 4, md: 10 }} 
  justify="center" 
  align="center" 
  direction={{ base: "row", md: "row" }}
>
  <Button
    bg="#fa7602"
    color="white"
    onClick={() => (window.location.href = "/signup")}
    _hover={{ bg: "#e66a00" }}
    fontSize={{ base: "15px", md: "28px" }}
    // Padding and Sizing
    px={{ base: 12, md: 10 }} 
    py={{ base: 2, md: 5 }}
    h="auto" 
    borderRadius="md"
    fontWeight="bold"
  >
    रजिस्टर / लॉग इन
  </Button>

  {/* Vertical Blue Line */}
  <Box
    h={{ base: "60px", md: "100px" }} 
    borderLeft="3px solid" 
    borderColor="blue.500" 
    mx={{ base: 2, md: 4 }}
  />

  <Button
    bg="#2fa70b"
    color="white"
    onClick={() => (window.location.href = "/ticket-status")}
    _hover={{ bg: "#289409" }}
    fontSize={{ base: "15px", md: "28px" }}
    // Padding and Sizing
    px={{ base: 12, md: 12 }}
    py={{ base: 2, md: 5 }}
    h="auto"
    borderRadius="md"
    fontWeight="bold"
  >
    टिकट स्टेटस देखें
  </Button>
</Flex>

        <Text mt={{ base: 8, md: 16 }} fontSize={{ base: "22px", md: "40px" }} fontWeight={600}>
          हेल्पलाइन: +91 123456789
        </Text>

      </Box>

    </Box>
  );
}


