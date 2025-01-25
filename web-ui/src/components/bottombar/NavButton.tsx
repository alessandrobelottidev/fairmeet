interface NavButtonProps {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavButton = ({
  icon: Icon,
  label,
  isActive,
  onClick,
}: NavButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center rounded-lg px-4 py-2 ${
        isActive ? "bg-green-600 text-white" : "text-gray-600"
      } focus:outline-none transition-colors duration-200`}
    >
      <Icon size={24} />
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

export default NavButton;
