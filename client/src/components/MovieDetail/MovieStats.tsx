export function MovieStats({ status, budget, revenue }: {
  status: string;
  budget: number;
  revenue: number;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm text-gray-400">
      <div>
        <span className="block font-semibold text-gray-200">Status</span>
        {status}
      </div>
      <div>
        <span className="block font-semibold text-gray-200">Budget</span>${budget?.toLocaleString()}
      </div>
      <div>
        <span className="block font-semibold text-gray-200">Revenue</span>${revenue?.toLocaleString()}
      </div>
    </div>
  );
}
