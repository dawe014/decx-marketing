"use client";

import { useParams } from "next/navigation";
import { useCampaignForm } from "@/hooks/useCampaignForm";
import CampaignForm from "../../../components/CampaignForm";

// A simple loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen bg-slate-900">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

export default function EditCampaignPage() {
  const { id } = useParams();
  const formProps = useCampaignForm(id); // Call hook WITH the ID

  if (formProps.isLoading) {
    return <LoadingSpinner />;
  }

  return <CampaignForm formType="edit" {...formProps} />;
}
