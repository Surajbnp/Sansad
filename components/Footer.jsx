// "use client";

// import {
//   Box,
//   chakra,
//   Container,
//   Image,
//   Stack,
//   Text,
//   useColorModeValue,
//   VisuallyHidden,
//   HStack,
//   Divider,
//   Flex,
//   VStack,
// } from "@chakra-ui/react";
// import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

// const Logo = () => {
//   return (
//     <VStack spacing={3} align={{ base: "center", md: "start" }}>
//       <Image
//         width="100px"
//         src="https://res.cloudinary.com/dddnxiqpq/image/upload/v1767013159/ChatGPT_Image_Dec_29_2025_06_28_24_PM_rd3f8w.webp"
//       />
//       <Text fontSize="sm" color="white">
//         © 2025 Sansad App. All rights reserved.
//       </Text>
//     </VStack>
//   );
// };

// const SocialButton = ({ children, label, href }) => {
//   return (
//     <chakra.a
//       bg="whiteAlpha.200"
//       color="white"
//       rounded="full"
//       w="36px"
//       h="36px"
//       display="inline-flex"
//       alignItems="center"
//       justifyContent="center"
//       href={href}
//       transition="0.2s"
//       _hover={{
//         bg: "whiteAlpha.300",
//         transform: "scale(1.1)",
//       }}
//     >
//       <VisuallyHidden>{label}</VisuallyHidden>
//       {children}
//     </chakra.a>
//   );
// };

// export default function Footer() {
//   return (
//     <Box bg="#773903ff" color="gray.300" py={8} px={4}>
//       {/* TOP */}
//       <Container maxW="7xl">
//         <Flex
//           justify="space-between"
//           direction={{ base: "column", md: "row" }}
//           align="center"
//           gap={6}
//         >
//           <Logo />

//           {/* BOTTOM ROW */}
//           <Flex
//             align="center"
//             justify="space-between"
//             direction={{ base: "column", md: "row" }}
//             gap={4}
//           >
//             <VStack spacing={5} align={{ base: "center", md: "start" }}>
//               <HStack
//                 spacing={10}
//                 fontSize="sm"
//                 fontWeight="medium"
//                 color="white"
//               >
//                 <chakra.a href="#" _hover={{ color: "#fa7602" }}>
//                   Home
//                 </chakra.a>
//                 <chakra.a href="#" _hover={{ color: "#fa7602" }}>
//                   About
//                 </chakra.a>
//                 <chakra.a href="#" _hover={{ color: "#fa7602" }}>
//                   Blog
//                 </chakra.a>
//                 <chakra.a href="#" _hover={{ color: "#fa7602" }}>
//                   Contact
//                 </chakra.a>
//               </HStack>

//               <HStack gap={8}>
//                 <SocialButton label="Twitter" href="#">
//                   <FaTwitter size={18} />
//                 </SocialButton>
//                 <SocialButton label="YouTube" href="#">
//                   <FaYoutube size={18} />
//                 </SocialButton>
//                 <SocialButton label="Instagram" href="#">
//                   <FaInstagram size={18} />
//                 </SocialButton>
//               </HStack>
//             </VStack>
//           </Flex>
//         </Flex>
//       </Container>
//     </Box>
//   );
// }

"use client";

import {
  Box,
  Container,
  Image,
  Text,
  VStack,
  Link,
} from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box bg="white" color="black" py={{ base: 5, md: 10 }} px={4}>
      <Container maxW="7xl">
        <VStack spacing={{ base: 4, md: 6 }} align="center">

          <Box w="80%" h="2px" bg="black" />

          <VStack spacing={2}>
            <Image
              w={{ base: "110px", md: "160px" }}   // mobile small, desktop big
              src="/SSASatna_Color_Logo.png"
              alt="Sansad Suvidha Kendra Logo"
              fallbackSrc="https://via.placeholder.com/220x80?text=Logo+Not+Found"
            />
          </VStack>

          <Text
            fontSize={{ base: "10px", md: "xs" }}   // mobile smaller text
            color="gray.500"
            textAlign="center"
          >
            Copyright (C) All Rights Reserved |
            <Link
              href="https://ssksatna.com"
              isExternal
              ml={1}
              fontWeight="medium"
            >
              ssksatna.com
            </Link>
          </Text>

        </VStack>
      </Container>
    </Box>
  );
}