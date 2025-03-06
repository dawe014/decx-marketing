"use client";

import { useRouter } from "next/navigation";
import ProfileLayout from "@/components/ProfileLayout";

export default function StepSix() {
  const router = useRouter();

  return (
    <ProfileLayout step={6}>
      <h2 className="text-xl font-bold mb-4">Contact Info</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/profile/preview");
        }}
      >
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-4 outline-primary"
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          className="border p-2 w-full mb-4 outline-primary"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded"
        >
          Finish
        </button>
      </form>
    </ProfileLayout>
  );
}
