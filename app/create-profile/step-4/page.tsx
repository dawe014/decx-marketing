"use client";

import { useState, useRef, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import ProfileLayout from "@/components/ProfileLayout";
import { FiUpload, FiX, FiArrowRight, FiUser } from "react-icons/fi";
import Image from "next/image";

export default function StepFour() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileToUpload(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setProfileImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    setFileToUpload(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!fileToUpload) {
      alert("Please upload a profile image");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", fileToUpload);

    setIsUploading(true);

    const res = await fetch("/api/profile/upload", {
      method: "PATCH",
      body: formData,
    });

    const data = await res.json();
    setIsUploading(false);

    if (res.ok) {
      router.push("/create-profile/step-5");
    } else {
      alert(data.message || "Failed to upload image");
    }
  };

  return (
    <ProfileLayout step={4}>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Profile Picture
          </h2>
          <p className="text-slate-400">
            Upload a high-quality photo that represents you
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              {profileImage ? (
                <>
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-indigo-500/30 relative flex items-center justify-center">
                    <Image
                      src={profileImage}
                      alt="Profile"
                      height={500}
                      width={500}
                      className="object-cover"
                    />
                  </div>
                  <button
                    onClick={removeProfileImage}
                    className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5"
                    title="Remove photo"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="w-40 h-40 rounded-full bg-slate-700/50 border-4 border-dashed border-slate-600 flex items-center justify-center">
                  <FiUser className="text-5xl text-slate-500" />
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
              id="profile-upload"
            />
            <label
              htmlFor="profile-upload"
              className={`flex items-center justify-center px-6 py-3 rounded-lg cursor-pointer transition-colors ${
                isUploading
                  ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              <FiUpload className="mr-2" />
              {isUploading
                ? "Uploading..."
                : profileImage
                ? "Change Photo"
                : "Upload Photo"}
            </label>

            <p className="text-xs text-slate-500 mt-3">
              Recommended: Square image, at least 500x500 pixels
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!profileImage || isUploading}
            className={`w-full py-3 px-6 rounded-lg transition-colors flex items-center justify-center ${
              profileImage && !isUploading
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-slate-700 text-slate-400 cursor-not-allowed"
            }`}
          >
            Complete Profile <FiArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </ProfileLayout>
  );
}
