"use client";

import { useRouter } from "next/navigation";
import ProfileLayout from "@/components/ProfileLayout";
import { useState, useRef } from "react";
import { FiPlus, FiX, FiUpload, FiArrowRight } from "react-icons/fi";

// Portfolio Item interface
interface PortfolioItem {
  file: File | null;
  description: string;
  previewUrl?: string;
}

export default function StepFour() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);

  // Adding portfolio item
  const addPortfolioItem = () => {
    setPortfolio([...portfolio, { file: null, description: "" }]);
  };

  // Handle file input change
  const handleFileChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    const updatedPortfolio = [...portfolio];
    updatedPortfolio[index].file = file;

    // Create preview URL for images
    if (file.type.startsWith("image/")) {
      updatedPortfolio[index].previewUrl = URL.createObjectURL(file);
    }

    setPortfolio(updatedPortfolio);
  };

  // Handle description change
  const handleDescriptionChange = (index: number, value: string) => {
    const updatedPortfolio = [...portfolio];
    updatedPortfolio[index].description = value;
    setPortfolio(updatedPortfolio);
  };

  // Remove portfolio item
  const removePortfolioItem = (index: number) => {
    // Revoke object URL to prevent memory leaks
    if (portfolio[index].previewUrl) {
      URL.revokeObjectURL(portfolio[index].previewUrl!);
    }
    setPortfolio(portfolio.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      portfolio.length === 0 ||
      portfolio.some((item) => !item.file || !item.description)
    ) {
      alert(
        "Please add at least one portfolio item with both a file and description"
      );
      return;
    }

    // Create FormData to send to the backend
    const formData = new FormData();
    portfolio.forEach((item, index) => {
      formData.append(`portfolioItem-${index}-file`, item.file as Blob);
      formData.append(`portfolioItem-${index}-description`, item.description);
    });

    // Send data to backend (replace with your API endpoint)
    const response = await fetch("/api/portfolio/upload", {
      method: "PATCH",
      body: formData,
    });

    if (!response.ok) {
      console.log("The response from the api", response);
      alert("Error submitting portfolio");
    } else {
      router.push("/create-profile/step-6");
    }
  };

  return (
    <ProfileLayout step={4}>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Your Portfolio</h2>
          <p className="text-slate-400">
            Showcase your best work with images/videos and descriptions
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Portfolio Items */}
          <div className="space-y-4">
            {portfolio.map((item, index) => (
              <div
                key={index}
                className="group relative bg-slate-800/30 p-4 rounded-lg border border-slate-700 hover:border-indigo-500 transition-colors"
              >
                {/* File Upload */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Upload Work
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => handleFileChange(index, e)}
                      className="hidden"
                      id={`portfolio-file-${index}`}
                      required
                    />
                    <label
                      htmlFor={`portfolio-file-${index}`}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2.5 px-4 text-white flex items-center justify-center cursor-pointer hover:bg-slate-700 transition-colors"
                    >
                      <FiUpload className="mr-2" />
                      {item.file ? item.file.name : "Choose file"}
                    </label>
                  </div>

                  {/* Preview for images */}
                  {item.previewUrl && (
                    <div className="mt-3">
                      <img
                        src={item.previewUrl}
                        alt="Preview"
                        className="max-h-40 w-auto rounded-lg object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Describe this work and your role in it..."
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                    value={item.description}
                    onChange={(e) =>
                      handleDescriptionChange(index, e.target.value)
                    }
                    required
                  />
                </div>

                {/* Remove button */}
                <button
                  title="remove"
                  type="button"
                  onClick={() => removePortfolioItem(index)}
                  className="absolute -top-3 -right-3 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Portfolio Button */}
          <button
            type="button"
            onClick={addPortfolioItem}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg flex items-center justify-center transition-colors"
          >
            <FiPlus className="mr-2" /> Add Portfolio Item
          </button>

          {/* Submit Button - Matching previous steps */}
          <button
            type="submit"
            disabled={
              portfolio.length === 0 ||
              portfolio.some((item) => !item.file || !item.description)
            }
            className={`w-full py-3 px-6 rounded-lg transition-colors flex items-center justify-center ${
              portfolio.length > 0 &&
              portfolio.every((item) => item.file && item.description)
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-slate-700 text-slate-400 cursor-not-allowed"
            }`}
          >
            Continue to Next Step <FiArrowRight className="ml-2" />
          </button>
        </form>
      </div>
    </ProfileLayout>
  );
}
