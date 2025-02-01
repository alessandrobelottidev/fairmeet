"use client";
import { ArrowLeft, X, Plus } from "lucide-react";
import { useContext, useEffect } from "react";
import Link from "next/link";
import { MeetUpContext } from "../context";

const GetPosition = () => {
  const {
    friends,
    initFriends,
    updateFriendName,
    updateFriendPosition,
    removeFriend,
    addFriend,
  } = useContext(MeetUpContext);

  useEffect(() => {
    initFriends();
  }, [friends?.length]);

  return (
    <div className="min-h-screen bg-white p-4 flex flex-col">
      <Link href="/chat">
        <button className="mb-8">
          <ArrowLeft size={24} />
        </button>
      </Link>

      <h1 className="text-3xl font-bold text-center mb-12">
        Organizza ritrovo
      </h1>

      <div className="flex flex-col gap-6">
        {friends?.map((friend, index) => (
          <div key={friend.id} className="relative">
            <div className="grid grid-cols-11 gap-4">
              {/* nome amico */}
              <div className="col-span-5">
                <div className="mb-2">
                  <span className="text-gray-700 text-sm font-medium">
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
                  className="w-full p-3 rounded-full border border-gray-200 text-sm"
                />
              </div>

              {/* posizione amico */}
              <div className="col-span-5">
                <div className="mb-2">
                  <span className="text-gray-700 text-sm font-medium">
                    Posizione
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={friend.position}
                    onChange={(e) =>
                      updateFriendPosition(
                        friend.id,
                        "position",
                        e.target.value
                      )
                    }
                    placeholder="Posizione manuale"
                    className="w-full p-3 rounded-full border border-gray-200 text-gray-500 text-sm pr-10"
                  />
                </div>
              </div>

              {/* bottone X */}
              <button
                onClick={() => removeFriend(friend.id)}
                className="w-fit h-fit self-center place-self-center"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addFriend}
        className="mx-auto mt-6 mb-12 w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center"
      >
        <Plus size={24} className="text-gray-500" />
      </button>

      <Link href="/organize-meetup/step-3" className="mt-auto">
        <button className="w-full bg-black text-white rounded-full py-4 text-sm font-medium">
          CERCA POSTO DI INCONTRO
        </button>
      </Link>
    </div>
  );
};

export default GetPosition;

// "use client";
// import { ArrowLeft } from "lucide-react";
// import { useContext, useEffect, useState } from "react";
// import Link from "next/link";
// import { MeetUpContext } from "../context";

// const GetPosition = () => {
//   const { friends, initFriends, updateFriendName, updateFriendPosition } =
//     useContext(MeetUpContext);

//   // // Initialize state with an array of FriendLocation objects
//   // const [friends, setFriends] = useState<FriendLocation[]>(
//   //   Array.from({ length: numPeople }, (_, i) => ({
//   //     id: i + 1, // Crescent IDs starting from 1
//   //     name: "", // Empty string for name
//   //     position: "", // Empty number for position
//   //   }))
//   // );

//   useEffect(() => {
//     initFriends();
//   }, []); // Empty dependency array ensures this runs once

//   return (
//     <div className="min-h-screen bg-white p-6 flex flex-col">
//       <Link href="/organize-meetup/step-1">
//         <button className="mb-12">
//           <ArrowLeft size={24} />
//         </button>
//       </Link>

//       <h1 className="text-2xl font-bold text-center mb-6">Organizza ritrovo</h1>

//       {/* Blue Banner */}
//       <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg mb-6">
//         <div className="flex-shrink-0">
//           <div className="bg-blue-200 text-blue-700 w-8 h-8 flex items-center justify-center rounded-full">
//             ?
//           </div>
//         </div>
//         <p className="text-sm">
//           Il gruppo che verrà creato sarà composto solo dagli amici registrati
//           sulla piattaforma con un proprio tag.
//         </p>
//       </div>

//       <div className="flex flex-col gap-8">
//         {friends?.map((friend, index) => (
//           <div key={friend.id}>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <div className="mb-1">
//                   <span className="text-gray-600 text-sm">
//                     Tag amico #{index + 1}
//                   </span>
//                 </div>
//                 <input
//                   type="text"
//                   value={friend.name}
//                   onChange={(e) =>
//                     updateFriendName(friend.id, "name", e.target.value)
//                   }
//                   placeholder="Nome Cognome"
//                   className="w-full p-2 rounded-full border border-gray-200 text-sm"
//                 />
//               </div>

//               <div>
//                 <div className="mb-1">
//                   <span className="text-gray-600 text-sm">Posizione</span>
//                 </div>
//                 <input
//                   type="text"
//                   value={friend.position}
//                   onChange={(e) =>
//                     updateFriendPosition(friend.id, "position", e.target.value)
//                   }
//                   placeholder="Posizione manuale"
//                   className="w-full p-2 rounded-full border border-gray-200 text-gray-500 text-sm"
//                 />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <Link href="/organize-meetup/step-3">
//         <button className="mt-auto mx-4 bg-black text-white rounded-full py-3 text-sm font-medium">
//           CERCA POSTO DI INCONTRO
//         </button>
//       </Link>
//     </div>
//   );
// };

// export default GetPosition;
