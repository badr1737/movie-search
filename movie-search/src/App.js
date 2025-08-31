import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [query, setQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedMovie, setSelectedMovie] = useState(null);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.trim()) searchMovies();
        }, 600); // تأخير البحث عند الكتابة لمنع استدعاءات كثيرة

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const searchMovies = async () => {
        setLoading(true);
        setError("");
        setMovies([]);

        try {
            const { data } = await axios.get(`https://www.omdbapi.com/?s=${query}&apikey=51a2f4dc`);
            data.Response === "True" ? setMovies(data.Search) : setError("No movies found.");
        } catch {
            setError("Error fetching movies. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getMovieDetails = async (imdbID) => {
        if (selectedMovie?.imdbID === imdbID) return;

        setLoading(true);
        try {
            const { data } = await axios.get(`https://www.omdbapi.com/?i=${imdbID}&apikey=51a2f4dc`);
            setSelectedMovie(data);
        } catch {
            setError("Error fetching movie details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app">
            <h1>🎬 Movie Explorer</h1>

            <div className="search-box">
                <input
                    type="text"
                    placeholder="Search for a movie..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {loading && <div className="loader"></div>}
            {error && <p className="error">{error}</p>}

            <div className="movies-container">
                {movies.map((movie) => (
                    <div key={movie.imdbID} className="movie-card" onClick={() => getMovieDetails(movie.imdbID)}>
                        <img src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300"} alt={movie.Title} />
                        <h3>{movie.Title}</h3>
                    </div>
                ))}
            </div>

            {selectedMovie && (
                <div className="modal" onClick={() => setSelectedMovie(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close-btn" onClick={() => setSelectedMovie(null)}>&times;</span>
                        <h2>{selectedMovie.Title}</h2>
                        <img src={selectedMovie.Poster !== "N/A" ? selectedMovie.Poster : "https://via.placeholder.com/300"} alt={selectedMovie.Title} />
                        <p><strong>Year:</strong> {selectedMovie.Year}</p>
                        <p><strong>Genre:</strong> {selectedMovie.Genre}</p>
                        <p><strong>IMDB Rating:</strong> {selectedMovie.imdbRating}</p>
                        <p><strong>Plot:</strong> {selectedMovie.Plot}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
