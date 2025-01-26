import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  link: string;
  className?: string;
}

export default function BackButton(props: Props) {
  return (
    <div className={`p-4 w-max ${props.className}`}>
      <Link href={props.link}>
        <ArrowLeft size={24} />
      </Link>
    </div>
  );
}
