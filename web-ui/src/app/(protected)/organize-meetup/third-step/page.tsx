"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ReceiptCent } from "lucide-react";

interface RecommendationOptions {
  currentTime: Date;
  coordinates: [number, number];
  groupSize: number;
  timeOfDay: "morning" | "afternoon" | "evening";
  preferences?: {
    maxDistance?: number; // in kilometers
    preferIndoor?: boolean;
    preferOutdoor?: boolean;
    activityType?: "active" | "relaxed";
  };
}

export default function EventsPage() {
  const [recommendations, setRecommendations] = useState(null);

  const searchParams = useSearchParams(); // Extract query params
  const friendsJSON = searchParams.get("friends");
  const numberPeople = searchParams.get("people");

  const friendsArray = JSON.parse(friendsJSON);

  // console.log(friendsJSON); // Verify the parsed array
  // console.log(friendsArray);

  // Extracting positions
  const positionsFriends = friendsArray.map((friendsArray) =>
    friendsArray.position.split(",").map(Number)
  );

  // console.log(positionsFriends);

  //create the request based on user preferences
  const data: RecommendationOptions = {
    currentTime: new Date(),
    coordinates: positionsFriends,
    groupSize: JSON.parse(numberPeople),
    timeOfDay: "morning",
    preferences: {
      maxDistance: 10, // in kilometers
      preferIndoor: false,
      preferOutdoor: false,
      activityType: "relaxed",
    },
  };

  console.log(data);
  // const response = fetch(
  //   "http://localhost:3001/v1/recommend?${data.toString()}"
  // );

  // Mock data for events
  const events = [
    {
      id: 1,
      title: "Event One",
      description: "This is the first event description.",
    },
    {
      id: 2,
      title: "Event Two",
      description: "Details about the second event go here.",
    },
    {
      id: 3,
      title: "Event Three",
      description: "Description for the third event.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-blue-600 mb-8">
        Eventi e punti di interesse
      </h1>

      {/* Event List */}
      <div className="w-full max-w-4xl space-y-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {event.title}
            </h2>
            <p className="text-gray-600">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// export default function ShowEvents() {
//   const router = useRouter();
//   const searchParams = useSearchParams(); // Extract query params
//   const friendsJSON = searchParams.get("friends");

//   const friendsArray = JSON.parse(friendsJSON);

//   console.log(friendsJSON); // Verify the parsed array
//   console.log(friendsArray);

//   return (
//     <>
//       <div className="fixed inset-0 flex items-end bg-black bg-opacity-40 sm:items-center">
//         <div className="w-full max-w-md p-4 bg-white rounded-t-2xl sm:rounded-2xl sm:mx-auto">
//           {/* Handle */}
//           <div className="flex justify-center mb-4">
//             <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
//           </div>

//           {/* Header */}
//           <div className="flex items-center justify-between">
//             <h2 className="text-lg font-bold">Eventi e punti di interesse</h2>
//             <button className="text-red-500 font-bold" aria-label="Close">
//               Chiudi
//             </button>
//           </div>

//           {/* Subheader */}
//           <p className="text-sm text-gray-500 mb-4">Trovati 4 risultati</p>

//           {/* Events List */}
//           <div className="space-y-4">
//             {/* Event Item */}
//             <div className="flex items-center p-2 bg-gray-50 rounded-lg shadow">
//               <img
//                 src="https://via.placeholder.com/50"
//                 alt="Festa di Primavera"
//                 className="w-12 h-12 rounded-md"
//               />
//               <div className="ml-3 flex-1">
//                 <h3 className="font-semibold text-sm">Festa di Primavera</h3>
//                 <p className="text-xs text-gray-500">
//                   Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//                 </p>
//               </div>
//               <button
//                 className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-600 rounded-full"
//                 aria-label="Add"
//               >
//                 +
//               </button>
//             </div>

//             {/* Event Item */}
//             <div className="flex items-center p-2 bg-gray-50 rounded-lg shadow">
//               <img
//                 src="https://via.placeholder.com/50"
//                 alt="Festival di XYZ"
//                 className="w-12 h-12 rounded-md"
//               />
//               <div className="ml-3 flex-1">
//                 <h3 className="font-semibold text-sm">Festival di XYZ</h3>
//                 <p className="text-xs text-gray-500">
//                   Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//                 </p>
//               </div>
//               <button
//                 className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 rounded-full"
//                 aria-label="Remove"
//               >
//                 -
//               </button>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="mt-6">
//             <button className="w-full bg-black text-white py-3 rounded-full font-bold">
//               CONDIVIDI RITROVO (1)
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
