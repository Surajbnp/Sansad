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
  SimpleGrid,
  Divider,
} from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css";
import { useTitle } from "@/hooks/useTitle";
import { SiTicktick } from "react-icons/si";
import { RiProgress6Line } from "react-icons/ri";
import { IoMdAddCircleOutline } from "react-icons/io";
import {
  MdOutlineConfirmationNumber,
  MdOutlineDashboard,
  MdOutlineCheckCircle,
  MdOutlineHourglassEmpty,
  MdOutlineBusinessCenter,
  MdOutlineAssignment,
  MdPhone,
  MdLocationOn,
  MdBadge,
  MdAccountCircle,
  MdLogout,
  MdArrowForwardIos,
} from "react-icons/md";

/* ─────────────────────────────────────────
   STAT CARD — compact horizontal layout
───────────────────────────────────────── */
const StatCard = ({
  title,
  value,
  subText,
  buttonText = "View",
  onClick,
  delay = 0,
  icon,
  accentColor = "#fa7602",
}) => (
  <Box
    bg="white"
    borderRadius="12px"
    p={4}
    border="1px solid"
    borderColor="gray.100"
    boxShadow="0 1px 4px rgba(0,0,0,0.05)"
    cursor="pointer"
    transition="all 0.2s ease"
    style={{ animationDelay: `${delay}ms` }}
    className={styles.cardIn}
    _hover={{
      boxShadow: "0 4px 16px rgba(250,118,2,0.1)",
      borderColor: "#fa7602",
      bg: "#fffcf9",
    }}
    onClick={onClick}
  >
    <Flex align="center" justify="space-between" mb={3}>
      <Box
        w="34px"
        h="34px"
        borderRadius="9px"
        bg="#fff3e0"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="#fa7602"
        fontSize="16px"
      >
        {icon}
      </Box>
      <Box as={MdArrowForwardIos} fontSize="11px" color="gray.300" />
    </Flex>

    <Text fontSize="22px" fontWeight="700" color="gray.800" lineHeight="1">
      {value}
    </Text>
    <Text
      fontSize="11px"
      fontWeight="500"
      color="gray.400"
      mt="4px"
      letterSpacing="0.02em"
    >
      {title}
    </Text>
    {subText && (
      <Text fontSize="10px" color="gray.300" mt="2px">
        {subText}
      </Text>
    )}
  </Box>
);

/* ─────────────────────────────────────────
   INFO ROW
───────────────────────────────────────── */
const InfoRow = ({ icon, label, value }) => (
  <HStack spacing={3} py={2}>
    <Box color="#fa7602" fontSize="15px" flexShrink={0}>
      {icon}
    </Box>
    <Box>
      <Text
        fontSize="10px"
        color="gray.400"
        fontWeight="600"
        letterSpacing="0.06em"
        textTransform="uppercase"
      >
        {label}
      </Text>
      <Text fontSize="13px" color="gray.700" fontWeight="500">
        {value || "—"}
      </Text>
    </Box>
  </HStack>
);

/* ─────────────────────────────────────────
   ROLE BADGE CONFIG
───────────────────────────────────────── */
const ROLE_META = {
  Admin: { bg: "#fff3e0", color: "#e65100", dot: "#fa7602" },
  Department: { bg: "#e8f5e9", color: "#2e7d32", dot: "#43a047" },
  User: { bg: "#e3f2fd", color: "#1565c0", dot: "#1976d2" },
};

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
const Page = () => {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  useTitle("Profile | सांसद सुविधा केंद्र – सतना-मैहर");

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

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
  const badge = ROLE_META[user?.role] ?? ROLE_META.User;

  return (
    <Box minH="100vh" bg="#f7f7f5" pt={8} px={{ base: 4, md: 8 }} pb={16}>
      <Box maxW="960px" mx="auto">
        {isLoading ? (
          <VStack spacing={4}>
            <Skeleton height="140px" borderRadius="14px" w="100%" />
            <SimpleGrid
              columns={{ base: 1, sm: 2, md: 4 }}
              spacing={3}
              w="100%"
            >
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} height="110px" borderRadius="12px" />
              ))}
            </SimpleGrid>
          </VStack>
        ) : (
          <>
            {/* ── PROFILE CARD ── */}
            <Box
              bg="white"
              borderRadius="14px"
              border="1px solid"
              borderColor="gray.100"
              boxShadow="0 1px 6px rgba(0,0,0,0.05)"
              overflow="hidden"
              mb={5}
            >
              {/* thin top bar */}

              <Flex
                direction={{ base: "column", sm: "row" }}
                align={{ base: "flex-start", sm: "center" }}
                justify="space-between"
                px={{ base: 5, md: 7 }}
                py={5}
                gap={4}
                borderBottom="1px solid"
                borderColor="gray.50"
              >
                <HStack spacing={4}>
                  <Box position="relative">
                    <Avatar
                      size="lg"
                      name={user?.name}
                      bg="#fa7602"
                      color="white"
                      fontWeight="700"
                      fontSize="lg"
                    />
                    <Box
                      position="absolute"
                      bottom="1px"
                      right="1px"
                      w="11px"
                      h="11px"
                      bg="green.400"
                      borderRadius="full"
                      border="2px solid white"
                    />
                  </Box>

                  <Box>
                    <Text
                      fontSize="lg"
                      fontWeight="700"
                      color="gray.800"
                      lineHeight="1.2"
                    >
                      {user?.name}
                    </Text>
                    <HStack spacing={2} mt="5px">
                      <Box w="6px" h="6px" borderRadius="full" bg={badge.dot} />
                      <Text
                        fontSize="11px"
                        fontWeight="600"
                        color={badge.color}
                        letterSpacing="0.05em"
                      >
                        {user?.role}
                      </Text>
                    </HStack>
                  </Box>
                </HStack>

                <Button
                  size="sm"
                  variant="ghost"
                  color="gray.400"
                  borderRadius="8px"
                  fontWeight="500"
                  fontSize="13px"
                  leftIcon={<MdLogout />}
                  _hover={{ bg: "red.50", color: "red.500" }}
                  transition="all 0.15s"
                  onClick={logout}
                >
                  Logout
                </Button>
              </Flex>

              {/* info rows */}
              <Box px={{ base: 5, md: 7 }} py={4}>
                <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={0}>
                  <InfoRow
                    icon={<MdPhone />}
                    label="Phone"
                    value={user?.phone ? `+91 ${user.phone}` : null}
                  />
                  <InfoRow
                    icon={<MdLocationOn />}
                    label="Vidhan Sabha"
                    value={user?.vidhansabha}
                  />
                  <InfoRow
                    icon={<MdAccountCircle />}
                    label="Address"
                    value={user?.address}
                  />
                  {user?.voterId && (
                    <InfoRow
                      icon={<MdBadge />}
                      label="Voter ID"
                      value={user?.voterId}
                    />
                  )}
                </SimpleGrid>
              </Box>
            </Box>

            {/* ── SECTION LABEL ── */}
            <Text
              fontSize="11px"
              fontWeight="600"
              color="gray.400"
              letterSpacing="0.1em"
              textTransform="uppercase"
              mb={3}
            >
              Overview
            </Text>

            {/* ── STAT CARDS ── */}
            <SimpleGrid columns={{ base: 2, sm: 2, md: 4 }} spacing={3}>
              {user?.role === "Admin" && (
                <>
                  <StatCard
                    delay={0}
                    title="Total Tickets"
                    value={stats?.totalTickets ?? 0}
                    subText="All complaints"
                    onClick={() => router.push("/tickets?state=all")}
                    icon={<MdOutlineConfirmationNumber />}
                  />
                  <StatCard
                    delay={50}
                    title="New"
                    value={stats?.stats?.submitted ?? 0}
                    subText="Awaiting triage"
                    onClick={() => router.push("/tickets?state=submitted")}
                    icon={<IoMdAddCircleOutline />}
                  />
                  <StatCard
                    delay={100}
                    title="In Progress"
                    value={stats?.stats?.inProgress ?? 0}
                    subText="Needs action"
                    onClick={() => router.push("/tickets?state=inProgress")}
                    icon={<RiProgress6Line />}
                  />
                  <StatCard
                    delay={150}
                    title="Resolved"
                    value={stats?.stats?.completed ?? 0}
                    subText="Closed & resolved"
                    onClick={() => router.push("/tickets?state=completed")}
                    icon={<MdOutlineCheckCircle />}
                  />
                  <StatCard
                    delay={200}
                    title="Departments"
                    value={stats?.departmentCount ?? 0}
                    subText="Active departments"
                    buttonText="Open"
                    onClick={() => router.push("/admin/departments")}
                    icon={<MdOutlineBusinessCenter />}
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
                    icon={<MdOutlineConfirmationNumber />}
                  />
                  <StatCard
                    delay={50}
                    title="Assigned"
                    value={stats?.stats?.assigned ?? 0}
                    onClick={() => router.push("/tickets?state=assigned")}
                    icon={<MdOutlineAssignment />}
                  />
                  <StatCard
                    delay={100}
                    title="In Progress"
                    value={stats?.stats?.inProgress ?? 0}
                    onClick={() => router.push("/tickets?state=inProgress")}
                    icon={<RiProgress6Line />}
                  />
                  <StatCard
                    delay={150}
                    title="Completed"
                    value={stats?.stats?.completed ?? 0}
                    onClick={() => router.push("/tickets?state=completed")}
                    icon={<MdOutlineCheckCircle />}
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
                    icon={<MdOutlineConfirmationNumber />}
                  />
                  <StatCard
                    delay={50}
                    title="In Progress"
                    value={stats?.stats?.inProgress ?? 0}
                    subText="Being resolved"
                    onClick={() => router.push("/tickets?state=inProgress")}
                    icon={<RiProgress6Line />}
                  />
                  <StatCard
                    delay={100}
                    title="Completed"
                    value={stats?.stats?.completed ?? 0}
                    subText="Resolved"
                    onClick={() => router.push("/tickets?state=completed")}
                    icon={<MdOutlineCheckCircle />}
                  />
                  <StatCard
                    delay={150}
                    title="New Ticket"
                    value="+"
                    subText="Raise an issue"
                    buttonText="Create"
                    onClick={() => router.push("/create-ticket")}
                    icon={<IoMdAddCircleOutline />}
                  />
                </>
              )}
            </SimpleGrid>

            {/* ── FOOTER ── */}
            <Box mt={16}>
              <Divider borderColor="gray.100" />
              <Box
                w="100%"
                h={{base : "20vh", md: "30vh"}}
                className={styles.icons}
                backgroundSize={{ base: "100%", md: "600px" }}
                borderRadius={"md"}
                overflow={"hidden"}
              />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Page;
