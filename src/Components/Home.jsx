import MovieBox from "./MovieBox";
import { useEffect, useState } from "react";

let pageNo = 1;
const API_URL =
  "https://api.themoviedb.org/3/discover/movie?api_key=" + process.env.REACT_APP_API_KEY + "&page=";

function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetchMovies(pageNo);
  }, []);

  const fetchMovies = (page) => {
    fetch(API_URL + page)
      .then((res) => res.json())
      .then((json) => {
        setMovies((prevMovies) => [...prevMovies, ...json.results]);
      })
      .catch((err) => console.error("error:" + err));
  };

  const handleLoadMore = () => {
    pageNo++;
    fetchMovies(pageNo);
  };

  return (
    <div className="home-container">
      <div className="grid">
        {movies.map((movie) => (
          <MovieBox
            key={movie.id}
            id={movie.id}
            type="movie"
            title={movie.title}
            img={movie.poster_path}
            description={movie.overview}
            rating={movie.vote_average}
            release={movie.release_date}
          />
        ))}
      </div>
      <div className="load-more">
        <h6 onClick={handleLoadMore}>Load More</h6>
      </div>
    </div>
  );
}

export default Home;
