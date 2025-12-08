"use client";

import React, { useState } from "react";
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
  Stack,
  Link,
  Image,
  Container,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { MdConfirmationNumber, MdPerson, MdLogout } from "react-icons/md";
import { IoMdCreate } from "react-icons/io";
import { GrUserWorker } from "react-icons/gr";
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const Links = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Success Stories", href: "/success-stories" },
  { name: "Blog & News", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

const NavLink = ({ children, href }) => {
  return (
    <Box
      as={Link}
      href={href}
      px={2}
      py={1}
      fontFamily={"var(--font-geist-sans)"}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        color: "#fa7602",
      }}
    >
      {children}
    </Box>
  );
};

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // Synchronize local menuOpen with Chakra isOpen
  const handleMenuToggle = () => {
    if (menuOpen) {
      setMenuOpen(false);
      onClose();
    } else {
      setMenuOpen(true);
      onOpen();
    }
  };

  return (
    <>
      <Box
        // bg={"rgba(255, 255, 255, 0.8)"}
        bg={"white"}
        backdropFilter={"blur(20px)"}
        boxShadow={
          "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
        }
        color={"black"}
        w={"100%"}
        position={"fixed"}
        top={0}
        minH={"8vh"}
        zIndex={1000}
      >
        <Box
          display={"flex"}
          alignItems={"center"}
          bg={"#773903ff"}
          h={"4vh"}
          color={"white"}
          justifyContent={"space-around"}
        >
          <Flex fontSize={{ base: "10px", md: "12px" }} gap={2}>
            <Text>{"झारखंड सरकार"}</Text>
            <div style={{ width: "2px", background: "white" }}></div>
            <Text>{"GOVERNMENT OF JHARKHAND"}</Text>
          </Flex>
          <Box
            borderTopWidth={1}
            borderStyle={"solid"}
            borderColor={"gray.700"}
          >
            <Container
              as={Stack}
              maxW={"6xl"}
              py={4}
              direction={{ base: "column", md: "row" }}
              spacing={4}
              justify={{ base: "center", md: "space-between" }}
              align={{ base: "center", md: "center" }}
            >
              <Stack direction={"row"} spacing={6}>
                <FaTwitter cursor={"pointer"} />
                <FaYoutube cursor={"pointer"} />
                <FaInstagram cursor={"pointer"} />
              </Stack>
            </Container>
          </Box>
        </Box>
        <Flex
          h={"8vh"}
          alignItems={"center"}
          justifyContent={"space-between"}
          px={4}
        >
          <HStack spacing={8} alignItems={"center"}>
            <Box
              borderRadius={"md"}
              overflow={"hidden"}
              fontWeight="bold"
              fontSize="lg"
              cursor="default"
              onClick={() => router.push("/")}
            >
              <Image
                width={{ base: "50px", md: "60px" }}
                src="https://res.cloudinary.com/dddnxiqpq/image/upload/t_logos/v1755846625/a658e615-95d3-4025-b46c-35d326dc4f4b.webp"
              />
            </Box>
          </HStack>

          <HStack as={"nav"} spacing={8} display={{ base: "none", md: "flex" }}>
            {Links.map((link, index) => (
              <NavLink href={link.href} key={index}>
                {link.name}
              </NavLink>
            ))}
          </HStack>

          <Flex gap={4} alignItems={"center"}>
            {!user && (
              <Button
                _hover={{
                  bg: "white",
                  color: "#fa7602",
                  outline: "2px solid #fa7602",
                }}
                bg={"#fa7602"}
                color={"white"}
                onClick={() => router.push("/login")}
              >
                Login
              </Button>
            )}

            {user && (
              <Menu
                isLazy
                isOpen={menuOpen}
                onClose={() => {
                  setMenuOpen(false);
                  onClose();
                }}
              >
                <MenuButton
                  as={IconButton}
                  variant={"solid"}
                  cursor={"pointer"}
                  bg={"#fa7602"}
                  color={"white"}
                  border={"2px solid #fa7602"}
                  minW={0}
                  w={"40px"}
                  h={"40px"}
                  _focus={{ bg: "#fa7602", boxShadow: "none" }}
                  _active={{ bg: "#fa7602" }}
                  aria-label={"Open menu"}
                  icon={menuOpen ? <CloseIcon /> : <HamburgerIcon />}
                  _hover={{ bg: "#fa7602", color: "white" }}
                  onClick={handleMenuToggle}
                  size="md"
                />
                <MenuList
                  bg={"rgba(255, 255, 255, 1)"}
                  backdropFilter={"blur(20px)"}
                  color={"black"}
                  mt={4}
                >
                  <MenuItem p={2} mb={2} cursor="default">
                    <Flex alignItems={"center"} gap={2} userSelect="none">
                      <Text fontWeight={"bold"}>Welcome,</Text>
                      <Text>{user?.name}</Text>
                    </Flex>
                  </MenuItem>

                  {user.role === "Admin" ? (
                    <>
                      <MenuItem
                        icon={<GrUserWorker />}
                        _hover={{
                          bg: "#fa7602",
                          color: "white",
                          textDecoration: "none",
                        }}
                        bg={"transparent"}
                        color={"black"}
                        as={Link}
                        href="/admin/departments"
                      >
                        View Departments
                      </MenuItem>
                      <MenuItem
                        icon={<MdConfirmationNumber />}
                        _hover={{
                          bg: "#fa7602",
                          color: "white",
                          textDecoration: "none",
                        }}
                        bg={"transparent"}
                        color={"black"}
                        as={Link}
                        href="/tickets"
                      >
                        View Tickets
                      </MenuItem>
                    </>
                  ) : (
                    <>
                      <MenuItem
                        icon={<IoMdCreate />}
                        _hover={{
                          bg: "#fa7602",
                          color: "white",
                          textDecoration: "none",
                        }}
                        bg={"transparent"}
                        color={"black"}
                        as={Link}
                        href="/create-ticket"
                      >
                        Create Ticket
                      </MenuItem>

                      <MenuItem
                        icon={<MdConfirmationNumber />}
                        _hover={{
                          bg: "#fa7602",
                          color: "white",
                          textDecoration: "none",
                        }}
                        as={Link}
                        bg={"transparent"}
                        color={"black"}
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
                    bg={"transparent"}
                    color={"black"}
                    href="/profile"
                    as={Link}
                  >
                    Profile
                  </MenuItem>

                  <MenuDivider bg={"black"} />

                  <MenuItem
                    icon={<MdLogout />}
                    _hover={{
                      bg: "#fa7602",
                      color: "white",
                      textDecoration: "none",
                    }}
                    bg={"transparent"}
                    color={"black"}
                    onClick={() => {
                      logout();
                      router.push("/");
                    }}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
