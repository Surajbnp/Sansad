"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Box,
  IconButton,
  Image,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";

export default function ImagePreviewModal({ isOpen, onClose, imageUrl }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  const lastTouchDistance = useRef(null);
  const dragStart = useRef(null);

  /* ================= RESET ================= */
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  /* ================= LIMIT CALC ================= */
  const clampPosition = (x, y) => {
    if (!imageRef.current || !containerRef.current) {
      return { x, y };
    }

    const img = imageRef.current;
    const container = containerRef.current;

    const imgWidth = img.offsetWidth * scale;
    const imgHeight = img.offsetHeight * scale;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    const maxX = Math.max(0, (imgWidth - containerWidth) / 2);
    const maxY = Math.max(0, (imgHeight - containerHeight) / 2);

    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    };
  };

  /* ================= DESKTOP ZOOM ================= */
  const zoomIn = () => setScale((s) => Math.min(s + 0.2, 4));
  const zoomOut = () => {
    setScale((s) => {
      const next = Math.max(s - 0.2, 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  /* ================= DESKTOP DRAG ================= */
  const handleMouseDown = (e) => {
    if (scale <= 1) return;
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!dragStart.current || scale <= 1) return;

    const next = clampPosition(
      e.clientX - dragStart.current.x,
      e.clientY - dragStart.current.y
    );

    setPosition(next);
  };

  const handleMouseUp = () => {
    dragStart.current = null;
  };

  /* ================= MOBILE PINCH + PAN ================= */
  const getDistance = (touches) => {
    const [a, b] = touches;
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  };

  const handleTouchMove = (e) => {
    // Pinch zoom
    if (e.touches.length === 2) {
      const dist = getDistance(e.touches);
      if (!lastTouchDistance.current) {
        lastTouchDistance.current = dist;
        return;
      }

      const delta = dist - lastTouchDistance.current;
      setScale((s) => Math.min(4, Math.max(1, s + delta * 0.002)));
      lastTouchDistance.current = dist;
    }

    // One finger drag
    if (e.touches.length === 1 && scale > 1) {
      const touch = e.touches[0];
      if (!dragStart.current) {
        dragStart.current = {
          x: touch.clientX - position.x,
          y: touch.clientY - position.y,
        };
      } else {
        const next = clampPosition(
          touch.clientX - dragStart.current.x,
          touch.clientY - dragStart.current.y
        );
        setPosition(next);
      }
    }
  };

  const handleTouchEnd = () => {
    lastTouchDistance.current = null;
    dragStart.current = null;
  };

  if (!imageUrl) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay bg="blackAlpha.800" />
      <ModalContent
        bg="black"
        display={"flex"}
        alignItems="center"
        justifyContent="center"
        p={0}
      >
        <ModalCloseButton color="white" size="lg" />

        {/* Desktop zoom buttons */}
        <Flex
          position="absolute"
          bottom="20px"
          right="20px"
          zIndex={10}
          gap={2}
          display={{ base: "none", md: "flex" }}
        >
          <IconButton icon={<AddIcon />} onClick={zoomIn} />
          <IconButton icon={<MinusIcon />} onClick={zoomOut} />
        </Flex>

        <Box
          ref={containerRef}
          w="100%"
          h="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          overflow="hidden"
          cursor={scale > 1 ? "grab" : "default"}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            ref={imageRef}
            src={imageUrl}
            maxH="100%"
            maxW="100%"
            transform={`translate(${position.x}px, ${position.y}px) scale(${scale})`}
            transition="transform 0.1s ease-out"
            objectFit="contain"
            draggable={false}
            userSelect="none"
            pointerEvents="none"
          />
        </Box>
        <Text mt={4} color={'whiteAlpha.800'} display={{ base: "block", md: "none" }}>
          Pinch to zoom
        </Text>
      </ModalContent>
    </Modal>
  );
}
