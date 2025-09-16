export default function Button({ children, className="", loading=false, ...props }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2 border border-gray-200 bg-black text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition ${className}`}
    >
      {loading && <span className="mr-2 inline-block h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full" aria-hidden="true" />}
      <span>{children}</span>
    </button>
  );
}
