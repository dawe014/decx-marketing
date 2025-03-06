"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProfileLayout from "@/components/ProfileLayout";

interface Service {
  name: string;
  fee: string;
}

export default function StepFour() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([{ name: "", fee: "" }]);

  // Function to handle adding a new service
  const addService = () => {
    setServices([...services, { name: "", fee: "" }]);
  };

  // Function to handle input changes
  const handleInputChange = (
    index: number,
    field: keyof Service,
    value: string
  ) => {
    const updatedServices = [...services];
    updatedServices[index][field] = value;
    setServices(updatedServices);
  };

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(services); // Log the services to check the data
    router.push("/create-profile/step-5");
  };

  return (
    <ProfileLayout step={4}>
      <h2 className="text-xl font-bold mb-4">Services</h2>
      <form onSubmit={handleSubmit}>
        {services.map((service, index) => (
          <div key={index} className="mb-4  shadow">
            <input
              type="text"
              placeholder="Service Name (e.g., Instagram Post)"
              value={service.name}
              onChange={(e) => handleInputChange(index, "name", e.target.value)}
              className="border p-2 w-full mb-2 outline-primary"
              required
            />
            <input
              type="number"
              placeholder="Fee (e.g., 100)"
              value={service.fee}
              onChange={(e) => handleInputChange(index, "fee", e.target.value)}
              className="border p-2 w-full outline-primary"
              required
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addService}
          className="bg-gray-200 text-gray-700 py-2 px-4 rounded mb-4"
        >
          Add Another Service
        </button>

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
