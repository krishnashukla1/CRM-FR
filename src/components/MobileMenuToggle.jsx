import { FaBars } from 'react-icons/fa';

const MobileMenuToggle = ({ onClick }) => {
  return (
    <button
      className="md:hidden fixed top-4 left-4 z-50 bg-white text-gray-700 p-2 rounded-md shadow-lg"
      onClick={onClick}
    >
      <FaBars className="h-6 w-6" />
    </button>
  );
};

export default MobileMenuToggle;
