"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProfileLayout from "@/components/ProfileLayout";
import { useSession } from "next-auth/react";

import {
  FiPlus,
  FiX,
  FiArrowRight,
  FiDollarSign,
  FiGlobe,
} from "react-icons/fi";

interface Service {
  name: string;
  fee: string;
}

interface Language {
  name: string;
  level: "Basic" | "Conversational" | "Fluent" | "Native";
}

const languageLevels = ["Basic", "Conversational", "Fluent", "Native"] as const;

export default function StepThree() {
  const router = useRouter();
  const session = useSession();

  const [services, setServices] = useState<Service[]>([{ name: "", fee: "" }]);
  const [languages, setLanguages] = useState<Language[]>([
    { name: "", level: "Conversational" },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const addService = () => {
    setServices([...services, { name: "", fee: "" }]);
  };

  const removeService = (index: number) => {
    if (services.length > 1) {
      setServices(services.filter((_, i) => i !== index));
    }
  };

  const handleServiceChange = (
    index: number,
    field: keyof Service,
    value: string
  ) => {
    const updated = services.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    );
    setServices(updated);
  };

  const addLanguage = () => {
    setLanguages([...languages, { name: "", level: "Conversational" }]);
  };

  const removeLanguage = (index: number) => {
    if (languages.length > 1) {
      setLanguages(languages.filter((_, i) => i !== index));
    }
  };

  const handleLanguageChange = (
    index: number,
    field: keyof Language,
    value: string
  ) => {
    const updated = languages.map((lang, i) =>
      i === index ? { ...lang, [field]: value } : lang
    );
    setLanguages(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      services.some((s) => !s.name || !s.fee) ||
      languages.some((l) => !l.name)
    ) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/influencers/${session?.data?.user.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            services,
            languages,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("Failed to update profile:", result.message);
        return;
      }

      router.push("/create-profile/step-4");
    } catch (err) {
      console.error("Something went wrong:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProfileLayout step={3}>
      <div className="max-w-md mx-auto space-y-8">
        {/* Services */}
        <div>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Your Services
            </h2>
            <p className="text-slate-400">
              Add the services you offer and your pricing
            </p>
          </div>

          <div className="space-y-4">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative bg-slate-800/30 p-4 rounded-lg border border-slate-700 hover:border-indigo-500"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">
                      Service Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Instagram Post"
                      value={service.name}
                      onChange={(e) =>
                        handleServiceChange(index, "name", e.target.value)
                      }
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2.5 px-4 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-300 mb-2">
                      Fee
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <FiDollarSign />
                      </div>
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g., 100"
                        value={service.fee}
                        onChange={(e) =>
                          handleServiceChange(index, "fee", e.target.value)
                        }
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2.5 px-4 pl-10 text-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                {services.length > 1 && (
                  <button
                    title="remove"
                    type="button"
                    onClick={() => removeService(index)}
                    className="absolute -top-3 -right-3 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addService}
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg flex items-center justify-center"
          >
            <FiPlus className="mr-2" /> Add Another Service
          </button>
        </div>

        {/* Languages */}
        <div>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Languages</h2>
            <p className="text-slate-400">
              Add the languages you speak and your proficiency level
            </p>
          </div>

          <div className="space-y-4">
            {languages.map((language, index) => (
              <div
                key={index}
                className="group relative bg-slate-800/30 p-4 rounded-lg border border-slate-700 hover:border-indigo-500"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">
                      Language
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <FiGlobe />
                      </div>
                      <input
                        type="text"
                        placeholder="e.g., English"
                        value={language.name}
                        onChange={(e) =>
                          handleLanguageChange(index, "name", e.target.value)
                        }
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2.5 px-4 pl-10 text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-300 mb-2">
                      Proficiency
                    </label>
                    <select
                      title="language"
                      value={language.level}
                      onChange={(e) =>
                        handleLanguageChange(
                          index,
                          "level",
                          e.target.value as Language["level"]
                        )
                      }
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2.5 px-4 text-white"
                    >
                      {languageLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {languages.length > 1 && (
                  <button
                    title="remove"
                    type="button"
                    onClick={() => removeLanguage(index)}
                    className="absolute -top-3 -right-3 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addLanguage}
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg flex items-center justify-center"
          >
            <FiPlus className="mr-2" /> Add Another Language
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={
            isLoading ||
            services.some((s) => !s.name || !s.fee) ||
            languages.some((l) => !l.name)
          }
          className={`w-full py-3 px-6 rounded-lg flex items-center justify-center ${
            services.every((s) => s.name && s.fee) &&
            languages.every((l) => l.name)
              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
              : "bg-slate-700 text-slate-400 cursor-not-allowed"
          }`}
        >
          {isLoading ? "Saving..." : "Continue to Next Step"}
          <FiArrowRight className="ml-2" />
        </button>
      </div>
    </ProfileLayout>
  );
}
