import MovieBox from "./MovieBox";
import { useState, useEffect } from "react";
import { auth, db } from "../firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const API_MOVIE_DETAIL = "https://api.themoviedb.org/3/movie/";
const API_TV_DETAILS = "https://api.themoviedb.org/3/tv/";

function Completed() {
  const [completed, setCompleted] = useState([]);
  const [display, setDisplay] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchCompleted(user);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchCompleted = async (user) => {
    const userId = user.uid;
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      if (userData.completed) {
        setCompleted(userData.completed);
      }
    }
    setLoading(false);
  };

  const removeFromCompleted = async (movieId) => {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const userDocRef = doc(db, "users", userId);

      try {
        await updateDoc(userDocRef, {
          completed: completed.filter((movie) => movie.id !== movieId),
        });

        setCompleted((prevCompleted) =>
          prevCompleted.filter((movie) => movie.id !== movieId)
        );
      } catch (error) {
        console.error("Error removing title from completed:", error);
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
      await Promise.all(completed.map((item) => fetchDataForItem(item)));
    };

    fetchData();
  }, [completed]);

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
                completed={true}
                removeFromCompleted={() => removeFromCompleted(movie.id)}
              />
            ))}
          </div>
        ) : (
          <div>
            <h1 style={{ textAlign: "center" }}>Your list is empty</h1>
            <br></br>
            <h4 style={{ textAlign: "center" }}>
              Completed show/movie? <br></br> Keep track of everything you have
              watched by adding it to Completed List
            </h4>
          </div>
        )}
      </div>
    </div>
  );
}

export default Completed;
