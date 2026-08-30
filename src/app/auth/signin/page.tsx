import { redirect } from "next/navigation";

// Redirect /auth/signin to /auth/login (the canonical route)
export default function SigninRedirect() {
  redirect("/auth/login");
}
