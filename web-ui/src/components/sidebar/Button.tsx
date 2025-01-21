interface Props {
  children: React.ReactNode;
}

export function Button(props: Props) {
  return (
    <div className="w-full p-2 bg-transparent hover:bg-green-800 hover:cursor-pointer rounded-md transition-all">
      {props.children}
    </div>
  );
}
