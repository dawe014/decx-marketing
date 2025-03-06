"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProfileLayout from "@/components/ProfileLayout";

interface SocialMediaLink {
  platform: string;
  url: string;
}

export default function StepThree() {
  const router = useRouter();

  // State to manage social media links
  const [socialMediaLinks, setSocialMediaLinks] = useState<SocialMediaLink[]>([
    { platform: "Instagram", url: "" },
    { platform: "YouTube", url: "" },
    { platform: "TikTok", url: "" },
  ]);

  // Handle adding a new social media link
  const addSocialMediaLink = () => {
    setSocialMediaLinks([...socialMediaLinks, { platform: "Other", url: "" }]);
  };

  // Handle input changes for a specific field
  const handleInputChange = (
    index: number,
    field: keyof SocialMediaLink,
    value: string
  ) => {
    const updatedLinks = [...socialMediaLinks];
    updatedLinks[index][field] = value;
    setSocialMediaLinks(updatedLinks);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(socialMediaLinks); // Log the links (this would typically be sent to a server)
    router.push("/create-profile/step-4");
  };

  return (
    <ProfileLayout step={3}>
      <h2 className="text-xl font-bold mb-4">Social Media Links</h2>
      <form onSubmit={handleSubmit}>
        {socialMediaLinks.map((link, index) => (
          <div key={index} className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">
              {link.platform} URL
            </label>
            <input
              type="url"
              placeholder={`Enter ${link.platform} URL`}
              value={link.url}
              onChange={(e) => handleInputChange(index, "url", e.target.value)}
              className="border p-2 w-full outline-primary"
              required
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addSocialMediaLink}
          className="bg-gray-200 text-gray-700 py-2 px-4 rounded mb-4"
        >
          Add Another Social Media Link
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
