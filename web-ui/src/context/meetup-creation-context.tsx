"use client";

import { User } from "@/lib/auth";
import { IGroup } from "@fairmeet/rest-api";
import { createContext, useContext, ReactNode, useState } from "react";

export interface Friend {
  user: User;
  lat?: Number;
  long?: Number;
}

export interface MeetupData {
  groupId: string;
  group?: IGroup;
  user?: User;
  friends?: Friend[];
  userPositionToChange?: User;

  /// CLAUDE SUGGESTIONS
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
  user: undefined,
  group: undefined,
  friends: undefined,
  userPositionToChange: undefined,

  /// CLAUDE SUGGESTIONS
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
        return Boolean(
          meetupData.groupId &&
            meetupData.groupId !== "" &&
            meetupData.user &&
            meetupData.group &&
            meetupData.friends
        );
      case 2:
        if (!meetupData.friends || meetupData.friends.length === 0) {
          return false;
        }

        // Check that all friends have valid lat and long
        return meetupData.friends.every((friend) => friend.lat && friend.long);
      case 3:
        return Boolean(
          meetupData.attendeeLimit && meetupData.categories?.length
        );
      case 4:
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
