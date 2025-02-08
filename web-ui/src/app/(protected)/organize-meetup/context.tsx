"use client";
import React, { createContext, useState } from "react";

interface FriendLocation {
  id: number;
  name: string;
  position: string;
}

interface MeetupUserPreferences {
  coordinates: number[][];
  groupSize: number;
  preferences?: {
    maxDistance?: number; // in kilometers
    preferIndoor?: boolean;
    preferOutdoor?: boolean;
    activityType?: "active" | "relaxed";
  };
}

interface responseData {
  place: {
    location: {
      type: string;
      coordinates: number[];
    };
    _id: string;
    title: string;
    address: string;
    description: string;
    updated_at: Date;
    __v: 0;
  };
  score: number;
  factors: {
    timeScore: number;
    locationScore: number;
    amenitiesScore: number;
    popularityScore: number;
  };
}

interface MeetUpContextType {
  peopleNumber: number;
  friends: FriendLocation[] | undefined;
  recommendations: responseData[];
  selectedEvents: Set<responseData>;
  groupName: string;

  updateNumPeople: (newNum: number) => void;
  initFriends: () => void;
  updateFriendName: (
    id: number,
    field: keyof FriendLocation,
    value: string
  ) => void;
  updateFriendPosition: (
    id: number,
    field: keyof FriendLocation,
    value: string
  ) => void;
  removeFriend: (id: number) => void;
  addFriend: () => void;
  fetchRecommendations: (positions: number[][], peopleNumber: number) => void;
  toggleEventSelection: (event: responseData) => void;
  updateGroupName: (name: string) => void;

  userCoordinates: number[];
  userRecommendations: responseData[];
  updateUserCoordinates: (latitude: number, longitude: number) => void;
}

/// WTF IS THIS I DONT GET IT, DID YOU MEAN TO MAKE SOME MODIFICATIONS?
// SHOULD HAVE UPLOADED SOME DOC OR KEPT THIS TO YOURSELF FOR NOW -Ale
// Create the context
export const MeetUpContext = createContext<MeetUpContextType>({
  peopleNumber: 3,
  friends: undefined,
  recommendations: [],
  selectedEvents: new Set<responseData>(),
  groupName: "",
  updateNumPeople: () => {
    console.warn("updateNumPeople is not implemented");
  },
  initFriends: () => {
    console.warn("initFriends is not implemented");
  },
  updateFriendName: () => {
    console.warn("updateFriendName is not implemented");
  },
  removeFriend: (id: number) => {
    console.warn("removeFriend is not implemented");
  },
  addFriend: () => {
    console.warn("updateFriendPosition is not implemented");
  },
  updateFriendPosition: () => {
    console.warn("updateFriendPosition is not implemented");
  },

  fetchRecommendations: (positions: number[][], peopleNumber: number) => {
    console.warn("fetchRecommendations is not implemented");
  },
  toggleEventSelection: (event: responseData) => {
    console.warn("toggleEventSelection is not implemented");
  },
  updateGroupName: (name: string) => {
    console.warn("updateGroupName is not implemented");
  },

  userCoordinates: [],
  userRecommendations: [],
  updateUserCoordinates: (latitude: number, longitude: number) => {
    console.warn("updateUserCoordinate is not implemented");
  },
});

// Create the provider component
export const MeetUpProvider = ({ children }: { children: React.ReactNode }) => {
  // Define your shared state variables here
  const [peopleNumber, setNumPeople] = useState(3);
  const [friends, setFriends] = useState([
    { id: 1, name: "", position: "" },
  ] as FriendLocation[]);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState(new Set<responseData>());
  const [groupName, setGroupName] = useState("");
  const [userCoordinates, setUserCoordinates] = useState([0, 0]);
  const [userRecommendations, setUserRecommendations] = useState([]);

  const initFriends = () => {
    setFriends(
      Array.from({ length: friends.length }, (_, i) => ({
        id: i + 1, // Crescent IDs starting from 1
        name: "", // Empty string for name
        position: "", // Empty number for position
      }))
    );
  };

  // Add any functions to modify the state
  const updateNumPeople = (newNumPeople: number): void => {
    setNumPeople(newNumPeople);
    initFriends();
  };

  const updateFriendName = (
    id: number,
    field: keyof FriendLocation,
    value: string
  ) => {
    setFriends(
      friends?.map((friend) =>
        friend.id === id ? { ...friend, [field]: value } : friend
      )
    );
  };

  const updateFriendPosition = (
    id: number,
    field: keyof FriendLocation,
    value: string
  ) => {
    //here it need some middleware that can change the text address in coordinates
    setFriends(
      friends.map((friend) =>
        friend.id === id ? { ...friend, [field]: value } : friend
      )
    );
  };

  const removeFriend = (id: number) => {
    // serve almeno un amico per creare un gruppo di incontro
    if (friends.length > 1) {
      setFriends(friends.filter((friend) => friend.id !== id));
    }
  };

  const addFriend = () => {
    setFriends([
      ...friends,
      {
        id: friends.length + 1,
        name: "",
        position: "",
      },
    ]);
  };

  const fetchRecommendations = async (
    positions: number[][],
    peopleNumber: number
  ) => {
    const data: MeetupUserPreferences = {
      coordinates: positions,
      groupSize: peopleNumber,
      preferences: {
        maxDistance: 10, // in kilometers
        preferIndoor: false,
        preferOutdoor: false,
        activityType: "relaxed",
      },
    };

    try {
      const response = await fetch("http://localhost:3001/v1/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (peopleNumber == 0) {
        setUserRecommendations(result);
      } else {
        setRecommendations(result);
      }
    } catch (error: any) {
      console.error("Failed to fetch recommendations:", error);
    }
  };

  const toggleEventSelection = (event: responseData) => {
    setSelectedEvents((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(event)) {
        newSelection.delete(event);
      } else {
        newSelection.add(event);
      }
      return newSelection;
    });
  };

  const updateGroupName = async (name: string) => {
    setGroupName(name);
  };

  const updateUserCoordinates = (latitude: number, longitude: number) => {
    setUserCoordinates([latitude, longitude]);
  };

  const value: MeetUpContextType = {
    // State for Groups
    peopleNumber,
    friends,
    recommendations,
    selectedEvents,
    groupName,

    // Functions
    updateNumPeople,
    initFriends,
    updateFriendName,
    updateFriendPosition,
    addFriend,
    removeFriend,
    fetchRecommendations,
    toggleEventSelection,
    updateGroupName,

    // State for user
    userCoordinates,
    userRecommendations,
    updateUserCoordinates,
  };

  // Create the value object that will be shared
  return (
    <MeetUpContext.Provider value={value}>{children}</MeetUpContext.Provider>
  );
};
