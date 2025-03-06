"use client";

import { useRouter } from "next/navigation";
import ProfileLayout from "@/components/ProfileLayout";

export default function StepFive() {
  const router = useRouter();

  return (
    <ProfileLayout step={5}>
      <h2 className="text-xl font-bold mb-4">Portfolio</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/create-profile/step-6");
        }}
      >
        <input
          type="file"
          multiple
          className="border p-2 w-full mb-4 outline-primary"
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
