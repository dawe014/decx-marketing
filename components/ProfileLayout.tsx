import { ReactNode } from "react";
import StepProgress from "./StepProgress";

interface ProfileLayoutProps {
  step: number;
  children: ReactNode;
}

export default function ProfileLayout({ step, children }: ProfileLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <StepProgress currentStep={step} />
      <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-3xl mt-6">
        {children}
      </div>
    </div>
  );
}
