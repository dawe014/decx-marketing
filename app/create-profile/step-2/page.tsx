"use client";

import { useRouter } from "next/navigation";
import ProfileLayout from "@/components/ProfileLayout";

export default function StepTwo() {
  const router = useRouter();

  return (
    <ProfileLayout step={2}>
      <h2 className="text-xl font-bold mb-4">About You</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/create-profile/step-3");
        }}
      >
        <textarea
          placeholder="Write your bio..."
          className="border p-2 w-full h-32 mb-4 outline-primary"
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
