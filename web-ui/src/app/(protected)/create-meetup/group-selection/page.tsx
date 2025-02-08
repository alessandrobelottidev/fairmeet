"use client";

import { useEffect, useState } from "react";
import { useMeetupCreation } from "@/context/meetup-creation-context";
import { IGroup } from "@fairmeet/rest-api";
import { getCurrentUser, User } from "@/lib/auth";
import { clientFetch } from "@/lib/client-fetch";
import ContinueButton from "@/components/meetup-creation/ContinueButton";

export default function GroupSelectionStep() {
  const { setCurrentStep, updateMeetupData, meetupData } = useMeetupCreation();
  const [groups, setGroups] = useState<IGroup[] | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const fetchData = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);

      if (userData) {
        const userId = userData.id;

        const groups = await clientFetch<IGroup[]>(
          `/v1/users/${userId}/groups`,
          {
            method: "GET",
          }
        );

        setGroups(groups);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentStep(1);
  }, [setCurrentStep]);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold text-center">
        Scegli per quale gruppo creare il ritrovo
      </h1>
      <form className="space-y-4 mt-4">
        <div className="rounded-full border-2 overflow-clip">
          <select
            value={meetupData.groupId}
            onChange={(e) => updateMeetupData({ groupId: e.target.value })}
            className="block w-full bg-white p-3 border-r-8 border-r-transparent focus:outline-none"
          >
            <option key={-1} value="">
              Seleziona un gruppo
            </option>
            {groups?.map((group, i) => (
              <option key={i} value={group._id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>
      </form>
      <ContinueButton>CONTINUA</ContinueButton>
    </div>
  );
}
