export default function Button({
  children,
  className = "",
  loading = false,
  type = "submit",               // 👈 default is submit again
  ...props
}) {
  const isDisabled = loading || props.disabled;

  return (
    <button
      type={type}
      {...props}
      disabled={isDisabled}
      aria-disabled={isDisabled || undefined}
      aria-busy={loading || undefined}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2
        border border-gray-200 bg-black text-white
        hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition
        focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2
        ${className}`}
    >
      {loading && (
        <>
          <span
            className="mr-2 inline-block h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full"
            aria-hidden="true"
          />
          <span className="sr-only">Loading</span>
        </>
      )}
      <span>{children}</span>
    </button>
  );
}


