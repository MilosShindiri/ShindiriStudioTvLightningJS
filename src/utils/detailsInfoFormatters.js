export function formatMetaInfo(movie) {
  if (!movie) return "";

  const genres = movie.genres?.join(", ") || "N/A";
  const runtime = movie.runtime ? `${movie.runtime} min` : "N/A";
  const country = movie.country || "Unknown";
  const year = movie.releaseYear || "Unknown";
  const rating = movie.rating ? `IMDb: ${movie.rating}` : "Rating N/A";

  return `${genres}\n${runtime}\n${country} • ${year} • ${rating}`;
}
