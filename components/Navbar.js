"use client";

import React, { useState, useEffect } from "react";
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

const Links = [
  { name: "Home", href: "/", icon: MdHome },
  { name: "About", href: "/about", icon: MdInfo },
  { name: "Govt Schemes", href: "/govt-schemes", icon: MdInfo },
  { name: "Success Stories", href: "/success-stories", icon: MdAutoGraph },
  { name: "Blog & News", href: "/blog", icon: MdBook },
  { name: "Contact", href: "/contact", icon: MdContactPhone },
];

const NavLink = ({ children, href }) => (
  <Box
    as={Link}
    href={href}
    px={3}
    py={2}
    fontSize="15px"
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

  // authReady: true once we know whether user is logged in or not
  const { user, logout, loading: authLoading } = useAuth();
  const authReady = !authLoading;
  console.log(user, 'from usr')

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Box
        bg={{
          base: scrolled ? "rgba(122, 72, 29)" : "transparent",
          md: "rgb(122, 72, 29)",
        }}
        backdropFilter={{
          base: scrolled ? "blur(20px)" : "none",
          md: "blur(20px)",
        }}
        transition="background 0.3s ease"
        color="white"
        w="100%"
        position="fixed"
        top={0}
        zIndex={1000}
        borderBottom={{
          base: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
          md: "1px solid rgba(255,255,255,0.08)",
        }}
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
              fallbackSrc="https://via.placeholder.com/120x38?text=Logo"
            />
          </Link>

          {/* CENTER — Nav Links */}
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
            {/* while auth state is unknown — show a ghost placeholder so layout doesn't jump */}
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
                {/* Desktop login button */}
                <Button
                  variant="outline"
                  color="#fa7602"
                  borderColor="#fa7602"
                  fontSize="14px"
                  fontWeight="600"
                  h="36px"
                  px={5}
                  borderRadius="md"
                  display={{ base: "none", md: "inline-flex" }}
                  onClick={() => router.push("/login")}
                  _hover={{ bg: "#fa7602", color: "white" }}
                  transition="all 0.2s"
                >
                  Login / Register
                </Button>

                {/* Mobile hamburger */}
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

            {/* logged IN */}
            {authReady && user && (
              <Menu isLazy isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
                <MenuButton
                  as={IconButton}
                  variant="solid"
                  cursor="pointer"
                  bg="#fa7602"
                  color="white"
                  border="2px solid #fa7602"
                  minW={0}
                  w="40px"
                  h="40px"
                  icon={menuOpen ? <CloseIcon /> : <HamburgerIcon />}
                  _hover={{ bg: "#e56a00" }}
                  _focus={{ boxShadow: "none" }}
                  _active={{ bg: "#fa7602" }}
                  aria-label="Open menu"
                  onClick={() => setMenuOpen((o) => !o)}
                />
                <MenuList
                  bg="white"
                  color="black"
                  mt={4}
                  shadow="xl"
                  borderColor="gray.100"
                >
                  {/* greeting */}
                  <MenuItem
                    p={2}
                    mb={1}
                    cursor="default"
                    _hover={{ bg: "transparent" }}
                  >
                    <Flex alignItems="center" gap={2} userSelect="none">
                      <Text fontWeight="bold">Welcome,</Text>
                      <Text>{user?.name}</Text>
                    </Flex>
                  </MenuItem>

                  {user?.role === "Admin" && (
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

                  {user?.role === "Department" && (
                    <>
                      <MenuItem
                        icon={<MdDashboard />}
                        _hover={{ bg: "#fa7602", color: "white" }}
                        as={Link}
                        href="/dashboard"
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

                  {user?.role === "User" && (
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
                    Profile
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

      {/* Mobile Drawer (only for logged-out users) */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
        <DrawerOverlay backdropFilter="blur(5px)" />
        <DrawerContent bg="white">
          <DrawerHeader borderBottomWidth="1px" px={4} py={4}>
            <Flex justifyContent="space-between" alignItems="center">
              <Image
                src="/SSASatna_Color_Logo_color.png"
                h="35px"
                alt="SSA Satna Logo"
                fallbackSrc="https://via.placeholder.com/120x35?text=Logo"
              />
              <IconButton
                icon={<CloseIcon fontSize="12px" />}
                onClick={onClose}
                variant="ghost"
                size="sm"
                borderRadius="full"
                _hover={{ bg: "orange.50", color: "#fa7602" }}
                aria-label="Close Menu"
              />
            </Flex>
          </DrawerHeader>

          <DrawerBody px={2} py={6}>
            <VStack spacing={1} align="stretch">
              {Links.map((link, i) => (
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
                    transition="all 0.2s"
                    color="gray.700"
                    _hover={{
                      bg: "orange.50",
                      color: "#fa7602",
                      textDecoration: "none",
                    }}
                  >
                    <Icon as={link.icon} fontSize="20px" color="#fa7602" />
                    <Text fontSize="16px" fontWeight="500">
                      {link.name}
                    </Text>
                  </Box>
                  {i !== Links.length - 1 && (
                    <Divider borderColor="gray.100" ml={12} opacity={0.6} />
                  )}
                </Box>
              ))}

              <Box pt={8} px={4}>
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
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
