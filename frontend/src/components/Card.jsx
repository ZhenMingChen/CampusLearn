export function Card({ children, className="" }) {
  return <div className={`rounded-2xl border bg-white p-4 shadow-sm ${className}`}>{children}</div>;
}
export function CardTitle({ children, className="" }) {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
}
export function Empty({ title="Nothing here yet", hint="" }) {
  return (
    <div className="text-center text-gray-600 py-10">
      <div className="mx-auto mb-3 h-10 w-10 rounded-full border-2 border-dashed" />
      <p className="font-medium">{title}</p>
      {hint && <p className="text-sm text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}
