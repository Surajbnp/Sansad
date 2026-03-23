"use client";

import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Text,
  Button,
  Skeleton,
  Flex,
  HStack,
  VStack,
  Divider,
  SimpleGrid,
} from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css";



/* ─────────────────────────────────────────
   STAT CARD
───────────────────────────────────────── */
const StatCard = ({
  title,
  value,
  subText,
  buttonText = "View",
  onClick,
  delay = 0,
  icon,
}) => (
  <Box
    bg="white"
    borderRadius="16px"
    p={5}
    border="1px solid"
    borderColor="gray.100"
    boxShadow="0 2px 12px rgba(0,0,0,0.06)"
    position="relative"
    overflow="hidden"
    cursor="pointer"
    transition="all 0.25s ease"
    style={{ animationDelay: `${delay}ms` }}
    className={styles.cardIn}
    _hover={{
      transform: "translateY(-3px)",
      boxShadow: "0 8px 28px rgba(250,118,2,0.15)",
      borderColor: "#fa7602",
    }}

    onClick={onClick}

  >
    {/* orange accent bar on left */}
    <Box
      position="absolute"
      top={0}
      left={0}
      w="4px"
      h="100%"
      bg="#fa7602"
      borderRadius="16px 0 0 16px"

    />
    {icon && (
      <Box
        position="absolute"
        top="12px"
        right="12px"
      >
        {icon}
      </Box>
    )}
    <Text
      fontSize="xs"
      color="gray.400"
      fontWeight="600"
      letterSpacing="0.08em"
      textTransform="uppercase"
      mb={1}
    >
      {title}
    </Text>

    <Text
      fontSize="3xl"
      fontWeight="800"
      color="gray.800"
      lineHeight="1.1"
      mb={1}
    >
      {value}
    </Text>

    <Flex align="center" justify="space-between" mt={3}>
      {subText && (
        <Text fontSize="xs" color="gray.400">
          {subText}
        </Text>
      )}
      <Button
        size="xs"
        ml="auto"
        bg="#fa7602"
        color="white"
        borderRadius="full"
        px={3}
        fontSize="10px"
        fontWeight="700"
        letterSpacing="0.05em"
        _hover={{ bg: "#e06800", transform: "scale(1.05)" }}
        transition="all 0.2s"
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
      >
        {buttonText}
      </Button>
    </Flex>
  </Box>
);

/* ─────────────────────────────────────────
   INFO CHIP
───────────────────────────────────────── */
const InfoChip = ({ label, value }) => (
  <Box bg="gray.50" borderRadius="12px" px={4} py={3} minW="130px">
    <Text
      fontSize="10px"
      color="gray.400"
      fontWeight="700"
      letterSpacing="0.1em"
      textTransform="uppercase"
      mb="2px"
    >
      {label}
    </Text>
    <Text fontSize="sm" fontWeight="600" color="gray.700">
      {value || "—"}
    </Text>
  </Box>
);

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
const Page = () => {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  /* fetch stats — cookie sent automatically, no token header needed */
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/user/stats");
        const data = await res.json();
        if (res.ok) setStats(data);
      } catch (err) {
        console.error("Stats fetch error:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const isLoading = loading || statsLoading;

  /* role badge */
  const roleMeta = {
    Admin: { bg: "#fff3e0", color: "#e65100" },
    Department: { bg: "#e8f5e9", color: "#2e7d32" },
    User: { bg: "#e3f2fd", color: "#1565c0" },
  };
  const badge = roleMeta[user?.role] ?? roleMeta.User;

  return (
    <Box minH="100vh" bg="#fafafa" pt="100px" pb="60px" px={{ base: 4, md: 8 }}>
      <Box maxW="1100px" mx="auto">
        {isLoading ? (
          <VStack spacing={4}>
            <Skeleton height="180px" borderRadius="20px" w="100%" />
            <SimpleGrid
              columns={{ base: 1, sm: 2, md: 4 }}
              spacing={4}
              w="100%"
            >
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} height="130px" borderRadius="16px" />
              ))}
            </SimpleGrid>
          </VStack>
        ) : (
          <>
            {/* ── PROFILE HEADER ── */}
            <Box
              bg="white"
              borderRadius="20px"
              border="1px solid"
              borderColor="gray.100"
              boxShadow="0 2px 16px rgba(0,0,0,0.06)"
              p={{ base: 5, md: 8 }}
              mb={6}
            >
              <Flex
                justify="space-between"
                align="flex-start"
                wrap="wrap"
                gap={4}
              >
                <HStack spacing={5} align="center">
                  <Box position="relative">
                    <Avatar
                      size="xl"
                      name={user?.name}
                      bg="#fa7602"
                      color="white"
                      fontWeight="800"
                      fontSize="xl"
                    />
                    {/* online dot */}
                    <Box
                      position="absolute"
                      bottom="2px"
                      right="2px"
                      w="14px"
                      h="14px"
                      bg="green.400"
                      borderRadius="full"
                      border="2px solid white"
                    />
                  </Box>

                  <Box>
                    <Text
                      fontSize={{ base: "xl", md: "2xl" }}
                      fontWeight="800"
                      color="gray.800"
                      lineHeight="1.2"
                    >
                      {user?.name}
                    </Text>
                    <Box
                      display="inline-block"
                      mt={1}
                      bg={badge.bg}
                      color={badge.color}
                      fontSize="11px"
                      fontWeight="700"
                      px={3}
                      py="2px"
                      borderRadius="full"
                      letterSpacing="0.06em"
                    >
                      {user?.role}
                    </Box>
                  </Box>
                </HStack>

                <Button
                  size="sm"
                  variant="outline"
                  borderColor="gray.200"
                  color="gray.500"
                  borderRadius="full"
                  px={5}
                  fontWeight="600"
                  fontSize="sm"
                  _hover={{
                    bg: "red.50",
                    borderColor: "red.300",
                    color: "red.500",
                  }}
                  transition="all 0.2s"
                  onClick={logout}
                >
                  Logout
                </Button>
              </Flex>

              {/* info chips */}
              <Flex mt={6} gap={3} wrap="wrap">
                <InfoChip label="Phone" value={user?.phone} />
                <InfoChip label="Vidhan Sabha" value={user?.vidhansabha} />
                <InfoChip label="Address" value={user?.address} />
                {user?.voterId && (
                  <InfoChip label="Voter ID" value={user?.voterId} />
                )}
              </Flex>
            </Box>

            {/* ── SECTION HEADING ── */}
            <HStack mb={4} spacing={3}>
              <Box w="4px" h="22px" bg="#fa7602" borderRadius="full" />
              <Text
                fontSize="md"
                fontWeight="700"
                color="gray.700"
                letterSpacing="0.02em"
              >
                Overview
              </Text>
            </HStack>

            {/* ── STAT CARDS ── */}
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={4}>
              {user?.role === "Admin" && (
                <>
                  <StatCard
                    delay={0}
                    title="Total Tickets"
                    value={stats?.totalTickets ?? 0}
                    subText="All complaints"
                    onClick={() => router.push("/tickets?state=all")}
                    icon={
                      <img src="/dashboard_create-ticket.svg" width={28} height={28} />
                    }
                  />
                  <StatCard
                    delay={60}
                    title="New"
                    value={stats?.stats?.submitted ?? 0}
                    subText="Awaiting triage"
                    onClick={() => router.push("/tickets?state=submitted")}
                    icon={
                      <img src="/dashboard_add.svg" width={28} height={28} />
                    }
                  />
                  <StatCard
                    delay={120}
                    title="In Progress"
                    value={stats?.stats?.inProgress ?? 0}
                    subText="Needs action"
                    onClick={() => router.push("/tickets?state=inProgress")}
                    icon={
                      <img src="/dashboard_progress.svg" width={28} height={28} />
                    }
                  />
                  <StatCard
                    delay={180}
                    title="Resolved"
                    value={stats?.stats?.completed ?? 0}
                    subText="Closed & resolved"
                    onClick={() => router.push("/tickets?state=completed")}
                    icon={
                      <img src="/dashboard_completed.svg" width={28} height={28} />
                    }
                  />
                  <StatCard
                    delay={240}
                    title="Departments"
                    value={stats?.departmentCount ?? 0}
                    subText="Active departments"
                    buttonText="Open"
                    onClick={() => router.push("/admin/departments")}
                    icon={
                      <img src="/dashboard_add.svg" width={28} height={28} />
                    }
                  />
                </>
              )}

              {user?.role === "Department" && (
                <>
                  <StatCard
                    delay={0}
                    title="Total Tickets"
                    value={stats?.totalTickets ?? 0}
                    onClick={() => router.push("/tickets")}
                  />
                  <StatCard
                    delay={60}
                    title="Assigned"
                    value={stats?.stats?.assigned ?? 0}
                    onClick={() => router.push("/tickets?state=assigned")}
                  />
                  <StatCard
                    delay={120}
                    title="In Progress"
                    value={stats?.stats?.inProgress ?? 0}
                    onClick={() => router.push("/tickets?state=inProgress")}
                  />
                  <StatCard
                    delay={180}
                    title="Completed"
                    value={stats?.stats?.completed ?? 0}
                    onClick={() => router.push("/tickets?state=completed")}
                  />
                </>
              )}

              {user?.role === "User" && (
                <>
                  <StatCard
                    delay={0}
                    title="Tickets Created"
                    value={stats?.totalTickets ?? 0}
                    subText="Your issues"
                    onClick={() => router.push("/tickets")}
                  />
                  <StatCard
                    delay={60}
                    title="In Progress"
                    value={stats?.stats?.inProgress ?? 0}
                    subText="Being resolved"
                    onClick={() => router.push("/tickets?state=inProgress")}
                  />
                  <StatCard
                    delay={120}
                    title="Completed"
                    value={stats?.stats?.completed ?? 0}
                    subText="Resolved"
                    onClick={() => router.push("/tickets?state=completed")}
                  />
                  <StatCard
                    delay={180}
                    title="New Ticket"
                    value="+"
                    subText="Raise an issue"
                    buttonText="Create"
                    onClick={() => router.push("/create-ticket")}
                  />
                </>
              )}
            </SimpleGrid>

            {/* ── FOOTER ── */}
            <Box mt="80px">
              <Divider borderColor="gray.200" />
              <Box
                w="100%"
                h="30vh"
                className={styles.icons}
                backgroundSize={{ base: "350px", md: "600px" }}
              />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Page;
