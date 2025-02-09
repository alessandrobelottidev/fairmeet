import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface Props {
  link: string;
  className?: string;
}

export default function NextButton(props: Props) {
  return (
    <div className={`p-4 w-max ${props.className}`}>
      <Link href={props.link}>
        <ArrowRight size={24} className="text-white" />
      </Link>
    </div>
  );
}
