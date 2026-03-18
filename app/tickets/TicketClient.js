"use client";

import React, { useEffect, useState } from "react";
import styles from "./tickets.module.css";
import {
  Box,
  Button,
  Flex,
  Text,
  SkeletonText,
  SkeletonCircle,
  VStack,
  useToast,
  Badge,
  HStack,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";
import { IoTicket } from "react-icons/io5";
import { IoMdCreate } from "react-icons/io";
import { MdSearch, MdFilterList } from "react-icons/md";
import { useRouter, useSearchParams } from "next/navigation";

/* ── status → visual config ── */
const STATUS_CONFIG = {
  Submitted: { color: "#2563eb", bg: "#eff6ff", label: "Submitted" },
  Assigned: { color: "#7c3aed", bg: "#f5f3ff", label: "Assigned" },
  "In Progress": { color: "#d97706", bg: "#fffbeb", label: "In Progress" },
  "Awaiting User Response": {
    color: "#ea580c",
    bg: "#fff7ed",
    label: "Awaiting",
  },
  "User Respond Received": {
    color: "#0891b2",
    bg: "#ecfeff",
    label: "Responded",
  },
  Resolved: { color: "#16a34a", bg: "#f0fdf4", label: "Resolved" },
  Closed: { color: "#6b7280", bg: "#f9fafb", label: "Closed" },
};

const getStatusStyle = (status) =>
  STATUS_CONFIG[status] || { color: "#6b7280", bg: "#f9fafb", label: status };

/* ── date formatter ── */
const fmtDate = (d) =>
  new Date(d).toLocaleDateString("hi-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

/* ─────────────────────────────────────────
   TICKET CARD
───────────────────────────────────────── */
const TicketCard = ({ ticket, onClick, index }) => {
  const s = getStatusStyle(ticket.status);
  return (
    <Box
      bg="white"
      borderRadius="14px"
      border="1px solid"
      borderColor="gray.100"
      boxShadow="0 2px 8px rgba(0,0,0,0.05)"
      p={5}
      cursor="pointer"
      transition="all 0.2s ease"
      style={{ animationDelay: `${index * 40}ms` }}
      className={styles.cardIn}
      _hover={{
        transform: "translateY(-2px)",
        boxShadow: "0 8px 24px rgba(250,118,2,0.12)",
        borderColor: "#fa7602",
      }}
      onClick={onClick}
      position="relative"
      overflow="hidden"
    >
      {/* left accent bar */}
      <Box
        position="absolute"
        top={0}
        left={0}
        w="3px"
        h="100%"
        bg={s.color}
        borderRadius="14px 0 0 14px"
      />

      <Flex
        justify="space-between"
        align="flex-start"
        gap={4}
        direction={{ base: "column", md: "row" }}
      >
        <VStack align="flex-start" spacing={2} flex={1}>
          {/* ticket id + date */}
          <HStack spacing={3}>
            <Text
              fontSize="10px"
              color="gray.400"
              fontWeight="600"
              letterSpacing="0.08em"
              bg="gray.50"
              px={2}
              py="2px"
              borderRadius="6px"
            >
              #{ticket._id?.slice(-8).toUpperCase()}
            </Text>
            {ticket.createdAt && (
              <Text fontSize="10px" color="gray.400">
                {fmtDate(ticket.createdAt)}
              </Text>
            )}
          </HStack>

          {/* title */}
          <Text
            fontSize="md"
            fontWeight="700"
            color="gray.800"
            lineHeight="1.3"
          >
            {ticket.title}
          </Text>

          {/* description */}
          <Text fontSize="sm" color="gray.500" noOfLines={2} lineHeight="1.6">
            {ticket.description}
          </Text>

          {/* badges */}
          <HStack spacing={2} mt={1} flexWrap="wrap">
            <Box
              px={3}
              py="3px"
              borderRadius="full"
              fontSize="11px"
              fontWeight="700"
              bg={s.bg}
              color={s.color}
              letterSpacing="0.04em"
            >
              {s.label}
            </Box>
            {ticket.assignedDept && (
              <Box
                px={3}
                py="3px"
                borderRadius="full"
                fontSize="11px"
                fontWeight="600"
                bg="#f5f3ff"
                color="#7c3aed"
              >
                {ticket.assignedDept}
              </Box>
            )}
          </HStack>
        </VStack>

        {/* view button */}
        <Button
          size="sm"
          minW="110px"
          mt={{ base: 1, md: 0 }}
          bg="#fa7602"
          color="white"
          borderRadius="full"
          fontWeight="700"
          fontSize="12px"
          px={5}
          _hover={{ bg: "#e06800", transform: "scale(1.03)" }}
          transition="all 0.2s"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          View Details →
        </Button>
      </Flex>
    </Box>
  );
};

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  const [tickets, setTickets] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [search, setSearch] = useState("");

  const state = searchParams.get("state") || "All";

  /* ── fetch tickets — cookie sent automatically ── */
  const fetchTickets = async () => {
    if (!user) return;
    setIsFetching(true);
    try {
      const res = await fetch(`/api/ticket/tickets?state=${state}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setTickets(data.tickets || []);
    } catch (err) {
      toast({
        title: "Tickets लोड नहीं हो सके",
        description: err.message,
        status: "error",
      });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [user, state]);

  const handleFilterChange = (value) =>
    router.replace(`/tickets?state=${value}`);

  /* ── client-side search filter ── */
  const filtered = tickets.filter(
    (t) =>
      !search.trim() ||
      t.title?.toLowerCase().includes(search.toLowerCase()) ||
      t._id?.toLowerCase().includes(search.toLowerCase()),
  );

  const pageTitle =
    user?.role === "Admin"
      ? "All Tickets"
      : user?.role === "Department"
        ? "Department Tickets"
        : "Your Tickets";

  /* ─────────────── RENDER ─────────────── */
  return (
    
    <Box minH="100vh" bg="#fafafa" pt="90px" pb="60px" px={{ base: 4, md: 8 }}>
      <Box maxW="860px" mx="auto">
        {loading || isFetching ? (
          <VStack spacing={4} pt={8}>
            {[...Array(4)].map((_, i) => (
              <Box
                key={i}
                bg="white"
                borderRadius="14px"
                p={5}
                w="100%"
                border="1px solid"
                borderColor="gray.100"
              >
                <SkeletonCircle size="8" mb={3} />
                <SkeletonText noOfLines={3} spacing="3" />
              </Box>
            ))}
          </VStack>
        ) : (
          <>
            {/* ── HEADER ── */}
            <Flex
              justify="space-between"
              align="center"
              mb={6}
              wrap="wrap"
              gap={3}
            >
              <Box>
                <Text fontSize="2xl" fontWeight="800" color="gray.800">
                  {pageTitle}
                </Text>
                <Text fontSize="sm" color="gray.400" mt="1px">
                  {filtered.length} ticket{filtered.length !== 1 ? "s" : ""}{" "}
                  found
                </Text>
              </Box>

              {user?.role === "User" && (
                <Button
                  bg="#fa7602"
                  color="white"
                  borderRadius="full"
                  fontWeight="700"
                  fontSize="sm"
                  px={5}
                  h="40px"
                  leftIcon={<IoMdCreate />}
                  _hover={{ bg: "#e06800" }}
                  onClick={() => router.push("/create-ticket")}
                >
                  New Ticket
                </Button>
              )}
            </Flex>

            {/* ── FILTERS ── */}
            <Flex gap={3} mb={6} wrap="wrap">
              {/* search */}
              <InputGroup flex={1} minW="200px">
                <InputLeftElement pointerEvents="none" h="42px">
                  <MdSearch color="#a0aec0" size={18} />
                </InputLeftElement>
                <Input
                  h="42px"
                  borderRadius="10px"
                  borderColor="gray.200"
                  bg="white"
                  fontSize="sm"
                  placeholder="Search by title or ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  focusBorderColor="#fa7602"
                  _placeholder={{ color: "gray.400" }}
                />
              </InputGroup>

              {/* state filter */}
              <Select
                w={{ base: "100%", sm: "180px" }}
                h="42px"
                borderRadius="10px"
                borderColor="gray.200"
                bg="white"
                fontSize="sm"
                value={state}
                onChange={(e) => handleFilterChange(e.target.value)}
                focusBorderColor="#fa7602"
                icon={<MdFilterList />}
              >
                <option value="All">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="assigned">Assigned</option>
                <option value="inprogress">In Progress</option>
                <option value="completed">Completed</option>
              </Select>
            </Flex>

            {/* ── TICKET LIST ── */}
            {filtered.length === 0 ? (
              <Flex
                h="50vh"
                align="center"
                justify="center"
                flexDir="column"
                gap={4}
              >
                <Box fontSize="48px">🎫</Box>
                <Text color="gray.400" fontSize="lg" fontWeight="600">
                  {search ? "कोई ticket नहीं मिली" : "अभी कोई ticket नहीं है"}
                </Text>
                {user?.role === "User" && !search && (
                  <Button
                    bg="#fa7602"
                    color="white"
                    borderRadius="full"
                    leftIcon={<IoTicket />}
                    _hover={{ bg: "#e06800" }}
                    onClick={() => router.push("/create-ticket")}
                  >
                    पहली Ticket बनाएं
                  </Button>
                )}
              </Flex>
            ) : (
              <VStack spacing={3} align="stretch">
                {filtered.map((ticket, i) => (
                  <TicketCard
                    key={ticket._id}
                    ticket={ticket}
                    index={i}
                    onClick={() => router.push(`/tickets/${ticket._id}`)}
                  />
                ))}
              </VStack>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}

