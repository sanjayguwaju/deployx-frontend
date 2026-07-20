

export default function Loader({ className = "flex justify-center p-12" }: { className?: string }) {
  return (
    <div className={className}>
      <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
