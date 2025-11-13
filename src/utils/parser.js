export const parseMovie = (raw) => {
  const director =
    raw.credits?.crew.find((c) => c.job === "Director")?.name ?? "Unknown";
  const cast = raw.credits?.cast.slice(0, 5).map((actor) => actor.name) ?? [];

  const releaseYear =
    typeof raw.release_date === "string" && raw.release_date.includes("-")
      ? raw.release_date.split("-")[0]
      : "N/A";

  return {
    id: raw.id,
    title: raw.title ?? "Untitled",
    description: raw.overview || "No description provided.",
    thumbnail: raw.poster_path
      ? `https://image.tmdb.org/t/p/w342${raw.poster_path}`
      : "/images/placeholder-thumbnail.jpg",
    background: raw.backdrop_path
      ? `https://image.tmdb.org/t/p/original${raw.backdrop_path}`
      : "/images/placeholder-background.jpg",
    genres: raw.genres?.map((g) => g.name) ?? [],
    runtime: raw.runtime ?? null,
    releaseYear,
    country: raw.production_countries?.[0]?.iso_3166_1 ?? "N/A",
    rating: raw.vote_average ?? 0,
    director,
    cast,
    adult: raw.adult ?? false,
  };
};

export const parseTMDBResponse = (response) => {
  return {
    results: response.results.map(parseMovie),
  };
};
