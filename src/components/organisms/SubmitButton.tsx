import React from "react";

interface SubmitButtonProps {
  onSubmit: (event: React.FormEvent) => void;
  text: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ onSubmit, text }) => {
  return (
    <button
      type="submit"
      onClick={onSubmit}
      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
    >
      {text}
    </button>
  );
};

export default SubmitButton;
