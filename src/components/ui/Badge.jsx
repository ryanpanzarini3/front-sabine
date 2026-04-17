export function Badge({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}

export function Dot({ className = '' }) {
  return <span className={`w-1.5 h-1.5 rounded-full inline-block ${className}`} />;
}
