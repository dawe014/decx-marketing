"use client";

import { useRouter } from "next/navigation";
import ProfileLayout from "@/components/ProfileLayout";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface Location {
  city: string;
  country: string;
}

export default function StepOne() {
  const router = useRouter();
  const [location, setLocation] = useState<Location>({ city: "", country: "" });
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [bio, setBio] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push("/create-profile/step-2");
  };

  return (
    <ProfileLayout step={1}>
      <h2 className="text-2xl font-bold mb-6 text-center">Basic Info</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-lg mx-auto p-6 text-black  shadow-md rounded-lg"
      >
        <div>
          <label className="block font-semibold mb-1 text-white">
            Full Name
          </label>
          <input
            type="text"
            className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-white">City</label>
          <input
            type="text"
            className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={location.city}
            onChange={(e) => setLocation({ ...location, city: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-white">Country</label>
          <input
            type="text"
            className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={location.country}
            onChange={(e) =>
              setLocation({ ...location, country: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-white">
            Phone Number
          </label>
          <PhoneInput
            country={"us"}
            value={phone}
            onChange={(value) => setPhone(value)}
            inputClass="border w-full p-3 rounded-lg  focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-white">Email</label>
          <input
            type="email"
            className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-white">
            About You
          </label>
          <textarea
            className="border p-3 w-full h-32 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-3 px-6 rounded-lg w-full md:w-max  hover:bg-blue-700 transition"
        >
          Next
        </button>
      </form>
    </ProfileLayout>
  );
}
