"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProfileLayout from "@/components/ProfileLayout";

interface Service {
  name: string;
  fee: string;
}

export default function StepThree() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([{ name: "", fee: "" }]);

  const addService = () => {
    setServices([...services, { name: "", fee: "" }]);
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleInputChange = (
    index: number,
    field: keyof Service,
    value: string
  ) => {
    const updatedServices = [...services];
    updatedServices[index][field] = value;
    setServices(updatedServices);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(services);
    router.push("/create-profile/step-4");
  };

  return (
    <ProfileLayout step={3}>
      <h2 className="text-2xl font-bold mb-6 text-center">Services</h2>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto p-6  shadow-md rounded-lg space-y-4 flex flex-col"
      >
        {services.map((service, index) => (
          <div
            key={index}
            className="flex items-center gap-3 border border-secondary p-3 rounded-lg  text-black bg-background  "
          >
            <div className="flex flex-col gap-2 md:flex-row md:gap-3 w-full">
              <input
                type="text"
                placeholder="Service Name (e.g., Instagram Post)"
                value={service.name}
                onChange={(e) =>
                  handleInputChange(index, "name", e.target.value)
                }
                className="text-white outline-none bg-slate-700 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                placeholder="Fee (e.g., 100)"
                value={service.fee}
                onChange={(e) =>
                  handleInputChange(index, "fee", e.target.value)
                }
                className="text-white outline-none bg-slate-700 p-2 w-36 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              onClick={() => removeService(index)}
              type="button"
              className="text-red-500"
            >
              ❌
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addService}
          className="bg-green-600 text-white py-2 md:w-max px-4 rounded-lg w-full hover:bg-green-700 transition"
        >
          Add Another Service
        </button>

        <button
          type="submit"
          className="bg-blue-600 text-white py-3 px-6 md:w-max rounded-lg w-full hover:bg-blue-700 transition"
        >
          Next
        </button>
      </form>
    </ProfileLayout>
  );
}
