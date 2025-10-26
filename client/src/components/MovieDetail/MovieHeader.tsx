export function MovieHeader({ title, releaseYear, runtime, genres }: {
  title: string;
  releaseYear: string | number;
  runtime: number;
  genres: { name: string }[];
}) {
  return (
    <>
      <h1 className="text-5xl font-bold mb-3 leading-tight">{title}</h1>
      <p className="text-gray-400 text-sm mb-6">
        {releaseYear} • {runtime} min • {genres.map(g => g.name).join(", ")}
      </p>
    </>
  );
}
