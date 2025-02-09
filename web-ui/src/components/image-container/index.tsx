import Image from "next/image";

const ImageContainer = ({ url }: { url: string }) => {
  return (
    <div className="flex-grow overflow-hidden">
      {" "}
      {/* Contain the image */}
      <div className="relative w-full h-full">
        {" "}
        {/* Full width and height */}
        <Image
          src={url}
          alt="Responsive SVG"
          fill
          style={{
            objectFit: "contain", // Ensures entire image is visible
            objectPosition: "center", // Centers the image
          }}
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default ImageContainer;
