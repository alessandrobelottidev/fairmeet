import React from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Mail,
  Globe,
  Instagram,
  Facebook,
  LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { IPlace } from "@fairmeet/rest-api";
import BackButton from "./BackButton";
import ShareButton from "./ShareButton";

const socialIcons: Record<"instagram" | "facebook", LucideIcon> = {
  instagram: Instagram,
  facebook: Facebook,
};

export const PlaceDetails = ({ place }: { place: IPlace }) => {
  return (
    <div className="h-full max-h-[calc(_100vh_-_70px_)] overflow-y-scroll">
      <div className="min-h-[calc(_100vh_-_70px_)] flex flex-col">
        {/* Main Image and Back Button Section */}
        <div className="relative w-full h-64 mb-4">
          <div className="absolute top-4 left-4 z-10">
            <BackButton />
          </div>
          <Image
            src={place.featuredImageUrl ?? "/api/placeholder/600/400"}
            alt={place.title}
            className="object-cover"
            fill
          />
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-t-xl -mt-6 relative z-10 flex-1">
          {/* Title Section */}
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">{place.title}</h1>
            <p className="text-gray-600 text-sm mb-6">{place.description}</p>

            {/* Details Grid */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="bg-green-50 p-2 rounded-lg">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-gray-500">{place.address}</p>
                </div>
              </div>

              {place.startDateTimeZ && (
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Date</p>
                    <p className="text-sm text-gray-500">
                      {new Date(place.startDateTimeZ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              {place.startDateTimeZ && (
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="bg-purple-50 p-2 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Time</p>
                    <p className="text-sm text-gray-500">
                      {new Date(place.startDateTimeZ).toLocaleTimeString()} -{" "}
                      {place.endDateTimeZ &&
                        new Date(place.endDateTimeZ).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              )}

              {place.email && (
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="bg-red-50 p-2 rounded-lg">
                    <Mail className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Contact</p>
                    <p className="text-sm text-gray-500">{place.email}</p>
                  </div>
                </div>
              )}

              {/* Social Media Links */}
              {place.socialMediaHandles && (
                <div className="flex items-center gap-3 mt-4">
                  {Object.entries(place.socialMediaHandles).map(
                    ([platform, url]) => {
                      const Icon =
                        socialIcons[platform as keyof typeof socialIcons];
                      return (
                        <Link
                          key={platform}
                          href={url as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-50 p-2 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          {Icon ? (
                            <Icon size={24} className="text-blue-600" />
                          ) : (
                            <Globe size={24} className="text-blue-600" />
                          )}
                        </Link>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Share Button */}
          <div className="border-t border-gray-200 p-4">
            <ShareButton place={place} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetails;
