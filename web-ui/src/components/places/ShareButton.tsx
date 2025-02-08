"use client";

import { toast } from "@/hooks/use-toast";
import { IPlace } from "@fairmeet/rest-api";
import { Share2 } from "lucide-react";

const ShareButton = ({ place }: { place: IPlace }) => {
  const handleShare = async () => {
    const shareData = {
      title: place.title,
      text: place.description,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copiato!",
          description: "Il link e' stato copiato nei tuoi appunti.",
          duration: 3000,
        });
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        toast({
          title: "Errore",
          description: "C'e stato un problema con la condivisione del link...",
          variant: "destructive",
          duration: 3000,
        });
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-colors"
    >
      <Share2 className="w-5 h-5" />
      <span>CONDIVIDI</span>
    </button>
  );
};

export default ShareButton;
