export default function Input({ label, error, className="", ...props }) {
  return (
    <label className="block">
      <span className="block text-sm text-gray-700">{label}</span>
      <input
        {...props}
        className={`mt-1 w-full rounded-xl border p-2 outline-none focus:ring-2 focus:ring-black/60 ${error ? "border-red-500" : "border-gray-300"} ${className}`}
      />
      {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
    </label>
  );
}
