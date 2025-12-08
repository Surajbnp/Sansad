"use client";
import React from "react";
import {
  Avatar,
  Box,
  Text,
  Button,
  SimpleGrid,
  Skeleton,
  Flex,
  HStack,
  VStack,
  Icon,
  Divider,
} from "@chakra-ui/react";
import { DownloadIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useAuth } from "@/context/AuthContext";
import withAuth from "@/utils/withAuth";
import { useRouter } from "next/navigation";
import { FiPlusCircle, FiEye, FiCheckCircle, FiFileText } from "react-icons/fi";
import styles from "./profile.module.css";

const Page = () => {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const ticketsCreated = user?.ticketsCreated || 0;
  const ticketsResolved = user?.ticketsResolved || 0;

  return (
    <Box
      w="100%"
      color="black"
      pt="90px"
      pb="40px"
      display="flex"
      justifyContent="center"
      px={{ base: 3, md: 6 }}
      mt={"12vh"}
    >
      {loading ? (
        <Box w="100%" maxW="1100px">
          <Skeleton height="420px" borderRadius="md" />
        </Box>
      ) : (
        <Box w="100%" maxW="1100px">
          {/* TOP HEADER CARD */}
          <Box rounded="md" py={6} px={{ base: 4, md: 8 }} boxShadow="lg">
            {/* Top row: title + filters/buttons */}
            <Flex
              justify="space-between"
              align="center"
              mb={6}
              gap={4}
              direction={{ base: "row", md: "row" }}
              w={"100%"}
            >
              <HStack align="center">
                <Box w="4px" h="28px" bg="#fa7602" rounded="full" mr={2} />
                <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold">
                  Profile Details
                </Text>
              </HStack>

              <HStack spacing={3}>
                <Button
                  size="sm"
                  variant="outline"
                  borderColor="red.400"
                  color="red.400"
                  _hover={{ bg: "#fa7602", color: "white" }}
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                >
                  Logout
                </Button>
              </HStack>
            </Flex>

            {/* Middle row: avatar + info row */}
            <Flex
              align={{ base: "flex-start", md: "center" }}
              gap={12}
              direction={{ base: "column", md: "row" }}
            >
              {/* Avatar + name */}
              <HStack spacing={4}>
                <Avatar
                  size="xl"
                  name={user?.name}
                  src={user?.avatar || undefined}
                />
                <Box>
                  <Text fontSize={{ base: "xl", md: "md" }} fontWeight="bold">
                    {user?.name || "Unnamed User"}
                  </Text>
                </Box>
              </HStack>

              {/* Info columns like reference: Role / Phone / Email */}
              <Flex
                flex="1"
                justify="space-between"
                gap={6}
                wrap="wrap"
                mt={{ base: 4, md: 0 }}
              >
                <VStack align="flex-start" spacing={1} minW="150px">
                  <Text fontSize="xs" color="gray.400">
                    Role
                  </Text>
                  <Text fontSize="sm" fontWeight="semibold">
                    {user?.role || "User"}
                  </Text>
                </VStack>

                <VStack align="flex-start" spacing={1} minW="150px">
                  <Text fontSize="xs" color="gray.400">
                    Phone Number
                  </Text>
                  <Text fontSize="sm" fontWeight="semibold">
                    {user?.whatsapp || user?.phone || "Not Provided"}
                  </Text>
                </VStack>

                <VStack align="flex-start" spacing={1} minW="200px">
                  <Text fontSize="xs" color="gray.400">
                    Email Address
                  </Text>
                  <Text fontSize="sm" fontWeight="semibold">
                    {user?.email || "Not Provided"}
                  </Text>
                </VStack>
                <VStack align="flex-start" spacing={1} minW="200px">
                  <Text fontSize="xs" color="gray.400">
                    Aadhar
                  </Text>
                  <Text fontSize="sm" fontWeight="semibold">
                    {user?.aadhar || "Not Provided"}
                  </Text>
                </VStack>
              </Flex>
            </Flex>
          </Box>

          {/* BOTTOM STRIP: OPTIONS – matches horizontal cards in reference */}
          <Flex mt={6} gap={4} direction={{ base: "column", md: "row" }}>
            {/* Tickets Created */}
            <Box
              flex="1"
              rounded="md"
              py={4}
              px={5}
              display="flex"
              alignItems="center"
              gap={4}
              boxShadow="md"
            >
              <Box
                w="40px"
                h="40px"
                rounded="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={FiFileText} fontSize="20px" />
              </Box>
              <Box>
                <Text fontSize="lg" fontWeight="bold">
                  {ticketsCreated}
                </Text>
                <Text fontSize="xs" color="gray.600">
                  Tickets Created
                </Text>
              </Box>
            </Box>

            {/* Tickets Resolved */}
            <Box
              flex="1"
              rounded="md"
              py={4}
              px={5}
              display="flex"
              alignItems="center"
              gap={4}
              boxShadow="md"
            >
              <Box
                w="40px"
                h="40px"
                rounded="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={FiCheckCircle} fontSize="20px" />
              </Box>
              <Box>
                <Text fontSize="lg" fontWeight="bold">
                  {ticketsResolved}
                </Text>
                <Text fontSize="xs" color="gray.600">
                  Tickets Resolved
                </Text>
              </Box>
            </Box>

            {/* View Tickets */}
            <Box
              flex="1"
              rounded="md"
              py={4}
              px={5}
              display="flex"
              alignItems="center"
              gap={4}
              boxShadow="md"
              color="gray.600"
              cursor="pointer"
              _hover={{ bg: "#fa7602", color: "white" }}
              onClick={() => router.push("/tickets")}
            >
              <Box
                w="40px"
                h="40px"
                rounded="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={FiEye} fontSize="20px" />
              </Box>
              <Box>
                <Text fontSize="md" fontWeight="bold">
                  View Tickets
                </Text>
                <Text
                  fontSize="xs"
                  _hover={{ color: "white" }}
                >
                  See all your tickets
                </Text>
              </Box>
            </Box>

            {/* Create New Ticket */}
            <Box
              flex="1"
              rounded="md"
              py={4}
              px={5}
              display="flex"
              alignItems="center"
              gap={4}
              boxShadow="md"
              cursor="pointer"
              _hover={{ bg: "#fa7602", color: "white" }}
              onClick={() => router.push("/tickets/new")}
            >
              <Box
                w="40px"
                h="40px"
                rounded="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                _hover={{ color: "white" }}
                color="gray.600"
              >
                <Icon as={FiPlusCircle} fontSize="20px" />
              </Box>
              <Box>
                <Text fontSize="md" fontWeight="bold">
                  Create New Ticket
                </Text>
                <Text fontSize="xs">Raise an issue</Text>
              </Box>
            </Box>
          </Flex>
          {/* icons  */}
          <Box mt={"12vh"}>
            <Divider maxW={"80%"} m={"auto"} borderColor="gray.300" />
            <Box
              w="100%"
              h="30vh"
              backgroundSize={{ base: "350px", md: "600px", lg: "700px" }}
              className={styles.icons}
            ></Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default withAuth(Page);
