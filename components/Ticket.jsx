import React from "react";
import styles from "./ticket.module.css";
import { Flex, Text } from "@chakra-ui/react";

const Ticket = ({
  title = "TICKET",
  date = "20/04/2023",
  id = "34r33",
  status = "pending",
}) => {
  const statusClass =
    {
      active: styles.active,
      pending: styles.pending,
      closed: styles.closed,
    }[status.toLowerCase()] || styles.pending;

  return (
    <div className={styles.ticket}>
      <div className={styles.leftEdge}></div>

      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <Text
          fontWeight={600}
          className={styles.leftText}
        >{`Date Created : ${date}`}</Text>
        <Flex
          position={"absolute"}
          bottom={0}
          left={0}
          padding={4}
          boxSizing="border-box"
          w="85%"
          justify={"space-between"}
          fontWeight={600}
          fontSize={"12px"}
        >
          <Text>{`Ticket Id : # ${id}`}</Text>
          <Flex align="center" gap={2}>
            <Text>Status:</Text>
            <span className={`${styles.statusDot} ${statusClass}`} />
            <Text>{status}</Text>
          </Flex>
        </Flex>
      </div>

      <div className={styles.separator}></div>

      <div className={styles.rightEdge}></div>
    </div>
  );
};

export default Ticket;
