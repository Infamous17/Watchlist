import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { auth, db } from "../firebase-config";
import { updateDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const API_IMG = "https://image.tmdb.org/t/p/w500";
const API_MOVIE_DETAIL = "https://api.themoviedb.org/3/movie/";
const API_TV_DETAILS = "https://api.themoviedb.org/3/tv/";

function MovieBox(props) {
  const [showModal, setShowModal] = useState(false);
  const [detail, setDetail] = useState([]);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isInCompleted, setIsInCompleted] = useState(false);
  const [isAddToWatchlist, setIsAddToWatchlist] = useState(false);
  const [isAddToCompleted, setIsAddToCompleted] = useState(false);
  const navigate = useNavigate();

  //checks if the title is already in the watchlist or in the completed list
  useEffect(() => {
    const checkListStatus = async (user) => {
      const userId = user.uid;
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        if (userData.watchlist) {
          setIsInWatchlist(
            userData.watchlist.some((movie) => movie.id === props.id)
          );
        }
        if (userData.completed) {
          setIsInCompleted(
            userData.completed.some((movie) => movie.id === props.id)
          );
        }
      }
    };
  
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        checkListStatus(user);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [props.id]);
  
  //Fetching the search movies/shows from the API and storing its details in the detail arrays
  const fetchMovieDetail = (id) => {
    fetch(
      props.type === "movie"
        ? API_MOVIE_DETAIL + id + "?api_key=" + process.env.REACT_APP_API_KEY
        : API_TV_DETAILS + id + "?api_key=" + process.env.REACT_APP_API_KEY
    )
      .then((res) => res.json())
      .then((json) => {
        setDetail(json);
      })
      .catch((err) => console.error("error:" + err));
  };

  //Function to display the detail card
  const handleShow = () => {
    fetchMovieDetail(props.id);
    setShowModal(true);
  };

  //Function to close the detail card
  const handleClose = () => setShowModal(false);

  //WATCHLIST DATABASE
  //Storing id, typeof the show/movie in the users watchlist database
  const addToWatchlist = async () => {
    setIsAddToWatchlist(true);
    const user = auth.currentUser;
    if (!user) {
      navigate("/login");
    } else {
      const userId = user.uid;
      const movieData = {
        id: props.id,
        type: props.type,
      };

      try {
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userDocData = userDocSnap.data();
          const existingWatchlist = userDocData.watchlist || [];

          const updatedWatchlist = [...existingWatchlist, movieData];

          await updateDoc(userDocRef, {
            watchlist: updatedWatchlist,
          });
        } else {
          await setDoc(userDocRef, {
            watchlist: [movieData],
          });
        }

        console.log("Added to watchlist");
      } catch (error) {
        console.error("Error adding movie to watchlist:", error);
      }
    }
  };

  //COMPLETED DATABASE
  //Storing id, typeof the show/movie in the users completed database
  const addToCompleted = async () => {
    setIsAddToCompleted(true);
    const user = auth.currentUser;
    const userId = user.uid;
    const movieData = {
      id: props.id,
      type: props.type,
    };

    try {
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userDocData = userDocSnap.data();
        const existingCompleted = userDocData.completed || [];

        const updatedCompleted = [...existingCompleted, movieData];

        await updateDoc(userDocRef, {
          completed: updatedCompleted,
        });
      } else {
        await setDoc(userDocRef, {
          completed: [movieData],
        });
      }

      props.removeFromWatchlist();
    } catch (error) {
      console.error("Error adding movie to completed:", error);
    }
  };

  //Removing the show/movie from the user watchlist
  const handleRemoveFromWatchlist = () => {
    props.removeFromWatchlist();
  };

  //Removing the show/movie from the user completed list
  const handleRemoveFromCompleted = () => {
    props.removeFromCompleted();
  };

  return (
    <div class="card card-style">
      <img
        src={API_IMG + props.img}
        class="card-img-top image-style"
        alt="Poster Not Available"
      />
      <div class="card-body">
        <button class="btn" onClick={handleShow}>
          More
        </button>
        <Modal
          show={showModal}
          onHide={handleClose}
          style={{ backgroundColor: "transparent" }}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <h3>{props.title}</h3>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div class="modal-body">
              <img
                class="image-style"
                src={API_IMG + props.img}
                alt="Poster Not Available"
              />
            </div>
            <h5>
              <i class="fa-solid fa-star" style={{ color: "#e7b418" }}></i>
              {props.rating}
            </h5>
            <h5>Release : {props.release}</h5>
            <div className="detail-style">
              <h6 className="detail">
                {props.type === "movie"
                  ? detail.runtime + "min"
                  : detail.number_of_seasons +
                    " Seasons " +
                    detail.number_of_episodes +
                    " Episodes"}
              </h6>
              <h6 className="detail">{"Status: " + detail.status}</h6>
              {detail.genres && (
                <div className="footer-btn-back-color">
                  <h6 className="detail" style={{ display: "inline" }}>
                    Genres:
                  </h6>
                  {detail.genres.map((genre) => (
                    <h6 style={{ display: "inline" }} className="detail">
                      {genre.name}{" "}
                    </h6>
                  ))}
                </div>
              )}
            </div>
            <p style={{ paddingTop: "20px" }}>{props.description}</p>
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <div className="modal-footer">
              {props.watchlist || props.completed ? (
                <div className="addWatchlist">
                  {props.completed ? (
                    <i class="fa-solid fa-check fa-lg completed">
                      <h5 style={{ color: "#bbbbbb" }}>Completed</h5>
                    </i>
                  ) : (
                    <div className="footer-btn-back-color">
                      {isAddToCompleted ? (
                        <div className="addWatchlist">
                          <i className="fa-solid fa-check fa-lg completed">
                            <h5 style={{ color: "#bbbbbb" }}>Completed</h5>
                          </i>
                        </div>
                      ) : (
                        <Button
                          variant="dark"
                          onClick={addToCompleted}
                          className="modal-btn"
                        >
                          Completed
                        </Button>
                      )}
                    </div>
                  )}
                  <p
                    onClick={
                      props.watchlist
                        ? handleRemoveFromWatchlist
                        : handleRemoveFromCompleted
                    }
                  >
                    Remove
                  </p>
                </div>
              ) : (
                <div className="footer-btn-back-color">
                  {isInWatchlist ? (
                    <div className="addWatchlist">
                      <i className="fa-solid fa-check fa-lg completed">
                        <h5 style={{ color: "#bbbbbb" }}>Added to list</h5>
                      </i>
                    </div>
                  ) : isInCompleted ? (
                    <div className="addWatchlist">
                      <i className="fa-solid fa-check fa-lg completed">
                        <h5 style={{ color: "#bbbbbb" }}>Completed</h5>
                      </i>
                    </div>
                  ) : (
                    <div className="footer-btn-back-color">
                      {isAddToWatchlist ? (
                        <div className="addWatchlist">
                          <i className="fa-solid fa-check fa-lg completed">
                            <h5 style={{ color: "#bbbbbb" }}>Added to list</h5>
                          </i>
                        </div>
                      ) : (
                        <Button
                          variant="dark"
                          onClick={addToWatchlist}
                          className="modal-btn"
                        >
                          Add to Watchlist
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default MovieBox;
