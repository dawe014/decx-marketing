"use client";

import { useRouter } from "next/navigation";
import ProfileLayout from "@/components/ProfileLayout";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Location {
  city: string;
  country: string;
}

export default function StepOne() {
  const router = useRouter();
  const [dob, setDob] = useState<Date | null>(null);
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
      <h2 className="text-xl font-bold mb-4">Basic Info</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          className="border p-2 w-full mb-4 outline-primary"
          required
        />
        <div className="mb-4">
          <label className="block mb-1">Date of Birth</label>
          <DatePicker
            selected={dob}
            onChange={(date) => setDob(date)}
            className="border p-2 w-full outline-primary"
            placeholderText="Select Date"
            required
            showYearDropdown
            yearDropdownItemNumber={15} // Show 15 years in dropdown
            dropdownMode="select" // Use dropdown for navigation
          />
        </div>
        <input
          type="text"
          placeholder="City"
          className="border p-2 w-full mb-4 outline-primary"
          value={location.city}
          onChange={(e) => setLocation({ ...location, city: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Country"
          className="border p-2 w-full mb-4 outline-primary"
          value={location.country}
          onChange={(e) =>
            setLocation({ ...location, country: e.target.value })
          }
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          className="border p-2 w-full mb-4 outline-primary"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-4 outline-primary"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <textarea
          placeholder="Bio"
          className="border p-2 w-full mb-4 outline-primary"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
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
