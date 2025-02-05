"use server";

import { authFetch } from "@/lib/fetch";
import type { IMessage, IGroup } from "@fairmeet/rest-api";

export async function getGroupMessages(
  userId: string,
  groupId: string
): Promise<IMessage[]> {
  try {
    return await authFetch<IMessage[]>(
      `/v1/users/${userId}/groups/${groupId}/messages`
    ).then((v) => {
      return v.sort(
        (a, b) =>
          new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
      );
    });
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    throw new Error("Failed to fetch messages");
  }
}

export async function getGroupDetails(
  userId: string,
  groupId: string
): Promise<IGroup> {
  try {
    return await authFetch<IGroup>(`/v1/users/${userId}/groups/${groupId}`);
  } catch (error) {
    console.error("Failed to fetch group details:", error);
    throw new Error("Failed to fetch group details");
  }
}

export async function getGroups(userId: string): Promise<IGroup[]> {
  try {
    return await authFetch<IGroup[]>(`/v1/users/${userId}/groups`);
  } catch (error) {
    console.error("Failed to fetch groups:", error);
    throw new Error("Failed to fetch groups");
  }
}

export async function sendMessage(
  userId: string,
  groupId: string,
  content: string
): Promise<void> {
  try {
    await authFetch(`/v1/users/${userId}/groups/${groupId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });
  } catch (error) {
    console.error("Failed to send message:", error);
    throw new Error("Failed to send message");
  }
}
