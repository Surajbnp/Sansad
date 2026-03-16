// "use client";

// import React, { useState } from "react";
// import {
//   Box,
//   Flex,
//   HStack,
//   Text,
//   IconButton,
//   Button,
//   Menu,
//   MenuButton,
//   MenuList,
//   MenuItem,
//   MenuDivider,
//   useDisclosure,
//   Stack,
//   Link,
//   Image,
//   Container,
// } from "@chakra-ui/react";
// import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/context/AuthContext";
// import {
//   MdConfirmationNumber,
//   MdPerson,
//   MdLogout,
//   MdDashboard,
// } from "react-icons/md";
// import { IoMdCreate } from "react-icons/io";
// import { GrUserWorker } from "react-icons/gr";
// import { FaInstagram, FaTwitter, FaUser, FaYoutube } from "react-icons/fa";

// const Links = [
//   { name: "Home", href: "/" },
//   { name: "About", href: "/about" },
//   { name: "Success Stories", href: "/success-stories" },
//   { name: "Blog & News", href: "/blog" },
//   { name: "Contact", href: "/contact" },
// ];

// const NavLink = ({ children, href }) => {
//   return (
//     <Box
//       as={Link}
//       href={href}
//       px={2}
//       py={1}
//       fontFamily={"var(--font-geist-sans)"}
//       rounded={"md"}
//       _hover={{
//         textDecoration: "none",
//         color: "#fa7602",
//       }}
//     >
//       {children}
//     </Box>
//   );
// };

// export default function Navbar() {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const router = useRouter();
//   const { user, logout } = useAuth();
//   const [menuOpen, setMenuOpen] = useState(false);

//   // Synchronize local menuOpen with Chakra isOpen
//   const handleMenuToggle = () => {
//     if (menuOpen) {
//       setMenuOpen(false);
//       onClose();
//     } else {
//       setMenuOpen(true);
//       onOpen();
//     }
//   };

//   return (
//     <>
//       <Box
//         // bg={"rgba(255, 255, 255, 0.8)"}
//         bg={"white"}
//         backdropFilter={"blur(20px)"}
//         boxShadow={
//           "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
//         }
//         color={"black"}
//         w={"100%"}
//         position={"fixed"}
//         top={0}
//         minH={"8vh"}
//         zIndex={1000}
//       >
//         <Box
//           display={"flex"}
//           alignItems={"center"}
//           bg={"#773903ff"}
//           h={"4vh"}
//           color={"white"}
//           justifyContent={"space-around"}
//         >
//           <Flex fontSize={{ base: "10px", md: "12px" }} gap={2}>
//             {/* <Text>{"झारखंड सरकार"}</Text>
//             <div style={{ width: "2px", background: "white" }}></div> */}
//             <Text>
//               Office of hon&apos;ble Member of Parliament{" "}
//               <Text as="span" color="white" fontWeight="bold">
//                 Shri Ganesh Ji
//               </Text>
//             </Text>
//           </Flex>
//           <Box
//             borderTopWidth={1}
//             borderStyle={"solid"}
//             borderColor={"gray.700"}
//           >
//             <Container
//               as={Stack}
//               maxW={"6xl"}
//               py={4}
//               direction={{ base: "column", md: "row" }}
//               spacing={4}
//               justify={{ base: "center", md: "space-between" }}
//               align={{ base: "center", md: "center" }}
//             >
//               <Stack direction={"row"} spacing={6}>
//                 <FaTwitter cursor={"pointer"} />
//                 <FaYoutube cursor={"pointer"} />
//                 <FaInstagram cursor={"pointer"} />
//               </Stack>
//             </Container>
//           </Box>
//         </Box>
//         <Flex
//           h={"8vh"}
//           alignItems={"center"}
//           justifyContent={"space-between"}
//           px={4}
//         >
//           <HStack spacing={8} alignItems={"center"}>
//             <Box
//               borderRadius={"md"}
//               overflow={"hidden"}
//               fontWeight="bold"
//               fontSize="lg"
//               onClick={() => router.push("/")}
//               cursor={"pointer"}
//             >
//               <Image
//                 width={{ base: "80px", md: "100px" }}
//                 src="https://res.cloudinary.com/dddnxiqpq/image/upload/v1767013156/ChatGPT_Image_Dec_29_2025_06_28_20_PM_okhqrs.webp"
//               />
//             </Box>
//           </HStack>

//           <HStack as={"nav"} spacing={8} display={{ base: "none", md: "flex" }}>
//             {Links.map((link, index) => (
//               <NavLink href={link.href} key={index}>
//                 {link.name}
//               </NavLink>
//             ))}
//           </HStack>

//           <Flex gap={4} alignItems={"center"}>
//             {!user && (
//               <Button
//                 _hover={{
//                   bg: "white",
//                   color: "#fa7602",
//                   outline: "2px solid #fa7602",
//                 }}
//                 bg={"#fa7602"}
//                 color={"white"}
//                 onClick={() => router.push("/login")}
//               >
//                 Login
//               </Button>
//             )}

//             {user && (
//               <Menu
//                 isLazy
//                 isOpen={menuOpen}
//                 onClose={() => {
//                   setMenuOpen(false);
//                   onClose();
//                 }}
//               >
//                 <MenuButton
//                   as={IconButton}
//                   variant={"solid"}
//                   cursor={"pointer"}
//                   bg={"#fa7602"}
//                   color={"white"}
//                   border={"2px solid #fa7602"}
//                   minW={0}
//                   w={"40px"}
//                   h={"40px"}
//                   _focus={{ bg: "#fa7602", boxShadow: "none" }}
//                   _active={{ bg: "#fa7602" }}
//                   aria-label={"Open menu"}
//                   icon={menuOpen ? <CloseIcon /> : <HamburgerIcon />}
//                   _hover={{ bg: "#fa7602", color: "white" }}
//                   onClick={handleMenuToggle}
//                   size="md"
//                 />
//                 <MenuList
//                   bg={"rgba(255, 255, 255, 1)"}
//                   backdropFilter={"blur(20px)"}
//                   color={"black"}
//                   mt={4}
//                 >
//                   <MenuItem p={2} mb={2} cursor="default">
//                     <Flex alignItems={"center"} gap={2} userSelect="none">
//                       <Text fontWeight={"bold"}>Welcome,</Text>
//                       <Text>{user?.name}</Text>
//                     </Flex>
//                   </MenuItem>

//                   {/* ADMIN MENU */}
//                   {user?.role === "Admin" && (
//                     <>
//                       <MenuItem
//                         icon={<GrUserWorker />}
//                         _hover={{ bg: "#fa7602", color: "white" }}
//                         bg="transparent"
//                         color="black"
//                         as={Link}
//                         href="/admin/departments"
//                       >
//                         View Departments
//                       </MenuItem>

//                       <MenuItem
//                         icon={<MdConfirmationNumber />}
//                         _hover={{ bg: "#fa7602", color: "white" }}
//                         bg="transparent"
//                         color="black"
//                         as={Link}
//                         href="/tickets"
//                       >
//                         View Tickets
//                       </MenuItem>
//                     </>
//                   )}

//                   {/* DEPARTMENT MENU */}
//                   {user?.role === "Department" && (
//                     <>
//                       <MenuItem
//                         icon={<MdDashboard />}
//                         _hover={{ bg: "#fa7602", color: "white" }}
//                         bg="transparent"
//                         color="black"
//                         as={Link}
//                         href="/dashboard"
//                       >
//                         Dashboard
//                       </MenuItem>

//                       <MenuItem
//                         icon={<MdConfirmationNumber />}
//                         _hover={{ bg: "#fa7602", color: "white" }}
//                         bg="transparent"
//                         color="black"
//                         as={Link}
//                         href="/tickets"
//                       >
//                         Tickets
//                       </MenuItem>
//                     </>
//                   )}

//                   {/* NORMAL USER MENU */}
//                   {user?.role === "User" && (
//                     <>
//                       <MenuItem
//                         icon={<IoMdCreate />}
//                         _hover={{ bg: "#fa7602", color: "white" }}
//                         bg="transparent"
//                         color="black"
//                         as={Link}
//                         href="/create-ticket"
//                       >
//                         Create Ticket
//                       </MenuItem>

//                       <MenuItem
//                         icon={<MdConfirmationNumber />}
//                         _hover={{ bg: "#fa7602", color: "white" }}
//                         bg="transparent"
//                         color="black"
//                         as={Link}
//                         href="/tickets"
//                       >
//                         Your Tickets
//                       </MenuItem>
//                     </>
//                   )}

//                   <MenuItem
//                     icon={<MdPerson />}
//                     _hover={{
//                       bg: "#fa7602",
//                       color: "white",
//                       textDecoration: "none",
//                     }}
//                     bg={"transparent"}
//                     color={"black"}
//                     href="/profile"
//                     as={Link}
//                   >
//                     Profile
//                   </MenuItem>

//                   <MenuDivider bg={"black"} />

//                   <MenuItem
//                     icon={<MdLogout />}
//                     _hover={{
//                       bg: "#fa7602",
//                       color: "white",
//                       textDecoration: "none",
//                     }}
//                     bg={"transparent"}
//                     color={"black"}
//                     onClick={() => {
//                       logout();
//                       router.push("/");
//                     }}
//                   >
//                     Logout
//                   </MenuItem>
//                 </MenuList>
//               </Menu>
//             )}
//           </Flex>
//         </Flex>
//       </Box>
//     </>
//   );
// }

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
} from "react-icons/md";
import {
  MdHome,
  MdInfo,
  MdAutoGraph,
  MdBook,
  MdContactPhone,
} from "react-icons/md";
import { IoMdCreate } from "react-icons/io";
import { GrUserWorker } from "react-icons/gr";

const Links = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Success Stories", href: "/success-stories" },
  { name: "Blog & News", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

const iconMap = {
  Home: MdHome,
  About: MdInfo,
  "Success Stories": MdAutoGraph,
  "Blog & News": MdBook,
  Contact: MdContactPhone,
};

const NavLink = ({ children, href }) => {
  return (
    <Box
      as={Link}
      href={href}
      px={3}
      py={2}
      fontSize="15px"
      fontWeight="500"
      fontFamily={"var(--font-geist-sans)"}
      rounded={"md"}
      color="white"
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMenuToggle = () => {
    if (menuOpen) {
      setMenuOpen(false);
    } else {
      setMenuOpen(true);
    }
  };

  return (
    <>
      <Box
        bg={{
          base: scrolled ? "rgba(0,0,0,0.5)" : "transparent",
          md: "rgba(0,0,0,0.5)",
        }}
        backdropFilter={{
          base: scrolled ? "blur(20px)" : "none",
          md: "blur(20px)",
        }}
        transition="background 0.3s ease, backdrop-filter 0.3s ease"
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

          {/* CENTER — Nav Links (desktop only) */}
          <HStack
            as="nav"
            spacing={{ md: 1, lg: 2 }}
            display={{ base: "none", md: "flex" }}
            position="absolute"
            left="50%"
            transform="translateX(-50%)"
          >
            {Links.map((link, index) => (
              <NavLink href={link.href} key={index}>
                {link.name}
              </NavLink>
            ))}
          </HStack>

          {/* RIGHT — Login button (desktop) / Hamburger (mobile) + User menu */}
          <Flex alignItems="center" gap={3} flexShrink={0}>
            {/* Desktop: Login button when no user */}
            {!user && (
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
            )}

            {/* Desktop + Mobile: User menu when logged in */}
            {user && (
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
                  _focus={{ bg: "#fa7602", boxShadow: "none" }}
                  _active={{ bg: "#fa7602" }}
                  aria-label="Open menu"
                  icon={menuOpen ? <CloseIcon /> : <HamburgerIcon />}
                  _hover={{ bg: "#e56a00", color: "white" }}
                  onClick={handleMenuToggle}
                  size="md"
                />
                <MenuList
                  bg="white"
                  backdropFilter="blur(20px)"
                  color="black"
                  mt={4}
                  shadow="xl"
                  borderColor="gray.100"
                >
                  <MenuItem
                    p={2}
                    mb={2}
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
                    _hover={{
                      bg: "#fa7602",
                      color: "white",
                      textDecoration: "none",
                    }}
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

            {/* Mobile Hamburger (only when no user logged in) */}
            {!user && (
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
            )}
          </Flex>
        </Flex>
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
        <DrawerOverlay backdropFilter="blur(5px)" />
        <DrawerContent bg="white">
          <DrawerHeader borderBottomWidth="1px" px={4} py={4}>
            <Flex justifyContent="space-between" alignItems="center">
              <Image
                src="/SSASatna_White_Logo.png"
                h="35px"
                alt="SSA Satna Logo"
                fallbackSrc="https://via.placeholder.com/120x35?text=Logo"
                filter="invert(1)" /* invert so white logo shows on white drawer bg */
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
              {Links.map((link, index) => (
                <Box key={index}>
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
                    <Icon
                      as={iconMap[link.name] || MdDashboard}
                      fontSize="20px"
                      color="#fa7602"
                    />
                    <Text fontSize="16px" fontWeight="500">
                      {link.name}
                    </Text>
                  </Box>
                  {index !== Links.length - 1 && (
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
                  boxShadow="0 4px 12px rgba(250, 118, 2, 0.2)"
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
