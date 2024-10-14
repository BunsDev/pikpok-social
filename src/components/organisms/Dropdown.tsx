import { ContentType } from "@src/types";
import { useState, useRef, useEffect } from "react";

interface DropdownProps {
  items: ContentType[];
  label: string;
  onSelect: (item: ContentType) => void;
}

const Dropdown = ({ items, label, onSelect }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (item: ContentType) => {
    onSelect(item);
    setIsOpen(false); // Close the dropdown after selecting
  };

  return (
    <div className="relative inline-flex" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggle}
        className="px-4 py-2 bg-blue-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {label}
      </button>

      {isOpen && (
        <ul className="absolute left-0 top-10 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
          {items.map((item) => (
            <li key={item.value}>
              <button
                onClick={() => handleSelect(item)}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
