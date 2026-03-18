import { Suspense } from "react";
import TicketsClient from "./TicketClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading tickets...</div>}>
      <TicketsClient />
    </Suspense>
  );
}
