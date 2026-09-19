import React, { useState, useEffect } from "react";
import { WorkflowStepper, type FlowStepId } from "./WorkflowStepper";
import { Step1NeedBlood } from "./Step1NeedBlood";
import { Step2CreateRequest } from "./Step2CreateRequest";
import { Step3MatchingAnimation } from "./Step3MatchingAnimation";
import { Step4RankedDonors } from "./Step4RankedDonors";
import { Step5SendRequest } from "./Step5SendRequest";
import { Step6DonorDashboard } from "./Step6DonorDashboard";
import { Step7Accept } from "./Step7Accept";
import { Step8DonorConfirmed } from "./Step8DonorConfirmed";
import { Step9Notification } from "./Step9Notification";
import { donors as mockDonors } from "@/data/donors";
import type { BloodGroup, District, Donor, Urgency } from "@/types";
import { toast } from "sonner";

export function BloodFlowController() {
  const [currentStep, setCurrentStep] = useState<FlowStepId>(1);
  const [isAutoSimulating, setIsAutoSimulating] = useState<boolean>(false);

  // Flow State
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>("O+");
  const [units, setUnits] = useState<number>(2);
  const [district, setDistrict] = useState<District>("Pathanamthitta");
  const [hospital, setHospital] = useState<string>("Pushpagiri Medical College, Thiruvalla");
  const [urgency, setUrgency] = useState<Urgency>("critical");
  const [patientNote, setPatientNote] = useState<string>("ICU admission, emergency transfusion required");
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(mockDonors[0]); // Arun Kumar (O+)
  const [requestCode, setRequestCode] = useState<string>("BCN-1043");

  // Handle auto simulation stepping
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoSimulating) {
      const stepDurations: Record<FlowStepId, number> = {
        1: 2500,
        2: 2500,
        3: 4500,
        4: 3500,
        5: 3000,
        6: 3500,
        7: 2500,
        8: 4000,
        9: 5000,
      };

      timer = setTimeout(() => {
        if (currentStep < 9) {
          const nextStep = (currentStep + 1) as FlowStepId;
          setCurrentStep(nextStep);
          toast.info(`Auto-Advancing to Step ${nextStep}`);
        } else {
          setIsAutoSimulating(false);
          toast.success("Simulation Complete: All 9 Steps Demonstrated!");
        }
      }, stepDurations[currentStep] || 3000);
    }
    return () => clearTimeout(timer);
  }, [isAutoSimulating, currentStep]);

  // Handlers for step actions
  const handleSelectStep = (step: FlowStepId) => {
    setCurrentStep(step);
    setIsAutoSimulating(false);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setIsAutoSimulating(false);
    setSelectedDonor(mockDonors[0]);
    toast.info("Workflow reset to Step 1: Need Blood");
  };

  const handleFastEmergency = () => {
    setBloodGroup("O+");
    setUnits(2);
    setUrgency("critical");
    setHospital("Pushpagiri Medical College, Thiruvalla");
    setCurrentStep(3); // Jump directly to matching animation
    toast.success("Critical Emergency Request Launched!");
  };

  const handleSendRequestToDonor = (donor: Donor) => {
    setSelectedDonor(donor);
    setCurrentStep(5); // Step 5: Send Request
    toast.success(`Request dispatched to ${donor.name}`);
  };

  return (
    <div className="space-y-6">
      {/* 9-Step Interactive Stepper Bar */}
      <WorkflowStepper
        currentStep={currentStep}
        onSelectStep={handleSelectStep}
        isAutoSimulating={isAutoSimulating}
        onToggleAutoSimulate={() => setIsAutoSimulating(!isAutoSimulating)}
        onReset={handleReset}
      />

      {/* Dynamic Active Step Node Renderer */}
      <main>
        {currentStep === 1 && (
          <Step1NeedBlood
            selectedGroup={bloodGroup}
            onSelectGroup={setBloodGroup}
            onProceedToCreate={() => setCurrentStep(2)}
            onFastEmergency={handleFastEmergency}
          />
        )}

        {currentStep === 2 && (
          <Step2CreateRequest
            bloodGroup={bloodGroup}
            setBloodGroup={setBloodGroup}
            units={units}
            setUnits={setUnits}
            hospital={hospital}
            setHospital={setHospital}
            district={district}
            setDistrict={setDistrict}
            urgency={urgency}
            setUrgency={setUrgency}
            patientNote={patientNote}
            setPatientNote={setPatientNote}
            onSubmit={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 3 && (
          <Step3MatchingAnimation
            bloodGroup={bloodGroup}
            district={district}
            hospital={hospital}
            donors={mockDonors}
            onCompleteMatching={() => setCurrentStep(4)}
          />
        )}

        {currentStep === 4 && (
          <Step4RankedDonors
            bloodGroup={bloodGroup}
            hospital={hospital}
            donors={mockDonors}
            selectedDonor={selectedDonor}
            onSelectDonor={setSelectedDonor}
            onSendRequest={handleSendRequestToDonor}
            onBroadcastAll={() => {
              setSelectedDonor(mockDonors[0]);
              setCurrentStep(5);
              toast.success("Broadcasted alert to Top 3 Matched Donors");
            }}
          />
        )}

        {currentStep === 5 && (
          <Step5SendRequest
            donor={selectedDonor || mockDonors[0]}
            bloodGroup={bloodGroup}
            units={units}
            hospital={hospital}
            onProceedToDonorDashboard={() => setCurrentStep(6)}
          />
        )}

        {currentStep === 6 && (
          <Step6DonorDashboard
            donor={selectedDonor || mockDonors[0]}
            bloodGroup={bloodGroup}
            units={units}
            hospital={hospital}
            urgency={urgency}
            patientNote={patientNote}
            onAccept={() => setCurrentStep(7)}
            onDecline={() => {
              toast.error("Donor declined. Re-routing to next matched donor...");
              setSelectedDonor(mockDonors[1]);
              setCurrentStep(4);
            }}
          />
        )}

        {currentStep === 7 && (
          <Step7Accept
            donor={selectedDonor || mockDonors[0]}
            onProceedToConfirmed={() => setCurrentStep(8)}
          />
        )}

        {currentStep === 8 && (
          <Step8DonorConfirmed
            donor={selectedDonor || mockDonors[0]}
            bloodGroup={bloodGroup}
            units={units}
            hospital={hospital}
            requestCode={requestCode}
            onProceedToNotification={() => setCurrentStep(9)}
          />
        )}

        {currentStep === 9 && (
          <Step9Notification
            donor={selectedDonor || mockDonors[0]}
            bloodGroup={bloodGroup}
            units={units}
            hospital={hospital}
            requestCode={requestCode}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
}
