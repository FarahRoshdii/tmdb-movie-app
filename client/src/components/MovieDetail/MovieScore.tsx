export function MovieScore({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="relative w-16 h-16">
        <svg className="absolute inset-0" viewBox="0 0 36 36">
          <path
            className="text-gray-700"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            opacity="0.2"
            d="M18 2a16 16 0 1 1 0 32a16 16 0 1 1 0-32"
          />
          <path
            className="text-blue-500"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeDasharray={`${(score / 10) * 100}, 100`}
            strokeLinecap="round"
            d="M18 2a16 16 0 1 1 0 32a16 16 0 1 1 0-32"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
          {score.toFixed(1)}
        </span>
      </div>
      <span className="text-gray-400 text-sm tracking-wider">User Score</span>
    </div>
  );
}
