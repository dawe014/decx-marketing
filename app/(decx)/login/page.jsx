import { auth } from "@/auth";
import { redirect } from "next/navigation";

import SigninModal from "@/components/auth/SigninModal";
import { Alert } from "@/components/Alert";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

export default async function LoginPage() {
  const session = await auth();
  console.log("Session in LoginPage:", session);
  if (session) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(
      `${baseUrl}/api/auth/redirect-check/${session.user.id}`
    );
    const data = await res.json();
    console.log("Response from redirect-check:", data);
    redirect(data.redirect); // server-side redirect
  }

  return (
    <div>
      <SigninModal isOpen={true}>
        <GoogleSignInButton />
        <Alert />
      </SigninModal>
    </div>
  );
}
