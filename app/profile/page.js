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
import withAuth from "@/utils/withAuth";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css";

/* ---------------- OVERVIEW CARD ---------------- */

const OverviewCard = ({
  title,
  value,
  subText,
  buttonText = "View",
  onClick,
}) => {
  return (
    <Box
      bg="white"
      boxShadow="rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px"
      borderRadius="lg"
      p={5}
      minH="120px"
    >
      <Text fontSize="sm" color="gray.500">
        {title}
      </Text>

      <Text fontSize="2xl" fontWeight="bold" mt={1}>
        {value}
      </Text>

      <Flex align="center" justify="space-between" mt={2}>
        {subText && (
          <Text fontSize="xs" color="gray.500">
            {subText}
          </Text>
        )}

        <Button
          size="xs"
          variant="outline"
          borderColor="#fa6702"
          color="#fa6702"
          _hover={{ bg: "#fa6702", color: "white" }}
          onClick={onClick}
        >
          {buttonText}
        </Button>
      </Flex>
    </Box>
  );
};

/* ---------------- MAIN PAGE ---------------- */

const Page = () => {
  const { user, loading, logout, accessToken } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  /* ---------------- FETCH STATS ---------------- */
  useEffect(() => {
    if (!accessToken) return;

    const fetchStats = async () => {
      try {
        const res = await fetch("/api/user/stats", {
          headers: { Authorization: accessToken },
        });

        const data = await res.json();

        if (res.ok) {
          setStats(data);
        }
      } catch (err) {
        console.error("Stats fetch error:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [accessToken]);

  return (
    <Box
      w="100%"
      pt="90px"
      pb="40px"
      display="flex"
      justifyContent="center"
      px={{ base: 3, md: 6 }}
      mt="8vh"
    >
      {loading || statsLoading ? (
        <Box w="100%" maxW="1100px">
          <Skeleton height="420px" borderRadius="md" />
        </Box>
      ) : (
        <Box w="100%" maxW="1100px">
          {/* ---------------- PROFILE HEADER ---------------- */}
          <Box
            rounded="md"
            py={6}
            px={{ base: 4, md: 8 }}
            boxShadow="rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px"
          >
            <Flex justify="space-between" align="center" mb={6}>
              <HStack>
                <Box w="4px" h="28px" bg="#fa7602" rounded="full" />
                <Text fontSize="xl" fontWeight="bold">
                  Profile Details
                </Text>
              </HStack>

              <Button
                size="sm"
                variant="outline"
                borderColor="#fa6702"
                color="#fa6702"
                _hover={{ bg: "#fa6702", color: "white" }}
                onClick={() => {
                  logout();
                  router.push("/");
                }}
              >
                Logout
              </Button>
            </Flex>

            <Flex
              align={{ base: "flex-start", md: "center" }}
              gap={12}
              direction={{ base: "column", md: "row" }}
            >
              <HStack spacing={4}>
                <Avatar size="xl" name={user?.name} />
                <Box>
                  <Text fontSize="lg" fontWeight="bold">
                    {user?.name}
                  </Text>
                </Box>
              </HStack>

              <Flex flex="1" gap={6} wrap="wrap">
                <VStack align="flex-start" spacing={1}>
                  <Text fontSize="xs" color="gray.400">
                    Role
                  </Text>
                  <Text fontSize="sm" fontWeight="semibold">
                    {user?.role}
                  </Text>
                </VStack>

                <VStack align="flex-start" spacing={1}>
                  <Text fontSize="xs" color="gray.400">
                    Email
                  </Text>
                  <Text fontSize="sm" fontWeight="semibold">
                    {user?.email || "Not provided"}
                  </Text>
                </VStack>

                <VStack align="flex-start" spacing={1}>
                  <Text fontSize="xs" color="gray.400">
                    Phone
                  </Text>
                  <Text fontSize="sm" fontWeight="semibold">
                    {user?.phone || user?.whatsapp || "Not provided"}
                  </Text>
                </VStack>
              </Flex>
            </Flex>
          </Box>

          {/* ---------------- OVERVIEW DASHBOARD ---------------- */}
          <SimpleGrid mt={6} columns={{ base: 1, sm: 2, md: 4 }} spacing={6}>
            {/* ADMIN */}
            {user?.role === "Admin" && (
              <>
                <OverviewCard
                  title="Total Tickets"
                  value={stats?.totalTickets ?? 0}
                  subText="All complaints"
                  onClick={() => router.push("/tickets?state=all")}
                />

                <OverviewCard
                  title="New Tickets"
                  value={stats?.stats?.submitted ?? 0}
                  subText="New tickets"
                  onClick={() => router.push("/tickets?state=submitted")}
                />

                <OverviewCard
                  title="In Progress"
                  value={stats?.stats?.inProgress ?? 0}
                  subText="Needs action"
                  onClick={() => router.push("/tickets?state=inProgress")}
                />

                <OverviewCard
                  title="Resolved/Closed"
                  value={stats?.stats?.completed ?? 0}
                  subText="Resolved & Closed"
                  onClick={() => router.push("/tickets?state=completed")}
                />

                <OverviewCard
                  title="Departments"
                  value={stats?.departmentCount ?? 0}
                  subText="Manage departments"
                  buttonText="Open"
                  onClick={() => router.push("/admin/departments")}
                />
              </>
            )}

            {/* DEPARTMENT */}
            {user?.role === "Department" && (
              <>
                <OverviewCard
                  title="Total Tickets"
                  value={stats?.totalTickets ?? 0}
                  onClick={() => router.push("/tickets")}
                />

                <OverviewCard
                  title="Assigned"
                  value={stats?.stats?.assigned ?? 0}
                  onClick={() => router.push("/tickets?state=assigned")}
                />

                <OverviewCard
                  title="In Progress"
                  value={stats?.stats?.inProgress ?? 0}
                  onClick={() => router.push("/tickets?state=inProgress")}
                />

                <OverviewCard
                  title="Completed"
                  value={stats?.stats?.completed ?? 0}
                  onClick={() => router.push("/tickets?state=completed")}
                />
              </>
            )}

            {/* USER */}
            {user?.role === "User" && (
              <>
                <OverviewCard
                  title="Tickets Created"
                  value={stats?.totalTickets ?? 0}
                  subText="Your issues"
                  onClick={() => router.push("/tickets")}
                />

                <OverviewCard
                  title="In Progress"
                  value={stats?.stats?.inProgress ?? 0}
                  subText="Awaiting resolution"
                  onClick={() => router.push("/tickets?state=inProgress")}
                />

                <OverviewCard
                  title="Completed"
                  value={stats?.stats?.completed ?? 0}
                  subText="Resolved issues"
                  onClick={() => router.push("/tickets?state=completed")}
                />

                <OverviewCard
                  title="Create Ticket"
                  value="+"
                  subText="Raise a new issue"
                  buttonText="Create"
                  onClick={() => router.push("/create-ticket")}
                />
              </>
            )}
          </SimpleGrid>

          {/* ---------------- FOOTER ---------------- */}
          <Box mt="12vh">
            <Divider maxW="80%" m="auto" borderColor="gray.300" />
            <Box
              w="100%"
              h="30vh"
              className={styles.icons}
              backgroundSize={{ base: "350px", md: "600px" }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default withAuth(Page);
