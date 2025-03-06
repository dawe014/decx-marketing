"use client";

import { useRouter } from "next/navigation";
import ProfileLayout from "@/components/ProfileLayout";

export default function StepOne() {
  const router = useRouter();

  return (
    <ProfileLayout step={1}>
      <h2 className="text-xl font-bold mb-4">Basic Info</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/create-profile/step-2");
        }}
      >
        <input
          type="text"
          placeholder="Full Name"
          className="border p-2 w-full mb-4 outline-primary"
          required
        />
        <input
          type="text"
          placeholder="Location"
          className="border p-2 w-full mb-4 outline-primary"
          required
        />
        <input
          type="text"
          placeholder="Profile Title"
          className="border p-2 w-full mb-4 outline-primary"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded"
        >
          Next
        </button>
      </form>
    </ProfileLayout>
  );
}
