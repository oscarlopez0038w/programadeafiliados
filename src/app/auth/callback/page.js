"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      await supabase.auth.exchangeCodeForSession();

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("app_users")
        .select("role_id")
        .eq("user_id", user.id)
        .single();

      if (profile?.role_id === 1) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    };

    handleAuth();
  }, [router]);

  return <p>Procesando autenticación...</p>;
}
