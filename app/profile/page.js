"use client";
import React from "react";
import {
  Avatar,
  Box,
  Text,
  Stack,
  Button,
  SimpleGrid,
  Skeleton,
} from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";
import withAuth from "@/utils/withAuth";
import { useRouter } from "next/navigation";

const fields = [
  ["Name", "name"],
  ["Address", "address"],
  ["Sex", "sex"],
  ["Voter ID", "voterId"],
  ["Aadhar", "aadhar"],
  ["WhatsApp", "whatsapp"],
];

const Page = () => {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  return (
    <Box
      minH="80vh"
      w="100vw"
      display="flex"
      justifyContent="center"
      alignItems="center"
      overflowX="hidden"
      px={{ base: 0, md: 4 }}
      mt={'80px'}
      pb={0}
    >
      {loading ? (
        <Box
          w={{ base: "96vw", sm: "380px", md: "600px" }}
          mx="auto"
          p={{ base: 4, md: 8 }}
        >
          <Skeleton height="400px" borderRadius="2xl" />
        </Box>
      ) : (
        <Box
          w="100%"
          maxW={{ base: "96vw", sm: "380px", md: "600px" }}
          px={{ base: 2, sm: 6, md: 10 }}
          py={{ base: 4, sm: 8 }}
          bg="white"
 
          rounded="2xl"
          position="relative"
        >
          {/* Header / Avatar */}
          <Box
            h={{ base: "10px", sm: "100px" }}
            position="relative"
            roundedTop="2xl"
          >
            <Avatar
              size={{ base: "xl", md: "2xl" }}
              name={user?.name}
              src={user?.avatar || undefined}
              position="absolute"
              left="50%"
              bottom={-12}
              transform="translateX(-50%)"
              border="4px solid white"
              shadow="lg"
            />
          </Box>

          {/* Info Section */}
          <Box pt={16} pb={4}>
            <Text
              fontSize={{ base: "lg", md: "2xl" }}
              fontWeight="bold"
              textAlign="center"
              color="gray.800"
              mb={2}
            >
              {user?.name || "Unnamed User"}
            </Text>
            <SimpleGrid columns={{ base: 2, sm: 2 }} spacing={4} px={1} mt={4}>
              {fields.map(([label, key]) => (
                <Box
                  key={key}
                  rounded="lg"
                  p={3}
                  bg="gray.50"
                  boxShadow="sm"
                  textAlign="center"
                >
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    textTransform="uppercase"
                    fontWeight="medium"
                    letterSpacing="wide"
                  >
                    {label}
                  </Text>
                  <Text fontSize="md" fontWeight="semibold" color="gray.800">
                    {user?.[key] || "-"}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
            {/* Logout */}
            <Stack mt={8} align="center">
              <Button
                w={{ base: "full", sm: "60%" }}
                size="lg"
                bg="orange.400"
                color="white"
                rounded="lg"
                fontWeight="semibold"
                boxShadow="base"
                _hover={{
                  bg: "white",
                  color: "orange.400",
                  border: "2px solid",
                  borderColor: "orange.400",
                  shadow: "md",
                }}
                transition="all 0.2s"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
              >
                Logout
              </Button>
            </Stack>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default withAuth(Page);
