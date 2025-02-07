"use client";

import { isValidUrl } from "@/lib/url";
import { IPlace } from "@fairmeet/rest-api";
import Image from "next/image";
import { useState } from "react";
import Button from "./Button";

interface Props {
  place: IPlace;
}

export const PlaceItem = ({ place }: Props) => {
  const placeholderUrl = "/placeholder.jpg";
  const [imgSrc, setImgSrc] = useState<string>(
    isValidUrl(place.featuredImageUrl) ? place.featuredImageUrl : placeholderUrl
  );

  return (
    <div className="flex flex-row gap-4">
      <div className="relative min-w-[80px] max-w-[120px] w-full aspect-square">
        <Image
          src={imgSrc}
          alt={`Image of event/spot: ${place.title}`}
          className="rounded-lg"
          objectFit="cover"
          fill
          onError={() => setImgSrc(placeholderUrl)}
        />
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <div className=" min-w-[100px] max-h-[80px] overflow-y-auto justify-center mb-2">
          <h3 className="text-base font-semibold mb-1 leading-5">
            {place.title}
          </h3>
          <p className="text-gray-600 text-sm">
            {place.abstract ?? "Nessuna descrizione disponibile..."}
          </p>
        </div>

        <Button
          title="Dettagli"
          href={
            place.startDateTimeZ
              ? `/events/${place._id}`
              : `/spots/${place._id}`
          }
          variant="secondary"
        />
      </div>
    </div>
  );
};
