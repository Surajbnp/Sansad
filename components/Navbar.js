"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  HStack,
  Text,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  Link,
  Image,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  VStack,
  Skeleton,
  Avatar,
} from "@chakra-ui/react";
import { Divider, Icon } from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  MdConfirmationNumber,
  MdPerson,
  MdLogout,
  MdDashboard,
  MdHome,
  MdInfo,
  MdAutoGraph,
  MdBook,
  MdContactPhone,
} from "react-icons/md";
import { IoMdCreate } from "react-icons/io";
import { GrUserWorker } from "react-icons/gr";
import { FaHandHoldingUsd } from "react-icons/fa";

const Links = [
  { name: "Home", href: "/", icon: MdHome },
  { name: "About", href: "/about", icon: MdInfo },
  { name: "Govt Schemes", href: "/govt-schemes", icon: FaHandHoldingUsd },
  { name: "Success Stories", href: "/success-stories", icon: MdAutoGraph },
  { name: "Blog & News", href: "/blog", icon: MdBook },
  { name: "Contact", href: "/contact", icon: MdContactPhone },
];

const BOTTOM_NAV = {
  Admin: [
    { name: "Home", href: "/", icon: MdHome },
    { name: "Tickets", href: "/tickets", icon: MdConfirmationNumber },
    { name: "Departments", href: "/admin/departments", icon: GrUserWorker },
    { name: "Dashboard", href: "/profile", icon: MdDashboard },
  ],
  User: [
    { name: "Home", href: "/", icon: MdHome },
    { name: "Tickets", href: "/tickets", icon: MdConfirmationNumber },
    { name: "Schemes", href: "/govt-schemes", icon: FaHandHoldingUsd },
    { name: "Dashboard", href: "/profile", icon: MdDashboard },
  ],
  Department: [
    { name: "Home", href: "/", icon: MdHome },
    { name: "Tickets", href: "/tickets", icon: MdConfirmationNumber },
    { name: "Blog", href: "/blog", icon: MdBook },
    { name: "Dashboard", href: "/profile", icon: MdDashboard },
  ],
};

const DRAWER_LINKS = {
  Admin: [
    { name: "Home", href: "/", icon: MdHome },
    { name: "About", href: "/about", icon: MdInfo },
    { name: "Govt Schemes", href: "/govt-schemes", icon: FaHandHoldingUsd },
    { name: "Success Stories", href: "/success-stories", icon: MdAutoGraph },
    { name: "Blog & News", href: "/blog", icon: MdBook },
    { name: "Contact", href: "/contact", icon: MdContactPhone },
  ],
  User: [
    { name: "Home", href: "/", icon: MdHome },
    { name: "About", href: "/about", icon: MdInfo },
    { name: "Success Stories", href: "/success-stories", icon: MdAutoGraph },
    { name: "Blog & News", href: "/blog", icon: MdBook },
    { name: "Contact", href: "/contact", icon: MdContactPhone },
    { name: "Create Ticket", href: "/create-ticket", icon: IoMdCreate },
  ],
  Department: [
    { name: "Home", href: "/", icon: MdHome },
    { name: "About", href: "/about", icon: MdInfo },
    { name: "Govt Schemes", href: "/govt-schemes", icon: FaHandHoldingUsd },
    { name: "Success Stories", href: "/success-stories", icon: MdAutoGraph },
    { name: "Contact", href: "/contact", icon: MdContactPhone },
  ],
  guest: Links,
};

const NavLink = ({ children, href }) => (
  <Box
    as={Link}
    href={href}
    px={3}
    py={2}
    fontSize={{ base: "10px", md: "12px", lg: "14px" }}
    fontWeight="500"
    rounded="md"
    color="white"
    _hover={{ textDecoration: "none", color: "#fa7602" }}
  >
    {children}
  </Box>
);

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const { user, logout, loading: authLoading } = useAuth();
  const authReady = !authLoading;

  // scrolled: true once user scrolls past the navbar's own height
  const [scrolled, setScrolled] = useState(false);
  const [navHeight, setNavHeight] = useState(64);
  const navRef = useRef(null);

  useEffect(() => {
    // Inject slide-down keyframe once into document head
    if (!document.getElementById("nav-slide-style")) {
      const style = document.createElement("style");
      style.id = "nav-slide-style";
      style.textContent = `
        @keyframes navSlideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .nav-slide-down {
          animation: navSlideDown 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `;
      document.head.appendChild(style);
    }

    // Measure actual navbar height once mounted
    if (navRef.current) setNavHeight(navRef.current.offsetHeight);

    const handleScroll = () => {
      const h = navRef.current?.offsetHeight || 64;
      setScrolled(window.scrollY > h);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const role = user?.role;
  const bottomNavItems = role ? BOTTOM_NAV[role] : null;
  const drawerLinks = role ? DRAWER_LINKS[role] : DRAWER_LINKS.guest;

  return (
    <>
      {/* Placeholder — only exists when navbar is fixed, exact same height so no layout jump */}
      {scrolled && (
        <Box h={`${navHeight}px`} aria-hidden="true" flexShrink={0} />
      )}

      <Box
        ref={navRef}
        className={scrolled ? "nav-slide-down" : undefined}
        position={scrolled ? "fixed" : "relative"}
        top={0}
        left={0}
        right={0}
        zIndex={1000}
        bg="rgb(122, 72, 29)"
        backdropFilter={scrolled ? "blur(20px)" : "none"}
        color="white"
        w="100%"
        boxShadow={scrolled ? "0 2px 20px rgba(0,0,0,0.28)" : "none"}
        borderBottom="1px solid rgba(255,255,255,0.08)"
        transition="box-shadow 0.3s ease, backdrop-filter 0.3s ease"
      >
        <Flex
          h="64px"
          alignItems="center"
          justifyContent="space-between"
          px={{ base: 4, md: 8 }}
        >
          {/* LEFT — Logo */}
          <Link href="/" _hover={{ textDecoration: "none" }} flexShrink={0}>
            <Image
              src="/SSASatna_White_Logo.png"
              h="38px"
              alt="SSA Satna Logo"
            />
          </Link>

          {/* CENTER — Nav Links (desktop only) */}
          <HStack
            as="nav"
            spacing={{ md: 1, lg: 2 }}
            display={{ base: "none", md: "flex" }}
            position="absolute"
            left="50%"
            transform="translateX(-50%)"
          >
            {Links.map((link, i) => (
              <NavLink href={link.href} key={i}>
                {link.name}
              </NavLink>
            ))}
          </HStack>

          {/* RIGHT — auth area */}
          <Flex alignItems="center" gap={3} flexShrink={0}>
            {!authReady && (
              <Skeleton
                w="110px"
                h="36px"
                borderRadius="md"
                startColor="whiteAlpha.200"
                endColor="whiteAlpha.400"
              />
            )}

            {/* logged OUT */}
            {authReady && !user && (
              <>
                <Button
                  variant="outline"
                  color="white"
                  borderColor="white"
                  fontSize="14px"
                  fontWeight="600"
                  h="36px"
                  px={5}
                  borderRadius="md"
                  display={{ base: "none", md: "inline-flex" }}
                  onClick={() => router.push("/login")}
                  _hover={{
                    bg: "#fa7602",
                    color: "white",
                    borderColor: "#fa7602",
                  }}
                  transition="all 0.2s"
                >
                  Login / Register
                </Button>

                <IconButton
                  display={{ base: "flex", md: "none" }}
                  icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                  aria-label="Toggle Navigation"
                  onClick={isOpen ? onClose : onOpen}
                  variant="ghost"
                  color="white"
                  bg="#fa7602"
                  fontSize="20px"
                  w="40px"
                  h="40px"
                  _hover={{ bg: "#e56a00", color: "white" }}
                />
              </>
            )}

            {/* logged IN — mobile hamburger */}
            {authReady && user && (
              <IconButton
                display={{ base: "flex", md: "none" }}
                icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                aria-label="Open menu"
                onClick={isOpen ? onClose : onOpen}
                variant="solid"
                bg="#fa7602"
                color="white"
                w="40px"
                h="40px"
                _hover={{ bg: "#e56a00" }}
                _active={{ bg: "#fa7602" }}
              />
            )}

            {/* logged IN — desktop dropdown */}
            {authReady && user && (
              <Menu isLazy>
                <MenuButton
                  as={Button}
                  display={{ base: "none", md: "flex" }}
                  variant="solid"
                  bg="#fa7602"
                  color="white"
                  h="36px"
                  px={4}
                  borderRadius="md"
                  _hover={{ bg: "#e56a00" }}
                  _active={{ bg: "#fa7602" }}
                  _focus={{ boxShadow: "none" }}
                >
                  {user?.name.split(" ")[0]}
                </MenuButton>
                <MenuList
                  bg="white"
                  color="black"
                  mt={4}
                  shadow="xl"
                  borderColor="gray.100"
                >
                  {role === "Admin" && (
                    <>
                      <MenuItem
                        icon={<GrUserWorker />}
                        _hover={{ bg: "#fa7602", color: "white" }}
                        as={Link}
                        href="/admin/departments"
                      >
                        View Departments
                      </MenuItem>
                      <MenuItem
                        icon={<MdConfirmationNumber />}
                        _hover={{ bg: "#fa7602", color: "white" }}
                        as={Link}
                        href="/tickets"
                      >
                        View Tickets
                      </MenuItem>
                    </>
                  )}
                  {role === "Department" && (
                    <>
                      <MenuItem
                        icon={<MdDashboard />}
                        _hover={{ bg: "#fa7602", color: "white" }}
                        as={Link}
                        href="/profile"
                      >
                        Dashboard
                      </MenuItem>
                      <MenuItem
                        icon={<MdConfirmationNumber />}
                        _hover={{ bg: "#fa7602", color: "white" }}
                        as={Link}
                        href="/tickets"
                      >
                        Tickets
                      </MenuItem>
                    </>
                  )}
                  {role === "User" && (
                    <>
                      <MenuItem
                        icon={<IoMdCreate />}
                        _hover={{ bg: "#fa7602", color: "white" }}
                        as={Link}
                        href="/create-ticket"
                      >
                        Create Ticket
                      </MenuItem>
                      <MenuItem
                        icon={<MdConfirmationNumber />}
                        _hover={{ bg: "#fa7602", color: "white" }}
                        as={Link}
                        href="/tickets"
                      >
                        Your Tickets
                      </MenuItem>
                    </>
                  )}
                  <MenuItem
                    icon={<MdPerson />}
                    _hover={{
                      bg: "#fa7602",
                      color: "white",
                      textDecoration: "none",
                    }}
                    as={Link}
                    href="/profile"
                  >
                    Dashboard
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem
                    icon={<MdLogout />}
                    _hover={{ bg: "#fa7602", color: "white" }}
                    onClick={logout}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
          </Flex>
        </Flex>
      </Box>

      {/* ── FULL DRAWER (right → left) ── */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="full">
        <DrawerOverlay backdropFilter="blur(6px)" bg="blackAlpha.600" />
        <DrawerContent
          bg="white"
          maxW={{ base: "100vw", sm: "340px" }}
          ml="auto"
        >
          <DrawerHeader
            borderBottomWidth="1px"
            borderColor="gray.100"
            px={5}
            py={4}
            bg="rgb(122, 72, 29)"
          >
            <Flex justifyContent="space-between" alignItems="center">
              <Image
                src="/SSASatna_Color_Logo_color.png"
                h="35px"
                alt="SSA Satna Logo"
              />
              <IconButton
                icon={<CloseIcon fontSize="12px" />}
                onClick={onClose}
                variant="ghost"
                size="sm"
                borderRadius="full"
                color="white"
                _hover={{ bg: "whiteAlpha.200" }}
                aria-label="Close Menu"
              />
            </Flex>
          </DrawerHeader>

          <DrawerBody px={3} py={5} overflowY="auto">
            <VStack spacing={0} align="stretch">
              {user && (
                <Box
                  px={4}
                  py={3}
                  mb={3}
                  bg="orange.50"
                  borderRadius="lg"
                  borderLeft="4px solid #fa7602"
                >
                  <Text fontSize="13px" color="gray.500">
                    Logged in as
                  </Text>
                  <Text fontWeight="700" color="gray.800" fontSize="15px">
                    {user.name}
                  </Text>
                  <Text fontSize="12px" color="#fa7602" fontWeight="600">
                    {user.role}
                  </Text>
                </Box>
              )}

              {drawerLinks.map((link, i) => (
                <Box key={i}>
                  <Box
                    as={Link}
                    href={link.href}
                    onClick={onClose}
                    display="flex"
                    alignItems="center"
                    gap={4}
                    py={3}
                    px={4}
                    rounded="lg"
                    transition="all 0.18s"
                    color="gray.700"
                    _hover={{
                      bg: "orange.50",
                      color: "#fa7602",
                      textDecoration: "none",
                      pl: 5,
                    }}
                  >
                    <Icon as={link.icon} fontSize="20px" color="#fa7602" />
                    <Text fontSize="15px" fontWeight="500">
                      {link.name}
                    </Text>
                  </Box>
                  {i !== drawerLinks.length - 1 && (
                    <Divider borderColor="gray.100" ml={12} opacity={0.5} />
                  )}
                </Box>
              ))}

              {user && (
                <>
                  <Divider my={3} borderColor="gray.200" />
                  <Box
                    as={Link}
                    href="/profile"
                    onClick={onClose}
                    display="flex"
                    alignItems="center"
                    gap={4}
                    py={3}
                    px={4}
                    rounded="lg"
                    color="gray.700"
                    _hover={{
                      bg: "orange.50",
                      color: "#fa7602",
                      textDecoration: "none",
                    }}
                  >
                    <Icon as={MdDashboard} fontSize="20px" color="#fa7602" />
                    <Text fontSize="15px" fontWeight="500">
                      Dashboard
                    </Text>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={4}
                    py={3}
                    px={4}
                    rounded="lg"
                    color="gray.700"
                    cursor="pointer"
                    transition="all 0.18s"
                    _hover={{ bg: "red.50", color: "red.500" }}
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                  >
                    <Icon as={MdLogout} fontSize="20px" color="red.400" />
                    <Text fontSize="15px" fontWeight="500">
                      Logout
                    </Text>
                  </Box>
                </>
              )}

              {!user && (
                <Box pt={8} px={1}>
                  <Button
                    w="full"
                    h="48px"
                    bg="#fa7602"
                    color="white"
                    fontSize="md"
                    fontWeight="bold"
                    borderRadius="lg"
                    boxShadow="0 4px 12px rgba(250,118,2,0.2)"
                    _active={{ transform: "scale(0.97)" }}
                    onClick={() => {
                      router.push("/login");
                      onClose();
                    }}
                  >
                    Login / Signup
                  </Button>
                </Box>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* ── BOTTOM NAV (mobile/tablet, logged-in only) ── */}
      {authReady && user && bottomNavItems && (
        <Box
          style={{
            position: "fixed",
            bottom: 20,
            left: 0,
            right: 0,
            height: "64px",
          }}
          display={{ base: "flex", md: "none" }}
          justifyContent={"center"}
          zIndex={999}
          maxW={"96%"}
          borderRadius={"12px"}
          bg={" rgb(122, 72, 29, 0.9) "}
          m={"auto"}
          boxShadow="0 -4px 20px rgba(0,0,0,0.10)"
          alignItems="stretch"
        >
          {bottomNavItems.map((item, i) => {
            const isActive =
              typeof window !== "undefined" &&
              window.location.pathname === item.href;
            return (
              <Box
                key={i}
                as={Link}
                href={item.href}
                flex={1}
                display="flex"
                flexDir="column"
                alignItems="center"
                justifyContent="center"
                gap="3px"
                color={isActive ? "#fa7602" : "white"}
                _hover={{
                  textDecoration: "none",
                  color: "#fa7602",
                  bg: "orange.50",
                }}
                transition="all 0.18s"
                pt="2px"
              >
                <Icon as={item.icon} fontSize="22px" />
                <Text
                  fontSize="10px"
                  fontWeight={isActive ? "700" : "500"}
                  lineHeight={1}
                >
                  {item.name}
                </Text>
              </Box>
            );
          })}
        </Box>
      )}
    </>
  );
}
