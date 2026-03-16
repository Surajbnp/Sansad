"use client";

import React, { useEffect, useState } from "react";
import styles from "./tickets.module.css";
import {
  Box,
  Button,
  Flex,
  Text,
  SkeletonCircle,
  SkeletonText,
  VStack,
  useToast,
  Select,
  Badge,
  HStack,
} from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";
import { IoTicket } from "react-icons/io5";
import { IoMdCreate } from "react-icons/io";
import { useRouter, useSearchParams } from "next/navigation";

export default function Page() {
  const { user, loading, accessToken } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  const [tickets, setTickets] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  /* ================= READ STATE FROM URL ================= */
  const state = searchParams.get("state") || "All";

  /* ================= FETCH TICKETS ================= */
  const fetchTickets = async () => {
    if (!user || !accessToken) return;

    setIsFetching(true);

    try {
      const params = new URLSearchParams();
      params.set("state", state); // backend handles role + filter

      const res = await fetch(`/api/ticket/tickets?${params.toString()}`, {
        headers: { Authorization: accessToken },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setTickets(data.tickets || []);
    } catch (error) {
      toast({
        title: "Failed to fetch tickets",
        description: error.message,
        status: "error",
      });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [user, accessToken, state]);

  /* ================= UPDATE URL ONLY ================= */
  const handleFilterChange = (value) => {
    router.replace(`/tickets?state=${value}`);
  };

  /* ================= TICKET CARD ================= */
  const TicketBar = ({ ticket }) => (
    <Flex
      boxShadow="md"
      borderRadius="md"
      p={4}
      direction={{ base: "column", md: "row" }}
      justify="space-between"
      mb={6}
    >
      <VStack align="flex-start" spacing={1}>
        <Text fontSize="sm" color="gray.500">
          Ticket ID: {ticket._id}
        </Text>

        <Text fontSize="lg" fontWeight="bold">
          {ticket.title}
        </Text>

        <Text fontSize="sm" color="gray.600" noOfLines={2}>
          {ticket.description}
        </Text>

        <Flex mt={2} gap={3}>
          <Badge fontStyle="italic" colorScheme="orange">
            {ticket.status}
          </Badge>

          {ticket.assignedDept && (
            <Badge fontStyle="italic" colorScheme="purple">
              {ticket.assignedDept}
            </Badge>
          )}
        </Flex>
      </VStack>

      <Button
        bg="#fa7602"
        color="white"
        mt={{ base: 3, md: 0 }}
        minW="120px"
        onClick={() => router.push(`/tickets/${ticket._id}`)}
        _hover={{
          bg: "white",
          color: "#fa7602",
          border: "2px solid #fa7602",
        }}
      >
        View Details
      </Button>
    </Flex>
  );

  /* ================= UI ================= */
  return (
    <Box className={styles.container} minH="70vh">
      {loading || isFetching ? (
        <Box m="100px auto" maxW="800px">
          <SkeletonCircle size="10" />
          <SkeletonText mt="4" noOfLines={10} spacing="4" />
        </Box>
      ) : (
        <Box maxW="800px" mx="auto" px={4} pb="80px" py={8}>
          {/* HEADER */}
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontSize="2xl" fontWeight={600}>
              {user?.role === "Admin"
                ? "Tickets"
                : user?.role === "Department"
                  ? "Department Tickets"
                  : "Your Tickets"}
            </Text>

            <VStack align={"end"} spacing={4}>
              {/* CREATE → ONLY USER */}
              {user?.role === "User" && (
                <Button
                  bg="green.700"
                  _hover={{ bg: "green.600" }}
                  onClick={() => router.push("/create-ticket")}
                >
                  <IoMdCreate color="white" />
                </Button>
              )}

              {/* FILTER → ADMIN + DEPARTMENT + USER + Mobile */}
              <Select
                w="200px"
                value={state}
                onChange={(e) => handleFilterChange(e.target.value)}
                defaultChecked={"All"}
                defaultValue={"All"}
              >
                <option value="All">All</option>
                <option value="Submitted">Submitted</option>
                <option value="Assigned">Assigned</option>
                <option value="InProgress">In Progress</option>
                <option value="Completed">Completed</option>
              </Select>
            </VStack>
          </Flex>

          {/* LIST */}
          {tickets.length === 0 ? (
            <Flex h="60vh" align="center" justify="center" flexDir="column">
              <Text color="gray.400" fontSize="xl">
                No Tickets Found
              </Text>

              {user?.role === "User" && (
                <Button
                  mt={4}
                  bg="#fa7602"
                  color="white"
                  leftIcon={<IoTicket />}
                  onClick={() => router.push("/create-ticket")}
                >
                  Create Ticket
                </Button>
              )}
            </Flex>
          ) : (
            tickets.map((ticket) => (
              <TicketBar key={ticket._id} ticket={ticket} />
            ))
          )}
        </Box>
      )}
    </Box>
  );
}

// adding the otp along with the email verification feature
// mobile adding with rest api both
