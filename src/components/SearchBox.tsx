interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function SearchBox({ value, onChange }: Props) {
  return (
    <div className="relative mb-6">
      <input
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search grammar points… (e.g. て-form, は, potential)"
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
        autoComplete="off"
      />
    </div>
  );
}
