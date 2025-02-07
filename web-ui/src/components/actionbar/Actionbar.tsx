interface ActionBarProps {
  name: string;
}

const ActionBar = ({ name }: ActionBarProps) => {
  return (
    <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-gray-200">
      <button className="w-full bg-black text-white rounded-full py-3 px-4 flex items-center justify-center space-x-2">
        <span>{name}</span>
        <span className="text-xl">+</span>
      </button>
    </div>
  );
};

export default ActionBar;
