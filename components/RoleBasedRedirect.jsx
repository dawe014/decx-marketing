"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// import { getUserFromCookies } from "@/utils/getUserFromCookies";
export default function RoleBasedRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const checkRedirect = async () => {
      //   const decoded = await getUserFromCookies;
      //   console.log(decoded);
      const res = await fetch("/api/auth/redirect-check");
      const data = await res.json();
      console.log("data returned form the redirect", data);
      router.replace(data.redirect);
    };

    if (status === "authenticated") {
      checkRedirect();
    }
  }, [status, router]);

  return null; // Or loading spinner
}
