type Props = {
  value: string;
  label: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = ({ value, onChange, placeholder, label, ...rest }: Props) => {
  return (
    <div className="flex flex-col items-start w-full">
      <label htmlFor={label} className="text-gray-300 text-sm mb-2">
        {label}
      </label>
      <input
        {...rest}
        id={label}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        className="w-full bg-transparent text-gray-300 border border-gray-500 rounded-lg px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-color"
      />
    </div>
  );
};

export default Input;
