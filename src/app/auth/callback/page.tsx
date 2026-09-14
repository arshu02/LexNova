"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const [status, setStatus] = useState("Authenticating with Google via Supabase...");

  useEffect(() => {
    async function processCallback() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session?.user) {
          // Check hash or URL search params in case of hash redirect
          const { data: authData } = await supabase.auth.getUser();
          if (authData?.user?.email) {
            await syncAndLogin(authData.user.email, authData.user.user_metadata?.full_name || authData.user.user_metadata?.name);
            return;
          }
          setStatus("Could not obtain user profile from Supabase. Redirecting to login...");
          setTimeout(() => { window.location.href = "/auth/login"; }, 2000);
          return;
        }

        const user = session.user;
        const email = user.email;
        const name = user.user_metadata?.full_name || user.user_metadata?.name || email?.split("@")[0];
        const accessToken = session.access_token;

        if (email && accessToken) {
          await syncAndLogin(email, accessToken, name);
        } else {
          window.location.href = "/auth/login";
        }
      } catch (err) {
        console.error("Callback error:", err);
        window.location.href = "/auth/login";
      }
    }

    async function syncAndLogin(email: string, accessToken: string, name?: string) {
      setStatus(`Logging in as ${email}...`);
      const syncRes = await fetch("/api/auth/supabase-sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ email, name }),
      });

      if (syncRes.ok) {
        const data = await syncRes.json();
        const signInResult = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (signInResult?.error) {
          console.error("NextAuth signIn failed:", signInResult.error);
          setStatus(`Sign-in error: ${signInResult.error}. Redirecting to login...`);
          setTimeout(() => { window.location.href = "/auth/login"; }, 2000);
        } else {
          window.location.href = "/dashboard/user";
        }
      } else {
        const errJson = await syncRes.json();
        console.error("Supabase sync failed:", errJson);
        setStatus("Could not synchronize user account. Redirecting to login...");
        setTimeout(() => { window.location.href = "/auth/login"; }, 2000);
      }
    }

    processCallback();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center text-slate-900">
      <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl max-w-sm w-full text-center">
        <Loader2 className="w-9 h-9 text-indigo-600 animate-spin" />
        <p className="text-sm font-bold text-slate-700">{status}</p>
        <p className="text-xs text-slate-400 font-medium">Securing session with LexNova 256-bit encryption...</p>
      </div>
    </div>
  );
}
