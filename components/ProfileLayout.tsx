import { ReactNode } from "react";
import StepProgress from "./StepProgress";

interface ProfileLayoutProps {
  step: number;
  children: ReactNode;
}

export default function ProfileLayout({ step, children }: ProfileLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <StepProgress currentStep={step} />
      <div className="bg-bgSecondary/30 sm:p-3 md:p-8 shadow-xl rounded-2xl w-full max-w-3xl mt-6">
        {children}
      </div>
    </div>
  );
}
