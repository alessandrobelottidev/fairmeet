import { Calendar, MapPin, Clock, Mail, Globe } from "lucide-react";
import Image from "next/image";
import { IPlace } from "@fairmeet/rest-api";
import Link from "next/link";

const socialIcons: Record<"instagram" | "facebook", string> = {
  instagram: "instagram.com",
  facebook: "facebook.com",
};

export const PlaceDetails = ({ place }: { place: IPlace }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <Image
        src={place.featuredImageUrl ?? "/placeholder.jpg"}
        alt={place.title}
        width={600}
        height={300}
        className="rounded-lg mb-4"
      />
      <h1 className="text-2xl font-bold">{place.title}</h1>
      <p className="text-gray-600">{place.description}</p>
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2">
          <MapPin size={20} /> {place.address}
        </div>
        {place.startDateTimeZ && (
          <div className="flex items-center gap-2">
            <Calendar size={20} />{" "}
            {new Date(place.startDateTimeZ).toLocaleString()}
          </div>
        )}
        {place.endDateTimeZ && (
          <div className="flex items-center gap-2">
            <Clock size={20} /> {new Date(place.endDateTimeZ).toLocaleString()}
          </div>
        )}
        {place.email && (
          <div className="flex items-center gap-2">
            <Mail size={20} /> {place.email}
          </div>
        )}
        {place.socialMediaHandles && (
          <div className="flex gap-2 mt-2">
            {Object.entries(place.socialMediaHandles).map(([platform, url]) => (
              <Link
                key={platform}
                href={url as string}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {socialIcons[platform as keyof typeof socialIcons] ? (
                  <Image
                    src={`/${platform}.svg`}
                    alt={platform}
                    width={24}
                    height={24}
                  />
                ) : (
                  <Globe size={20} />
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
