import { redirect } from "next/navigation";

// Redirect /dashboard to /app (the real dashboard route)
export default function DashboardRedirect() {
  redirect("/app");
}
