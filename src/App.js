import Navbar from "./components/Navbar/Navbar";
import Main from "./components/Main/Main";
import { useEffect, useState } from "react";
import NumResults from "./components/Navbar/NumResults";
import MovieList from "./components/Main/ListBox/MovieList";
import Box from "./utils/Box";
import WatchedSummary from "./components/Main/WatchedBox/WatchedSummary";
import WatchedMovieList from "./components/Main/WatchedBox/WatchedMovieList";
import Loader from "./utils/Loader";
import ErrorMessage from "./utils/ErrorMessage";
import Search from "./utils/Search";
import MovieDetails from "./components/Main/WatchedBox/MovieDetails";

const KEY = "26a181df";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  // const [watched, setWatched] = useStatea([]);
  const [watched, setWatched] = useState(() => {
    const storedValue = localStorage.getItem("watched");
    return JSON.parse(storedValue);
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState("");

  const handleSelectMovie = (id) => {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  };

  const handleAddWatched = (movie) => {
    setWatched((watched) => [...watched, movie]);
  };

  const handleCloseMovie = () => {
    setSelectedId(null);
  };

  const handleDeleteWatched = (id) => {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  };

  useEffect(() => {
    const controller = new AbortController();

    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    setIsLoading(true);
    setError("");
    const fetchData = async () => {
      try {
        const url = `http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`;
        const response = await fetch(url, { signal: controller.signal });
        const data = await response.json();
        if (data.Response === "False") {
          throw new Error("Movie not found");
        }
        if (response.ok) {
          setMovies(data.Search);
          setError("");
          setIsLoading(false);
        } else {
          throw new Error("Someting went wrong with fetching movies");
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    return () => {
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    localStorage.setItem("watched", JSON.stringify(watched));
  }, [watched]);

  return (
    <div>
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </div>
  );
}
