"use client";

import React, { useEffect, useState } from "react";
import styles from "./tickets.module.css";
import {
  Box,
  Button,
  Flex,
  Text,
  Skeleton,
  VStack,
  useToast,
  Select,
  Badge,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";
import { IoTicket } from "react-icons/io5";
import { MdConfirmationNumber } from "react-icons/md";
import { useRouter } from "next/navigation";
import { IoMdCreate } from "react-icons/io";

export default function Page() {
  const { user, loading, accessToken } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [tickets, setTickets] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [statusFilter, setStatusFilter] = useState("Submitted");

  const fetchTickets = async () => {
    if (!user || !accessToken) return;

    setIsFetching(true);
    try {
      const res = await fetch(`/api/ticket/tickets`, {
        method: "GET",
        headers: {
          Authorization: accessToken,
        },
      });

      const data = await res.json();

      if (res.ok) {
        let filteredTickets = data.tickets || [];

        if (user?.role === "Admin") {
          filteredTickets = filteredTickets.filter(
            (ticket) => ticket.status === statusFilter
          );
        }

        setTickets(filteredTickets);
      } else {
        toast({
          title: "Failed to fetch tickets",
          description: data.message || "Something went wrong",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error("Error fetching tickets:", err);
      toast({
        title: "Server error",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [user, accessToken, statusFilter]);

  const TicketBar = ({ ticket }) => (
    <Flex
      boxShadow="rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px"
      borderRadius="md"
      p={4}
      direction={{ base: "column", md: "row" }}
      align={{ base: "flex-start", md: "center" }}
      justify="space-between"
      w="100%"
      mx="auto"
      mb={8}
      _hover={{ boxShadow: "lg" }}
      transition="all 0.2s ease"
    >
      {/* Ticket Details */}
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
        <Flex mt={2} gap={4}>
          <Badge
            fontStyle={"italic"}
            colorScheme={ticket.status === "Resolved" ? "green" : "orange"}
          >
            {ticket.status}
          </Badge>
          {ticket?.assignedDept !== null && (
            <Badge fontStyle={"italic"} colorScheme={"purple"}>
              {ticket?.assignedDept}
            </Badge>
          )}
        </Flex>
      </VStack>

      {/* View Details Button */}
      <Button
        bg="#fa7602"
        color="white"
        mt={{ base: 3, md: 0 }}
        onClick={() => router.push(`/tickets/${ticket._id}`)}
        _hover={{
          bg: "white",
          color: "#fa7602",
          border: "2px solid #fa7602",
        }}
        minW="120px"
      >
        View Details
      </Button>
    </Flex>
  );

  return (
    <Box className={styles.container} minH="70vh">
      {loading || isFetching ? (
        <Box m={"100px auto"} maxW={"800px"} px={8}>
          <SkeletonCircle size="10" />
          <SkeletonText mt="4" noOfLines={10} spacing="4" />
        </Box>
      ) : (
        <>
          <Box
            pb={"80px"}
            maxW="800px"
            mx="auto"
            px={4}
            py={0}
            w="100%"
            minH="70vh"
            m="0 auto"
          >
            <Flex
              py={{ base: 2, md: 8 }}
              justify="space-between"
              align="center"
              mb={4}
            >
              <Text fontSize="2xl" fontWeight={600}>
                {user?.role === "Admin" ? "Active Tickets" : "Your Tickets"}
              </Text>

              {/* Admin Filter */}
              {user?.role === "Admin" && (
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  w="130px"
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In-Progress">In-Progress</option>
                  <option value="Awaiting User Response">
                    Awaiting User Response
                  </option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </Select>
              )}

              {/* Normal User Create Ticket */}
              {user?.role !== "Admin" && (
                <Button
                  _hover={{
                    bg: "white",
                    color: "#fa7602",
                    outline: "2px solid #fa7602",
                  }}
                  colorScheme="green"
                  minW="fit-content"
                  fontWeight={400}
                  onClick={() => router.push("/create-ticket")}
                >
                  <IoMdCreate />
                </Button>
              )}
            </Flex>

            <Box>
              {tickets.length === 0 ? (
                <>
                  <Flex
                    w="100%"
                    h="60vh"
                    gap={4}
                    justify="center"
                    align="center"
                    flexDir="column"
                  >
                    <Flex
                      gap={2}
                      align="center"
                      fontSize={{ base: "18px", md: "28px" }}
                      color="gray.400"
                    >
                      {user?.role === "Admin"
                        ? "No Tickets"
                        : "You don't have any tickets"}
                      <MdConfirmationNumber />
                    </Flex>
                    {user?.role === "Admin" ? null : (
                      <Button
                        outline="2px solid #fa7602"
                        _hover={{
                          bg: "white",
                          color: "#fa7602",
                          outline: "2px solid #fa7602",
                        }}
                        bg="#fa7602"
                        color="white"
                        minW="100px"
                        leftIcon={<IoTicket />}
                        fontWeight={400}
                        onClick={() => router.push("/create-ticket")}
                      >
                        Create Ticket
                      </Button>
                    )}
                  </Flex>
                </>
              ) : (
                <>
                  {tickets.map((ticket) => (
                    <TicketBar key={ticket._id} ticket={ticket} />
                  ))}
                </>
              )}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}

/* 
<Flex
              w="100%"
              h="70vh"
              gap={4}
              justify="center"
              align="center"
              flexDir="column"
            >
              <Flex
                gap={2}
                align="center"
                fontSize={{ base: "18px", md: "28px" }}
                color="gray.400"
              >
                {user?.role === "Admin"
                  ? "No Tickets"
                  : "You don't have any tickets"}
                <MdConfirmationNumber />
              </Flex>
              {user?.role === "Admin" ? null : (
                <Button
                  outline="2px solid #fa7602"
                  _hover={{
                    bg: "white",
                    color: "#fa7602",
                    outline: "2px solid #fa7602",
                  }}
                  bg="#fa7602"
                  color="white"
                  minW="100px"
                  leftIcon={<IoTicket />}
                  fontWeight={400}
                  onClick={() => router.push("/create-ticket")}
                >
                  Create Ticket
                </Button>
              )}
            </Flex>


*/

// adding the data for the infinte 