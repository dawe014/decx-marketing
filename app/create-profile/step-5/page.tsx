"use client";

import { useRouter } from "next/navigation";
import ProfileLayout from "@/components/ProfileLayout";
import { FaCheckCircle } from "react-icons/fa";

export default function StepFive() {
  const router = useRouter();

  return (
    <ProfileLayout step={5}>
      <div className="flex flex-col items-center text-center p-6 shadow-md rounded-lg max-w-lg mx-auto">
        <FaCheckCircle className="text-green-500 text-6xl mb-4" />
        <h2 className="text-2xl font-bold mb-2">Congratulations! 🎉</h2>
        <p className="text-gray-200 mb-4">
          You have successfully completed your profile setup. Now you can start
          connecting with brands and influencers!
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition"
        >
          Go to Dashboard
        </button>
      </div>
    </ProfileLayout>
  );
}
