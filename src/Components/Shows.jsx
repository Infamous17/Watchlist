import { useEffect, useState } from "react";
import MovieBox from "./MovieBox";

let pageNo = 1;
const API_TV =
  "https://api.themoviedb.org/3/trending/tv/week?api_key=" + process.env.REACT_APP_API_KEY + "&language=en-US&adult=true&page=";
  
function Shows() {
  const [shows, setShows] = useState([]);

  useEffect(() => {
    fetchShows(pageNo);
  }, []);

  const fetchShows = (page) => {
    fetch(API_TV + page)
      .then((res) => res.json())
      .then((json) => {
        setShows((prevShows) => [...prevShows, ...json.results]);
      })
      .catch((err) => console.error("error:" + err));
  };

  const handleLoadMore = () => {
    pageNo++;
    fetchShows(pageNo);
  };
  return <div>
    <div className="home-container">
      <div className="grid">
        {shows.map((movie) => (
          <MovieBox
            key={movie.id}
            id={movie.id}
            type={movie.media_type || "tv"}
            title={movie.name || movie.title}
            img={movie.poster_path}
            description={movie.overview}
            rating={movie.vote_average}
            release={movie.first_air_date || movie.release_date}
          />
        ))}
      </div>
      <div className="load-more">
        <h6 onClick={handleLoadMore}>Load More</h6>
      </div>
    </div>
  </div>;
}

export default Shows;
