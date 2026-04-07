export default function LoadingSpinner({ size = "md", message = "Loading..." }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <div className={`${sizeClasses[size]} border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin`}></div>
      {message && <p className="text-gray-400 text-sm">{message}</p>}
    </div>
  );
}