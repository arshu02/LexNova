import { redirect } from "next/navigation";

// Redirect /dashboard to /dashboard/chat (the main AI Case Intake route)
export default function DashboardRedirect() {
  redirect("/dashboard/chat");
}
