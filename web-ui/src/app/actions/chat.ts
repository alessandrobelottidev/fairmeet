"use server";

import { authFetch } from "@/lib/fetch";
import type { IMessage, IGroup } from "@fairmeet/rest-api";
import { IUser } from "@fairmeet/rest-api";

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

export async function searchUserByHandle(
  handle: string
): Promise<IUser | null> {
  try {
    return await authFetch<IUser>(`/v1/auth/users/${handle}`);
  } catch (error) {
    console.error("Failed to search user:", error);
    return null;
  }
}

export async function createGroup(
  userId: string,
  data: {
    name: string;
    description?: string;
  }
): Promise<IGroup> {
  try {
    return await authFetch<IGroup>(`/v1/users/${userId}/groups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Failed to create group:", error);
    throw new Error("Failed to create group");
  }
}

export async function addGroupMember(
  userId: string,
  groupId: string,
  memberId: string
): Promise<void> {
  try {
    await authFetch(`/v1/users/${userId}/groups/${groupId}/members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: memberId, groupId: groupId }),
    });
  } catch (error) {
    console.error("Failed to add member:", error);
    throw new Error("Failed to add member to group");
  }
}
