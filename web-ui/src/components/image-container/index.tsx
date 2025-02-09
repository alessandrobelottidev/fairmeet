import Image from "next/image";

const ImageContainer = ({ url }: { url: string }) => {
  return (
    <div className="flex-grow overflow-y-scroll">
      <Image
        src={url}
        alt="Responsive SVG"
        width={382}
        height={600}
        className="w-full"
      />
    </div>
  );
};

export default ImageContainer;
