interface TextareaInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TextareaInput = ({
  label,
  value,
  onChange,
  placeholder,
}: TextareaInputProps) => {
  return (
    <div>
      <label className="block mb-2 font-semibold">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border px-2 py-1 rounded w-full"
      />
    </div>
  );
};

export default TextareaInput;
