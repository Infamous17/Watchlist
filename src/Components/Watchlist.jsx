import MovieBox from "./MovieBox";
import { useState, useEffect } from "react";
import { auth, db } from "../firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const API_MOVIE_DETAIL = "https://api.themoviedb.org/3/movie/";
const API_TV_DETAILS = "https://api.themoviedb.org/3/tv/";

function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [display, setDisplay] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchWatchlist(user);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchWatchlist = async (user) => {
    const userId = user.uid;
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      if (userData.watchlist) {
        setWatchlist(userData.watchlist);
      }
    }
    setLoading(false);
  };

  const removeFromWatchlist = async (movieId) => {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const userDocRef = doc(db, "users", userId);

      try {
        await updateDoc(userDocRef, {
          watchlist: watchlist.filter((movie) => movie.id !== movieId),
        });

        setWatchlist((prevWatchlist) =>
          prevWatchlist.filter((movie) => movie.id !== movieId)
        );
      } catch (error) {
        console.error("Error removing movie from watchlist:", error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const fetchDataForItem = async (item) => {
        try {
          fetch(
            item.type === "movie"
              ? API_MOVIE_DETAIL +
                  item.id +
                  "?api_key=" + process.env.REACT_APP_API_KEY
              : API_TV_DETAILS +
                  item.id +
                  "?api_key=" + process.env.REACT_APP_API_KEY
          )
            .then((res) => res.json())
            .then((json) => {
              setDisplay((prevDisplay) => [
                ...prevDisplay,
                { ...json, type: item.type },
              ]);
            })
            .catch((err) => console.error("error:" + err));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      setDisplay([]);
      await Promise.all(watchlist.map((item) => fetchDataForItem(item)));
    };

    fetchData();
  }, [watchlist]);

  return (
    <div>
      <div className="home-container">
        {loading ? (
          <p style={{ textAlign: "center" }}>Loading...</p>
        ) : display.length > 0 ? (
          <div className="grid">
            {display.map((movie) => (
              <MovieBox
                key={movie.id}
                id={movie.id}
                type={movie.type}
                title={movie.name || movie.title}
                img={movie.poster_path}
                description={movie.overview}
                rating={movie.vote_average}
                release={movie.first_air_date || movie.release_date}
                watchlist={true}
                removeFromWatchlist={() => removeFromWatchlist(movie.id)}
              />
            ))}
          </div>
        ) : (
          <div>
            <h1 style={{ textAlign: "center" }}>Your watchlist is empty</h1>
            <br></br>
            <h4 style={{ textAlign: "center" }}>
              See somthing you like? <br></br> Keep track of eveything you want
              to watch by adding it to WatchList
            </h4>
          </div>
        )}
      </div>
    </div>
  );
}

export default Watchlist;
