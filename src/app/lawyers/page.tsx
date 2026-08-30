import { redirect } from "next/navigation";

// Redirect /lawyers to /advocates (the canonical route)
export default function LawyersRedirect() {
  redirect("/advocates");
}
