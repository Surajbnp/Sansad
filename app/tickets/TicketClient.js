"use client";

import React, { useEffect, useState, useCallback } from "react";
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
  HStack,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";
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

const FALLBACK_STATUS = { color: "#6b7280", bg: "#f9fafb", label: "" };
const getStatusStyle = (status) =>
  STATUS_CONFIG[status] || { ...FALLBACK_STATUS, label: status };

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("hi-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const PARAM_TO_OPTION = {
  all: "All",
  submitted: "submitted",
  assigned: "assigned",
  inprogress: "inprogress",
  "in progress": "inprogress",
  "in-progress": "inprogress",
  completed: "completed",
  resolved: "completed",
  closed: "completed",
};

const EMPTY_LABELS = {
  submitted: "कोई submitted ticket नहीं है",
  assigned: "कोई assigned ticket नहीं है",
  inprogress: "कोई in-progress ticket नहीं है",
  completed: "कोई completed ticket नहीं है",
  All: "अभी कोई ticket नहीं है",
};

/* ── Ticket Card — memoized to prevent re-render when parent state changes ── */
const TicketCard = React.memo(({ ticket, onClick, index }) => {
  const s = getStatusStyle(ticket.status);
  return (
    <Box
      bg="white"
      borderRadius="10px"
      border="1px solid"
      borderColor="gray.100"
      boxShadow="0 1px 4px rgba(0,0,0,0.04)"
      px={4}
      py={3}
      cursor="pointer"
      transition="all 0.15s ease"
      style={{ animationDelay: `${index * 40}ms` }}
      className={styles.cardIn}
      _hover={{
        boxShadow: "0 4px 16px rgba(250,118,2,0.09)",
        borderColor: s.color,
        bg: "#fffcf9",
      }}
      onClick={onClick}
      position="relative"
      overflow="hidden"
    >
      <Box position="absolute" top={0} left={0} w="3px" h="100%" bg={s.color} />

      <Flex align="center" gap={3} pl={2}>
        <VStack
          align="flex-start"
          spacing={0}
          minW="90px"
          display={{ base: "none", sm: "flex" }}
        >
          <Text
            fontSize="10px"
            fontWeight="700"
            color="gray.400"
            letterSpacing="0.08em"
          >
            #{ticket._id?.slice(-8).toUpperCase()}
          </Text>
          {ticket.createdAt && (
            <Text fontSize="10px" color="gray.300" mt="2px">
              {fmtDate(ticket.createdAt)}
            </Text>
          )}
        </VStack>

        <Box
          w="1px"
          h="32px"
          bg="gray.100"
          display={{ base: "none", sm: "block" }}
        />

        <Box flex={1} minW={0}>
          <Text
            fontSize="sm"
            fontWeight="700"
            color="gray.800"
            noOfLines={1}
            lineHeight="1.4"
          >
            {ticket.title}
          </Text>
          <Text
            fontSize="xs"
            color="gray.400"
            noOfLines={1}
            lineHeight="1.4"
            mt="1px"
          >
            {ticket.description}
          </Text>
        </Box>

        <HStack
          spacing={2}
          flexShrink={0}
          display={{ base: "none", md: "flex" }}
        >
          {ticket.assignedDept && (
            <Box
              px={2}
              py="2px"
              borderRadius="5px"
              fontSize="10px"
              fontWeight="600"
              bg="#f5f3ff"
              color="#7c3aed"
              whiteSpace="nowrap"
            >
              {ticket.assignedDept}
            </Box>
          )}
          <Box
            px={2}
            py="2px"
            borderRadius="5px"
            fontSize="10px"
            fontWeight="700"
            bg={s.bg}
            color={s.color}
            whiteSpace="nowrap"
            letterSpacing="0.03em"
          >
            {s.label}
          </Box>
        </HStack>

        <Button
          size="xs"
          variant="ghost"
          color="#fa7602"
          borderRadius="full"
          fontWeight="700"
          fontSize="11px"
          px={3}
          h="28px"
          flexShrink={0}
          _hover={{ bg: "#fff3e0" }}
          transition="all 0.15s"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          View →
        </Button>
      </Flex>

      <Flex
        display={{ base: "flex", md: "none" }}
        gap={2}
        mt={2}
        pl={2}
        flexWrap="wrap"
        justifyContent="end"
      >
        {ticket.assignedDept && (
          <Box
            px={2}
            py="1px"
            borderRadius="5px"
            fontSize="10px"
            fontWeight="600"
            bg="#f5f3ff"
            color="#7c3aed"
          >
            {ticket.assignedDept}
          </Box>
        )}
        <Box
          px={2}
          py="1px"
          borderRadius="5px"
          fontSize="10px"
          fontWeight="700"
          bg={s.bg}
          color={s.color}
        >
          {s.label}
        </Box>
      </Flex>
    </Box>
  );
});
TicketCard.displayName = "TicketCard";

/* ── Skeleton loader ── */
const SkeletonList = () => (
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
);

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

  const rawState = searchParams.get("state") || "All";
  const state = PARAM_TO_OPTION[rawState.toLowerCase()] || "All";

  // ✅ SMS link redirect — handle ?id= before anything else
  useEffect(() => {
    const id = searchParams.get("id");
    if (!id || loading) return;

    if (user) {
      router.replace(`/tickets/${id}`); // logged in → ticket view
    } else {
      router.replace(`/ticket-status?id=${id}`); // not logged in → public status
    }
  }, [searchParams, user, loading]);

  // ✅ Stable fetch function — won't re-create on every render
  const fetchTickets = useCallback(async () => {
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
  }, [user, state]); // ✅ only re-runs when user or state actually changes

  useEffect(() => {
    // ✅ Skip fetch if this is an SMS redirect (?id= present)
    if (searchParams.get("id")) return;
    fetchTickets();
  }, [fetchTickets]);

  // ✅ Stable handler — won't re-create on every render
  const handleFilterChange = useCallback(
    (e) => router.replace(`/tickets?state=${e.target.value}`),
    [router],
  );

  // ✅ Stable click handler factory
  const handleCardClick = useCallback(
    (id) => router.push(`/tickets/${id}`),
    [router],
  );

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
        : "आपकी Tickets";

  const emptyLabel = search.trim()
    ? `"${search}" से कोई ticket नहीं मिली`
    : EMPTY_LABELS[state] || "कोई ticket नहीं मिली";

  /* ─────────────── RENDER ─────────────── */
  return (
    <Box minH="100vh" bg="#fafafa" py={10} px={{ base: 4, md: 8 }}>
      <Box maxW="860px" mx="auto">
        {loading || isFetching ? (
          <SkeletonList />
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
                  मिली
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
                  placeholder="Title या ID से खोजें..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  focusBorderColor="#fa7602"
                  _placeholder={{ color: "gray.400" }}
                />
              </InputGroup>
              <Select
                w={{ base: "100%", sm: "180px" }}
                h="42px"
                borderRadius="10px"
                borderColor="gray.200"
                bg="white"
                fontSize="sm"
                value={state}
                onChange={handleFilterChange}
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
                h="40vh"
                align="center"
                justify="center"
                flexDir="column"
                gap={3}
              >
                <Box fontSize="44px">🎫</Box>
                <Text
                  color="gray.400"
                  fontSize="lg"
                  fontWeight="600"
                  textAlign="center"
                >
                  {emptyLabel}
                </Text>
              </Flex>
            ) : (
              <VStack spacing={3} align="stretch">
                {filtered.map((ticket, i) => (
                  <TicketCard
                    key={ticket._id}
                    ticket={ticket}
                    index={i}
                    onClick={() => handleCardClick(ticket._id)}
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
