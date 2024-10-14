import { useState } from "react";
import classNames from "classnames";

type Props = {
  label: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

const TextArea = ({ label, value, placeholder, onChange }: Props) => {
  const [isFocused, setIsFocused] = useState(false);

  const textAreaClasses = classNames(
    " bg-transparent text-gray-300 border border-gray-500 rounded-lg px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-color w-full",
    {
      "border-blue-600": isFocused,
      "border-gray-500": !isFocused,
    }
  );

  return (
    <div className="flex flex-col items-start w-full">
      <label htmlFor={label} className="text-gray-300 text-sm mb-2">
        Description*
      </label>
      <textarea
        id={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={textAreaClasses}
        rows={6}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
};

export default TextArea;
