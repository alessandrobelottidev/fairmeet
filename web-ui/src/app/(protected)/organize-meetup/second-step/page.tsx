"use client";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface FriendLocation {
  id: number;
  name: string;
  position: text;
}

const GetPosition = () => {
  const searchParams = useSearchParams();
  const people = searchParams.get("people");

  // Initialize state with an array of FriendLocation objects
  const [friends, setFriends] = useState<FriendLocation[]>(
    Array.from({ length: people }, (_, i) => ({
      id: i + 1, // Crescent IDs starting from 1
      name: "", // Empty string for name
      position: "", // Empty number for position
    }))
  );

  const updateFriendName = (
    id: number,
    field: keyof FriendLocation,
    value: string
  ) => {
    setFriends(
      friends.map((friend) =>
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

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col">
      <Link href="/organize-meetup/first-step">
        <button className="mb-12">
          <ArrowLeft size={24} />
        </button>
      </Link>

      <h1 className="text-2xl font-bold text-center mb-6">Organizza ritrovo</h1>

      {/* Blue Banner */}
      <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg mb-6">
        <div className="flex-shrink-0">
          <div className="bg-blue-200 text-blue-700 w-8 h-8 flex items-center justify-center rounded-full">
            ?
          </div>
        </div>
        <p className="text-sm">
          Il gruppo che verrà creato sarà composto solo dagli amici registrati
          sulla piattaforma con un proprio tag.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {friends.map((friend, index) => (
          <div key={friend.id}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-1">
                  <span className="text-gray-600 text-sm">
                    Tag amico #{index + 1}
                  </span>
                </div>
                <input
                  type="text"
                  value={friend.name}
                  onChange={(e) =>
                    updateFriendName(friend.id, "name", e.target.value)
                  }
                  placeholder="Nome Cognome"
                  className="w-full p-2 rounded-full border border-gray-200 text-sm"
                />
              </div>

              <div>
                <div className="mb-1">
                  <span className="text-gray-600 text-sm">Posizione</span>
                </div>
                <input
                  type="text"
                  value={friend.position}
                  onChange={(e) =>
                    updateFriendPosition(friend.id, "position", e.target.value)
                  }
                  placeholder="Posizione manuale"
                  className="w-full p-2 rounded-full border border-gray-200 text-gray-500 text-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Link
        href={{
          pathname: "/organize-meetup/third-step",
          query: { friends: JSON.stringify(friends), people: people },
        }}
      >
        <button className="mt-auto mx-4 bg-black text-white rounded-full py-3 text-sm font-medium">
          CERCA POSTO DI INCONTRO
        </button>
      </Link>
    </div>
  );
};

export default GetPosition;
