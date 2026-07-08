"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import styles from "./tickets.module.css";
import { TICKET_TYPES } from "@/constants/ticketTypes";
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
  SimpleGrid,
  Tag,
  TagLabel,
  TagCloseButton,
  FormControl,
  FormLabel,
  Badge,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";
import { IoMdCreate } from "react-icons/io";
import { 
  MdSearch, 
  MdFilterList, 
  MdClear, 
  MdDownload, 
  MdFileDownload, 
  MdPictureAsPdf, 
  MdGridOn,
  MdAssessment,
  MdBarChart,
  MdPrint,
  MdShare
} from "react-icons/md";
import { FaFileCsv, FaFileExcel, FaFilePdf } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import LOCATION_DATA from "@/data/location";

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
  closed: "closed",
};

const EMPTY_LABELS = {
  submitted: "कोई submitted ticket नहीं है",
  assigned: "कोई assigned ticket नहीं है",
  inprogress: "कोई in-progress ticket नहीं है",
  completed: "कोई completed ticket नहीं है",
  All: "अभी कोई ticket नहीं है",
};

// ✅ Location helper functions
const DISTRICT_OPTIONS = Object.keys(LOCATION_DATA);

const getTehsilOptions = (district) =>
  district && LOCATION_DATA[district]
    ? Object.keys(LOCATION_DATA[district].tehsils)
    : [];

const getVidhansabhaOptions = (district) => {
  if (!district || !LOCATION_DATA[district]) return [];
  return Array.from(
    new Set(
      Object.values(LOCATION_DATA[district].tehsils).map(
        (tehsil) => tehsil.vidhansabha,
      ),
    ),
  );
};

const getJanpadOptions = (district, tehsil) => {
  if (!district || !tehsil || !LOCATION_DATA[district]) return [];
  const tehsilData = LOCATION_DATA[district].tehsils?.[tehsil];
  return tehsilData?.janpad ? [tehsilData.janpad] : [];
};

const getPoliceStationOptions = (district, tehsil, janpad) => {
  if (!district || !tehsil || !janpad || !LOCATION_DATA[district]) return [];
  const tehsilData = LOCATION_DATA[district].tehsils?.[tehsil];
  if (!tehsilData || tehsilData.janpad !== janpad) return [];
  return tehsilData.policeStations || [];
};

// ✅ Department Options
const getDepartmentOptions = (tickets) => {
  const depts = tickets
    .map(t => t.assignedDept)
    .filter(Boolean);
  return [...new Set(depts)].sort();
};

/* ── Ticket Card ── */
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
          <HStack spacing={1} mt={1} flexWrap="wrap">
            {ticket.userDetails?.district && (
              <Tag size="sm" variant="subtle" colorScheme="blue">
                <TagLabel>{ticket.userDetails.district}</TagLabel>
              </Tag>
            )}
            {ticket.userDetails?.tehsil && (
              <Tag size="sm" variant="subtle" colorScheme="green">
                <TagLabel>{ticket.userDetails.tehsil}</TagLabel>
              </Tag>
            )}
            {ticket.userDetails?.janpad && (
              <Tag size="sm" variant="subtle" colorScheme="purple">
                <TagLabel>{ticket.userDetails.janpad}</TagLabel>
              </Tag>
            )}
            {ticket.userDetails?.vidhansabha && (
              <Tag size="sm" variant="subtle" colorScheme="orange">
                <TagLabel>{ticket.userDetails.vidhansabha}</TagLabel>
              </Tag>
            )}
          </HStack>
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
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [tickets, setTickets] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [exportLoading, setExportLoading] = useState(false);

  // ✅ Filter states
  const [filters, setFilters] = useState({
    district: "",
    tehsil: "",
    janpad: "",
    vidhansabha: "",
    policeStation: "",
    department: "",
  });

  const rawState = searchParams.get("state") || "All";
  const state = PARAM_TO_OPTION[rawState.toLowerCase()] || "All";

  // ✅ SMS link redirect
  useEffect(() => {
    const id = searchParams.get("id");
    if (!id || loading) return;

    if (user) {
      router.replace(`/tickets/${id}`);
    } else {
      router.replace(`/ticket-status?id=${id}`);
    }
  }, [searchParams, user, loading]);

  // ✅ Handle filter change - Proper reset of dependent fields
  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      if (key === "district") {
        return {
          district: value,
          tehsil: "",
          janpad: "",
          policeStation: "",
          vidhansabha: "",
          department: prev.department,
        };
      }
      if (key === "tehsil") {
        const janpad = getJanpadOptions(prev.district, value)[0] || "";
        const vidhansabha = getVidhansabhaOptions(prev.district)[0] || "";
        return {
          ...prev,
          tehsil: value,
          janpad: janpad,
          policeStation: "",
          vidhansabha: vidhansabha,
        };
      }
      if (key === "janpad") {
        return {
          ...prev,
          janpad: value,
          policeStation: "",
        };
      }
      return { ...prev, [key]: value };
    });
  };

  // ✅ Fetch tickets with filters
  const fetchTickets = useCallback(async () => {
    if (!user) return;
    setIsFetching(true);
    try {
      const params = new URLSearchParams();
      params.set("state", state);
      if (fromDate) params.set("start", fromDate);
      if (toDate) params.set("end", toDate);

      // ✅ Only add filters for Admin users
      if (user?.role === "Admin") {
        Object.entries(filters).forEach(([key, value]) => {
          if (value && value.trim() !== "") {
            params.set(key, value);
          }
        });
      }

      console.log("📤 Fetching tickets with params:", params.toString());

      const res = await fetch(`/api/ticket/tickets?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      console.log("📥 Received tickets:", data.tickets?.length || 0);
      setTickets(data.tickets || []);
    } catch (err) {
      console.error("Fetch error:", err);
      toast({
        title: "Tickets लोड नहीं हो सके",
        description: err.message,
        status: "error",
      });
    } finally {
      setIsFetching(false);
    }
  }, [user, state, fromDate, toDate, filters]);

  useEffect(() => {
    if (searchParams.get("id")) return;
    fetchTickets();
  }, [fetchTickets]);

  // ✅ Apply filters
  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    params.set("state", state);
    if (fromDate) params.set("start", fromDate);
    if (toDate) params.set("end", toDate);
    
    // ✅ Only add filters for Admin users
    if (user?.role === "Admin") {
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value.trim() !== "") {
          params.set(key, value);
        }
      });
    }
    
    router.replace(`/tickets?${params.toString()}`);
    fetchTickets();
  }, [router, state, fromDate, toDate, filters, fetchTickets, user]);

  // ✅ Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      district: "",
      tehsil: "",
      janpad: "",
      vidhansabha: "",
      policeStation: "",
      department: "",
    });
    setFromDate("");
    setToDate("");
    setSearch("");

    const params = new URLSearchParams();
    params.set("state", state);
    router.replace(`/tickets?${params.toString()}`);
    fetchTickets();
  }, [router, state, fetchTickets]);

  const handleCardClick = useCallback(
    (id) => router.push(`/tickets/${id}`),
    [router]
  );

  // ✅ Filter tickets by search
  const filtered = useMemo(() => {
    return tickets.filter(
      (t) =>
        !search.trim() ||
        t.title?.toLowerCase().includes(search.toLowerCase()) ||
        t._id?.toLowerCase().includes(search.toLowerCase()) ||
        t.userDetails?.name?.toLowerCase().includes(search.toLowerCase()) ||
        t.userDetails?.phone?.includes(search)
    );
  }, [tickets, search]);

  // ✅ Get department options from all tickets
  const departmentOptions = useMemo(() => {
    const depts = tickets
      .map(t => t.assignedDept)
      .filter(Boolean);
    return [...new Set(depts)].sort();
  }, [tickets]);

  // ✅ Filter fields - Only for Admin
  const filterFields = useMemo(() => {
    // Admin ke liye hi filter fields available hain
    if (user?.role !== "Admin") return [];
    
    return [
      {
        key: "district",
        label: "जिला",
        sublabel: "District",
        icon: "🗺️",
        options: DISTRICT_OPTIONS,
      },
      {
        key: "tehsil",
        label: "तहसील",
        sublabel: "Tehsil",
        icon: "🏞️",
        options: getTehsilOptions(filters.district),
        dependsOn: "district",
      },
      {
        key: "vidhansabha",
        label: "विधान सभा",
        sublabel: "Constituency",
        icon: "🏛️",
        options: getVidhansabhaOptions(filters.district),
        dependsOn: "district",
      },
      {
        key: "janpad",
        label: "जनपद",
        sublabel: "Janpad",
        icon: "🏘️",
        options: getJanpadOptions(filters.district, filters.tehsil),
        dependsOn: "tehsil",
      },
      {
        key: "policeStation",
        label: "थाना",
        sublabel: "Police Station",
        icon: "👮",
        options: getPoliceStationOptions(filters.district, filters.tehsil, filters.janpad),
        dependsOn: "janpad",
      },
      {
        key: "department",
        label: "विभाग",
        sublabel: "Department",
        icon: "🏢",
        options: TICKET_TYPES,
      },
    ];
  }, [user, filters.district, filters.tehsil, filters.janpad, departmentOptions]);

  // ✅ Export functions
  const exportData = async (format) => {
    setExportLoading(true);
    try {
      const params = new URLSearchParams();
      if (fromDate) params.set("start", fromDate);
      if (toDate) params.set("end", toDate);
      
      // ✅ Only add filters for Admin users
      if (user?.role === "Admin") {
        Object.entries(filters).forEach(([key, value]) => {
          if (value && value.trim() !== "") {
            params.set(key, value);
          }
        });
      }

      const url = `/api/export-tickets${params.toString() ? `?${params.toString()}` : ""}`;
      console.log("📤 Exporting with params:", params.toString());
      
      const res = await fetch(url);
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const extension = format === "pdf" ? "pdf" : format === "csv" ? "csv" : "xlsx";
      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(blob);
      a.download = `Tickets_Report_${new Date().toISOString().split('T')[0]}.${extension}`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      toast({
        title: `Report exported successfully!`,
        status: "success",
        duration: 3000,
      });
    } catch (err) {
      console.error("Export error:", err);
      toast({
        title: "Export failed",
        description: err.message,
        status: "error",
      });
    } finally {
      setExportLoading(false);
    }
  };

  const pageTitle =
    user?.role === "Admin"
      ? "All Tickets"
      : user?.role === "Department"
        ? "Department Tickets"
        : "आपकी Tickets";

  const emptyLabel = search.trim()
    ? `"${search}" से कोई ticket नहीं मिली`
    : EMPTY_LABELS[state] || "कोई ticket नहीं मिली";

  // ✅ Active filter count - sirf Admin ke liye
  const activeFilterCount = user?.role === "Admin" 
    ? Object.values(filters).filter(Boolean).length + (fromDate ? 1 : 0) + (toDate ? 1 : 0)
    : (fromDate ? 1 : 0) + (toDate ? 1 : 0);

  // ✅ Statistics
  const stats = useMemo(() => {
    const total = filtered.length;
    const byStatus = {};
    const byDistrict = {};
    const byDepartment = {};
    const byTehsil = {};
    const byJanpad = {};
    const byVidhansabha = {};
    const byPoliceStation = {};

    filtered.forEach(t => {
      const status = t.status || "Unknown";
      byStatus[status] = (byStatus[status] || 0) + 1;

      const district = t.userDetails?.district || "Unknown";
      byDistrict[district] = (byDistrict[district] || 0) + 1;

      const tehsil = t.userDetails?.tehsil || "Unknown";
      byTehsil[tehsil] = (byTehsil[tehsil] || 0) + 1;

      const janpad = t.userDetails?.janpad || "Unknown";
      byJanpad[janpad] = (byJanpad[janpad] || 0) + 1;

      const vidhansabha = t.userDetails?.vidhansabha || "Unknown";
      byVidhansabha[vidhansabha] = (byVidhansabha[vidhansabha] || 0) + 1;

      const policeStation = t.userDetails?.policeStation || "Unknown";
      byPoliceStation[policeStation] = (byPoliceStation[policeStation] || 0) + 1;

      const dept = t.assignedDept || "Unassigned";
      byDepartment[dept] = (byDepartment[dept] || 0) + 1;
    });

    return { 
      total, 
      byStatus, 
      byDistrict, 
      byDepartment,
      byTehsil,
      byJanpad,
      byVidhansabha,
      byPoliceStation
    };
  }, [filtered]);

  return (
    <Box minH="100vh" bg="#fafafa" py={10} px={{ base: 4, md: 8 }}>
      <Box maxW="1200px" mx="auto">
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
                  {filtered.length} ticket{filtered.length !== 1 ? "s" : ""} मिली
                  {activeFilterCount > 0 && ` (${activeFilterCount} filters active)`}
                </Text>
              </Box>
              <HStack spacing={2}>
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
                
                {/* ✅ Export Button - Only for Admin */}
                {user?.role === "Admin" && (
                  <Menu>
                    <MenuButton
                      as={Button}
                      colorScheme="green"
                      size="sm"
                      h="40px"
                      leftIcon={<MdDownload />}
                      isLoading={exportLoading}
                      loadingText="Exporting..."
                    >
                      Export Report
                    </MenuButton>
                    <MenuList>
                      <MenuItem icon={<FaFileExcel color="#217346" />} onClick={() => exportData("excel")}>
                        Excel (.xlsx)
                      </MenuItem>
                      <MenuItem icon={<FaFileCsv color="#217346" />} onClick={() => exportData("csv")}>
                        CSV (.csv)
                      </MenuItem>
                      <MenuItem icon={<FaFilePdf color="#ff0000" />} onClick={() => exportData("pdf")}>
                        PDF (.pdf)
                      </MenuItem>
                    </MenuList>
                  </Menu>
                )}

                {/* ✅ Stats Button - Only for Admin */}
                {user?.role === "Admin" && (
                  <Button
                    variant="outline"
                    colorScheme="blue"
                    size="sm"
                    h="40px"
                    leftIcon={<MdAssessment />}
                    onClick={onOpen}
                  >
                    Statistics
                  </Button>
                )}
              </HStack>
            </Flex>

            {/* ── FILTERS ── */}
            {/* ✅ Filter section only for Admin users */}
            {user?.role === "Admin" && (
              <Box
                bg="white"
                p={4}
                borderRadius="14px"
                border="1px solid"
                borderColor="gray.200"
                mb={6}
                boxShadow="sm"
              >
                {/* Row 1: Search + Status */}
                <Flex gap={3} wrap="wrap" mb={4}>
                  <InputGroup flex={1} minW={{ base: "100%", md: "250px" }}>
                    <InputLeftElement pointerEvents="none" h="42px">
                      <MdSearch color="#a0aec0" size={18} />
                    </InputLeftElement>
                    <Input
                      h="42px"
                      bg="white"
                      borderRadius="10px"
                      placeholder="Search by ID, Title, Name, Phone..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      focusBorderColor="#fa7602"
                    />
                  </InputGroup>

                  <Select
                    w={{ base: "100%", md: "200px" }}
                    h="42px"
                    borderRadius="10px"
                    value={state}
                    onChange={(e) => {
                      const value = e.target.value;
                      const params = new URLSearchParams();
                      params.set("state", value);
                      Object.entries(filters).forEach(([key, val]) => {
                        if (val && val.trim() !== "") params.set(key, val);
                      });
                      if (fromDate) params.set("start", fromDate);
                      if (toDate) params.set("end", toDate);
                      router.replace(`/tickets?${params.toString()}`);
                      // Fetch with new status
                      const newState = value === "All" ? "All" : value;
                      fetchTickets();
                    }}
                    focusBorderColor="#fa7602"
                  >
                    <option value="All">All Status</option>
                    <option value="submitted">Submitted</option>
                    <option value="assigned">Assigned</option>
                    <option value="inprogress">In Progress</option>
                    <option value="completed">Completed</option>
                  </Select>
                </Flex>

                {/* Row 2: Location Filters */}
                <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 6 }} spacing={3} mb={4}>
                  {filterFields.map((field) => {
                    const isDisabled = field.dependsOn && !filters[field.dependsOn];
                    const placeholder = isDisabled
                      ? `पहले ${filterFields.find(f => f.key === field.dependsOn)?.label || ''} चुनें`
                      : field.key === "vidhansabha" && !filters.district
                      ? "पहले जिला चुनें"
                      : "चुनें / Select";

                    return (
                      <FormControl key={field.key}>
                        <FormLabel
                          fontSize="10px"
                          fontWeight="600"
                          color="gray.400"
                          letterSpacing="0.06em"
                          textTransform="uppercase"
                          mb={1}
                        >
                          {field.icon} {field.label}
                        </FormLabel>
                        <Select
                          placeholder={placeholder}
                          value={filters[field.key]}
                          isDisabled={isDisabled}
                          onChange={(e) => handleFilterChange(field.key, e.target.value)}
                          focusBorderColor="#fa7602"
                          size="sm"
                          h="38px"
                          borderRadius="8px"
                          bg={filters[field.key] ? "#fff9f5" : "white"}
                          borderColor={filters[field.key] ? "#fa7602" : "gray.200"}
                        >
                          <option value="">All</option>
                          {field.options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                    );
                  })}
                </SimpleGrid>

                {/* Row 3: Date Filters + Action Buttons */}
                <Flex gap={3} wrap="wrap" align="center">
                  <Input
                    type="date"
                    w={{ base: "100%", sm: "160px" }}
                    h="38px"
                    borderRadius="8px"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    focusBorderColor="#fa7602"
                    size="sm"
                    placeholder="From Date"
                  />

                  <Input
                    type="date"
                    w={{ base: "100%", sm: "160px" }}
                    h="38px"
                    borderRadius="8px"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    focusBorderColor="#fa7602"
                    size="sm"
                    placeholder="To Date"
                  />

                  <Button
                    h="38px"
                    colorScheme="orange"
                    px={6}
                    size="sm"
                    onClick={applyFilters}
                  >
                    Apply Filters
                  </Button>

                  {activeFilterCount > 0 && (
                    <Button
                      h="38px"
                      variant="ghost"
                      colorScheme="red"
                      size="sm"
                      leftIcon={<MdClear />}
                      onClick={clearFilters}
                    >
                      Clear All
                    </Button>
                  )}
                </Flex>

                {/* Active Filters Display */}
                {activeFilterCount > 0 && (
                  <Flex gap={2} mt={3} flexWrap="wrap">
                    {filters.district && (
                      <Tag size="sm" colorScheme="blue" borderRadius="full">
                        <TagLabel>District: {filters.district}</TagLabel>
                        <TagCloseButton onClick={() => { handleFilterChange("district", ""); applyFilters(); }} />
                      </Tag>
                    )}
                    {filters.tehsil && (
                      <Tag size="sm" colorScheme="green" borderRadius="full">
                        <TagLabel>Tehsil: {filters.tehsil}</TagLabel>
                        <TagCloseButton onClick={() => { handleFilterChange("tehsil", ""); applyFilters(); }} />
                      </Tag>
                    )}
                    {filters.janpad && (
                      <Tag size="sm" colorScheme="purple" borderRadius="full">
                        <TagLabel>Janpad: {filters.janpad}</TagLabel>
                        <TagCloseButton onClick={() => { handleFilterChange("janpad", ""); applyFilters(); }} />
                      </Tag>
                    )}
                    {filters.vidhansabha && (
                      <Tag size="sm" colorScheme="orange" borderRadius="full">
                        <TagLabel>Vidhansabha: {filters.vidhansabha}</TagLabel>
                        <TagCloseButton onClick={() => setFilters(prev => ({ ...prev, vidhansabha: "" }))} />
                      </Tag>
                    )}
                    {filters.policeStation && (
                      <Tag size="sm" colorScheme="red" borderRadius="full">
                        <TagLabel>Police Station: {filters.policeStation}</TagLabel>
                        <TagCloseButton onClick={() => setFilters(prev => ({ ...prev, policeStation: "" }))} />
                      </Tag>
                    )}
                    {filters.department && (
                      <Tag size="sm" colorScheme="teal" borderRadius="full">
                        <TagLabel>Department: {filters.department}</TagLabel>
                        <TagCloseButton onClick={() => setFilters(prev => ({ ...prev, department: "" }))} />
                      </Tag>
                    )}
                    {fromDate && (
                      <Tag size="sm" colorScheme="gray" borderRadius="full">
                        <TagLabel>From: {fromDate}</TagLabel>
                        <TagCloseButton onClick={() => setFromDate("")} />
                      </Tag>
                    )}
                    {toDate && (
                      <Tag size="sm" colorScheme="gray" borderRadius="full">
                        <TagLabel>To: {toDate}</TagLabel>
                        <TagCloseButton onClick={() => setToDate("")} />
                      </Tag>
                    )}
                  </Flex>
                )}
              </Box>
            )}

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

      {/* ── STATISTICS DRAWER ── */}
      {/* ✅ Statistics Drawer only for Admin */}
      {user?.role === "Admin" && (
        <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottom="1px solid" borderColor="gray.100">
              <HStack>
                <MdAssessment />
                <Text>Statistics & Reports</Text>
              </HStack>
            </DrawerHeader>

            <DrawerBody>
              <VStack spacing={6} align="stretch" pt={4}>
                {/* Total Tickets */}
                <Box bg="orange.50" p={4} borderRadius="12px" border="1px solid" borderColor="orange.200">
                  <Stat>
                    <StatLabel fontSize="sm" color="gray.600">Total Tickets</StatLabel>
                    <StatNumber fontSize="3xl" color="orange.600">{stats.total}</StatNumber>
                    <StatHelpText>
                      {activeFilterCount > 0 ? `${activeFilterCount} filters applied` : "All tickets"}
                    </StatHelpText>
                  </Stat>
                </Box>

                <Divider />

                {/* Status Wise */}
                {Object.keys(stats.byStatus).length > 0 && (
                  <Box>
                    <Text fontSize="sm" fontWeight="700" color="gray.700" mb={3}>
                      📊 Status Wise Distribution
                    </Text>
                    <SimpleGrid columns={2} spacing={2}>
                      {Object.entries(stats.byStatus).map(([status, count]) => {
                        const s = getStatusStyle(status);
                        return (
                          <Box key={status} bg={s.bg} p={3} borderRadius="8px" borderLeft="3px solid" borderColor={s.color}>
                            <Text fontSize="xs" color="gray.500">{status}</Text>
                            <Text fontSize="lg" fontWeight="700" color={s.color}>{count}</Text>
                          </Box>
                        );
                      })}
                    </SimpleGrid>
                  </Box>
                )}

                <Divider />

                {/* District Wise */}
                {Object.keys(stats.byDistrict).length > 0 && (
                  <Box>
                    <Text fontSize="sm" fontWeight="700" color="gray.700" mb={3}>
                      🗺️ District Wise Distribution
                    </Text>
                    <SimpleGrid columns={2} spacing={2}>
                      {Object.entries(stats.byDistrict).map(([district, count]) => (
                        <Box key={district} bg="blue.50" p={3} borderRadius="8px">
                          <Text fontSize="xs" color="gray.500">{district === "Unknown" ? "N/A" : district}</Text>
                          <Text fontSize="lg" fontWeight="700" color="blue.600">{count}</Text>
                        </Box>
                      ))}
                    </SimpleGrid>
                  </Box>
                )}

                <Divider />

                {/* Tehsil Wise */}
                {Object.keys(stats.byTehsil).length > 0 && (
                  <Box>
                    <Text fontSize="sm" fontWeight="700" color="gray.700" mb={3}>
                      🏘️ Tehsil Wise Distribution
                    </Text>
                    <SimpleGrid columns={2} spacing={2}>
                      {Object.entries(stats.byTehsil).map(([tehsil, count]) => (
                        <Box key={tehsil} bg="green.50" p={3} borderRadius="8px">
                          <Text fontSize="xs" color="gray.500">{tehsil === "Unknown" ? "N/A" : tehsil}</Text>
                          <Text fontSize="lg" fontWeight="700" color="green.600">{count}</Text>
                        </Box>
                      ))}
                    </SimpleGrid>
                  </Box>
                )}

                <Divider />

                {/* Janpad Wise */}
                {Object.keys(stats.byJanpad).length > 0 && (
                  <Box>
                    <Text fontSize="sm" fontWeight="700" color="gray.700" mb={3}>
                      🏘️ Janpad Wise Distribution
                    </Text>
                    <SimpleGrid columns={2} spacing={2}>
                      {Object.entries(stats.byJanpad).map(([janpad, count]) => (
                        <Box key={janpad} bg="purple.50" p={3} borderRadius="8px">
                          <Text fontSize="xs" color="gray.500">{janpad === "Unknown" ? "N/A" : janpad}</Text>
                          <Text fontSize="lg" fontWeight="700" color="purple.600">{count}</Text>
                        </Box>
                      ))}
                    </SimpleGrid>
                  </Box>
                )}

                <Divider />

                {/* Vidhansabha Wise */}
                {Object.keys(stats.byVidhansabha).length > 0 && (
                  <Box>
                    <Text fontSize="sm" fontWeight="700" color="gray.700" mb={3}>
                      🏛️ Vidhansabha Wise Distribution
                    </Text>
                    <SimpleGrid columns={2} spacing={2}>
                      {Object.entries(stats.byVidhansabha).map(([vidhansabha, count]) => (
                        <Box key={vidhansabha} bg="orange.50" p={3} borderRadius="8px">
                          <Text fontSize="xs" color="gray.500">{vidhansabha === "Unknown" ? "N/A" : vidhansabha}</Text>
                          <Text fontSize="lg" fontWeight="700" color="orange.600">{count}</Text>
                        </Box>
                      ))}
                    </SimpleGrid>
                  </Box>
                )}

                <Divider />

                {/* Police Station Wise */}
                {Object.keys(stats.byPoliceStation).length > 0 && (
                  <Box>
                    <Text fontSize="sm" fontWeight="700" color="gray.700" mb={3}>
                      👮 Police Station Wise Distribution
                    </Text>
                    <SimpleGrid columns={2} spacing={2}>
                      {Object.entries(stats.byPoliceStation).map(([policeStation, count]) => (
                        <Box key={policeStation} bg="red.50" p={3} borderRadius="8px">
                          <Text fontSize="xs" color="gray.500">{policeStation === "Unknown" ? "N/A" : policeStation}</Text>
                          <Text fontSize="lg" fontWeight="700" color="red.600">{count}</Text>
                        </Box>
                      ))}
                    </SimpleGrid>
                  </Box>
                )}

                <Divider />

                {/* Department Wise */}
                {Object.keys(stats.byDepartment).length > 0 && (
                  <Box>
                    <Text fontSize="sm" fontWeight="700" color="gray.700" mb={3}>
                      🏢 Department Wise Distribution
                    </Text>
                    <SimpleGrid columns={2} spacing={2}>
                      {Object.entries(stats.byDepartment).map(([dept, count]) => (
                        <Box key={dept} bg="teal.50" p={3} borderRadius="8px">
                          <Text fontSize="xs" color="gray.500">{dept === "Unassigned" ? "N/A" : dept}</Text>
                          <Text fontSize="lg" fontWeight="700" color="teal.600">{count}</Text>
                        </Box>
                      ))}
                    </SimpleGrid>
                  </Box>
                )}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </Box>
  );
}