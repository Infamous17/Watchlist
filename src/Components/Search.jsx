import { useLocation } from "react-router-dom";
import MovieBox from "./MovieBox";

function Search() {
  const location = useLocation();
  const { output } = location.state;

  return (
    <div>
      <div className="home-container">
        {output.length > 0 ? (
          <div className="grid">
            {output.map((movie) => {
              if (movie.media_type !== "person") {
                return (
                  <MovieBox
                    key={movie.id}
                    id={movie.id}
                    type={movie.media_type}
                    title={movie.name || movie.title}
                    img={movie.poster_path}
                    description={movie.overview}
                    rating={movie.vote_average}
                    release={movie.first_air_date || movie.release_date}
                  />
                );
              }
              return null;
            })}
          </div>
        ) : (
          <div>
            <h1 style={{ textAlign: "center" }}>Oops. We haven't got that.</h1>
            <br></br>
            <h4 style={{ textAlign: "center" }}>
              Try searching for another movies or shows.
            </h4>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
