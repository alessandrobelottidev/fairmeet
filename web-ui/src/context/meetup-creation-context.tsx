"use client";

import { createContext, useContext, ReactNode, useState } from "react";

export interface MeetupData {
  groupId: string;
  title?: string;
  description?: string;
  date?: string;
  location?: {
    address?: string;
    city?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  attendeeLimit?: number;
  categories?: string[];
  organizer?: {
    name: string;
    email: string;
  };
}

interface MeetupCreationState {
  currentStep: number;
  steps: {
    path: string;
  }[];
  meetupData: MeetupData;
  setCurrentStep: (step: number) => void;
  updateMeetupData: (data: Partial<MeetupData>) => void;
  isStepComplete: (step: number) => boolean;
  resetForm: () => void;
}

const MeetupCreationContext = createContext<MeetupCreationState | undefined>(
  undefined
);

const INITIAL_MEETUP_DATA: MeetupData = {
  groupId: "",

  /// CLAUDE SUGGESTION
  title: "",
  description: "",
  date: "",
  location: {
    address: "",
    city: "",
  },
  attendeeLimit: 0,
  categories: [],
  organizer: {
    name: "",
    email: "",
  },
};

const BASE_URL = "/create-meetup";

const steps = [
  {
    path: `${BASE_URL}/group-selection`,
  },
  {
    path: `${BASE_URL}/participants`,
  },
  {
    path: `${BASE_URL}/search-results`,
  },
  {
    path: `${BASE_URL}/success`,
  },
];

export function MeetupCreationProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [meetupData, setMeetupData] = useState<MeetupData>(INITIAL_MEETUP_DATA);

  const updateMeetupData = (newData: Partial<MeetupData>) => {
    setMeetupData((prev: any) => ({
      ...prev,
      ...newData,
    }));
  };

  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 1:
        return Boolean(meetupData.groupId && meetupData.groupId !== "");
      case 2: // Location
        return Boolean(
          meetupData.location?.address && meetupData.location?.city
        );
      case 3: // Details
        return Boolean(
          meetupData.attendeeLimit && meetupData.categories?.length
        );
      case 4: // Review
        return isStepComplete(1) && isStepComplete(2) && isStepComplete(3);
      default:
        return false;
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setMeetupData(INITIAL_MEETUP_DATA);
  };

  return (
    <MeetupCreationContext.Provider
      value={{
        currentStep,
        steps,
        meetupData,
        setCurrentStep,
        updateMeetupData,
        isStepComplete,
        resetForm,
      }}
    >
      {children}
    </MeetupCreationContext.Provider>
  );
}

export function useMeetupCreation() {
  const context = useContext(MeetupCreationContext);
  if (context === undefined) {
    throw new Error(
      "useMeetupCreation must be used within a MeetupCreationProvider"
    );
  }
  return context;
}
