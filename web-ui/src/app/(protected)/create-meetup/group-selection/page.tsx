"use client";

import { useEffect, useState } from "react";
import { useMeetupCreation } from "@/context/meetup-creation-context";
import { IGroup } from "@fairmeet/rest-api";
import { getCurrentUser, User } from "@/lib/auth";
import { clientFetch } from "@/lib/client-fetch";
import ContinueButton from "@/components/meetup-creation/ContinueButton";
import { Friend } from "@/context/meetup-creation-context";

export default function GroupSelectionStep() {
  const { setCurrentStep, updateMeetupData, meetupData } = useMeetupCreation();
  const [groups, setGroups] = useState<IGroup[] | null>(null);

  const fetchData = async () => {
    try {
      const userData = await getCurrentUser();
      updateMeetupData({ user: userData ?? undefined });

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
      console.error("Error fetching user or groups:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentStep(1);
  }, [setCurrentStep]);

  return (
    <div className="p-6 h-full">
      <h1 className="text-2xl font-bold text-center">
        Scegli per quale gruppo creare il ritrovo
      </h1>
      <form className="space-y-4 mt-4 mb-4">
        <div className="rounded-full border-2 overflow-clip">
          <select
            value={meetupData.groupId}
            onChange={(e) =>
              updateMeetupData({
                groupId: e.target.value,
                group: groups?.find((el) => el._id === e.target.value),
                friends: (
                  groups?.find((el) => el._id === e.target.value)
                    ?.members as User[]
                )?.map((u) => ({
                  user: u,
                })),
              })
            }
            className="block w-full bg-white px-3 py-2 border-r-8 border-r-transparent focus:outline-none"
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
      <ContinueButton>Continua</ContinueButton>
    </div>
  );
}
