interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TextInput = ({ label, value, onChange, placeholder }: TextInputProps) => {
  return (
    <div>
      <label className="block mb-2 font-semibold">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border px-2 py-1 rounded w-full"
      />
    </div>
  );
};

export default TextInput;
