import {
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Box,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import Rating from "@mui/material/Rating";
import { jwtDecode } from "jwt-decode";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export const Reviews = () => {
  const [eventId, setEventId] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [reviews, setReviews] = useState([]);
  const [value, setValue] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [userId, setUserId] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Alert visibility state
  const [alert, setAlert] = useState("");
  const [editReviewId, setEditReviewId] = useState(null); // To track which review is being edited
  const [editReviewText, setEditReviewText] = useState(""); // For review editing
  const [editReviewRating, setEditReviewRating] = useState(0); // For rating editing

  // Get event ID from url and user ID from local storage
  useEffect(() => {
    const url = window.location.href;

    const parts = url.split("/");
    const Eventurl = parts[parts.length - 1];
    setEventId(Eventurl);

    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const jwtToken = jwtDecode(user.token);
      setUserId(jwtToken._id);
    }
    if (user && user.token) {
      axios
        .get(`http://localhost:5000/api/review/getReview/${eventId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          setReviews(res.data);
        });
    } else {
      console.log("User not logged in or invalid access token");
    }
  }, [eventId]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = jwtDecode(user.token);
    const user_id = token._id;

    if (user && user.token) {
      axios
        .get(`http://localhost:5000/api/user/${user_id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          setUserName(`${res.data.first_name} ${res.data.last_name}`);
          console.log("DATA:", res.data.first_name);
        })
        .catch((err) => {
          console.log("Error fetching user name:", err);
        });
    } else {
      console.log("User not logged in or invalid access token");
    }
  }, [userId]);

  // Get reviews from DB
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      axios
        .get(`http://localhost:5000/api/review/getReview/${eventId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          setReviews(res.data);
        });
    } else {
      console.log("User not logged in or invalid access token");
    }
  }, []);

  // Get userName and eventTitle
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token && eventId) {
      axios
        .get(`http://localhost:5000/api/event/getEvent/${eventId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          setEventTitle(res.data.title);
        })
        .catch((err) => {
          console.log("Error fetching event title:", err);
        });
    } else {
      console.log("User not logged in or invalid access token");
    }
  }, [eventId]);

  const handleReview = (event) => {
    setUserReview(event.target.value);
  };

  // Handler for add new review
  const handleClick = async () => {
    const rev = {
      user_id: userId,
      event_id: eventId,
      review: userReview,
      rating: value,
      user_name: userName,
      event_title: eventTitle,
    };
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      try {
        const respons = await axios.post(
          "http://localhost:5000/api/review/addReview",
          rev,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setReviews([respons.data.data, ...reviews]);
        setUserReview("");
        setValue(0);
        setAlert("post");
        setSnackbarOpen(true); // Show alert when review is added successfully
      } catch (err) {
        console.log("Error adding review:", err);
      }
    } else {
      console.log("User not logged in or invalid access token");
    }
  };

  const handleMenuClick = (event, review) => {
    setAnchorEl(event.currentTarget);
    setSelectedReview(review);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReview(null);
  };

  const handleEditClick = (review) => {
    setEditReviewId(review._id);
    setEditReviewText(review.review);
    setEditReviewRating(review.rating);
    handleMenuClose();
  };

  // Handle editing review
  const handleSaveEdit = async (reviewId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      try {
        await axios.put(
          `http://localhost:5000/api/review/updateReview/${reviewId}`,
          {
            review: editReviewText,
            rating: editReviewRating,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        // Update the review in the local state
        setReviews(
          reviews.map((review) =>
            review._id === reviewId
              ? { ...review, review: editReviewText, rating: editReviewRating }
              : review
          )
        );
        setEditReviewId(null); // Exit edit mode
        setAlert("edit");
        setSnackbarOpen(true);
      } catch (err) {
        console.log("Error updating review:", err);
      }
    } else {
      console.log("User not logged in or invalid access token");
    }
  };

  const handleDeleteClick = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      try {
        await axios.delete(
          `http://localhost:5000/api/review/deleteReview/${selectedReview._id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setReviews(reviews.filter((r) => r._id !== selectedReview._id));
        setAlert("delete");
        setSnackbarOpen(true);
      } catch (err) {
        console.log("Error deleting review:", err);
      }
    } else {
      console.log("User not logged in or invalid access token");
    }
    handleMenuClose();
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false); // Close the snackbar
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: 60,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "75%",
          minHeight: 550,
          padding: 4,
          backgroundColor: "#f9f9f9",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              marginBottom: 2,
              fontWeight: "bold",
            }}
          >
            Add Your Review
          </Typography>

          <Rating
            name="review"
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <TextField
            label="Your Review"
            variant="outlined"
            margin="normal"
            sx={{
              width: 450,
              height: 60,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "& fieldset": {
                  borderColor: "#ccc",
                },
                "&:hover fieldset": {
                  borderColor: "#888",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#1976d2",
                },
              },
              "& .MuiInputBase-input": {
                fontSize: "16px",
                padding: "12px",
                lineHeight: "1.5",
              },
            }}
            InputLabelProps={{
              sx: {
                fontSize: "14px",
                color: "#666",
                "&.Mui-focused": {
                  color: "#1976d2",
                },
              },
            }}
            inputProps={{
              maxLength: 80,
            }}
            value={userReview}
            onChange={handleReview}
          />
          <Button
            variant="contained"
            sx={{
              height: 50,
              marginLeft: 2,
              padding: "0 20px",
              backgroundColor: "#1976d2",
            }}
            onClick={handleClick}
          >
            Post
          </Button>
        </div>

        <Grid
          container
          spacing={3}
          sx={{
            position: "relative",
          }}
        >
          {reviews
            ? reviews.map((review) => (
                <Grid item xs={9} sm={6} md={4} key={review._id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
                      borderRadius: "10px",
                    }}
                  >
                    <CardContent>
                      {editReviewId === review._id || userRole === "admin" ? (
                        <>
                          {/* Editable Fields for review in the card */}
                          <TextField
                            value={editReviewText}
                            onChange={(e) => setEditReviewText(e.target.value)}
                            variant="standard"
                            margin="normal"
                            fullWidth
                          />
                          <Rating
                            name="edit-rating"
                            value={editReviewRating}
                            onChange={(event, newValue) => {
                              setEditReviewRating(newValue);
                            }}
                          />
                          <Button
                            variant="text"
                            onClick={() => handleSaveEdit(review._id)}
                            sx={{ mt: 2 }}
                          >
                            Save
                          </Button>
                          <Button
                            onClick={() => setEditReviewId(null)}
                            sx={{ mt: 2 }}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          {/* Display the Review normally */}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Rating
                              name="read-only"
                              value={review.rating}
                              readOnly
                            />
                            {userId === review.user_id && (
                              <>
                                <IconButton
                                  aria-label="more"
                                  onClick={(event) =>
                                    handleMenuClick(event, review)
                                  }
                                >
                                  <MoreVertIcon />
                                </IconButton>
                                <Menu
                                  anchorEl={anchorEl}
                                  open={Boolean(anchorEl)}
                                  onClose={handleMenuClose}
                                >
                                  <MenuItem
                                    onClick={() => handleEditClick(review)}
                                  >
                                    Edit
                                  </MenuItem>
                                  <MenuItem onClick={handleDeleteClick}>
                                    Delete
                                  </MenuItem>
                                </Menu>
                              </>
                            )}
                          </div>
                          <Typography variant="h6" component="div" gutterBottom>
                            {review.review}
                          </Typography>
                          <Typography
                            variant="caption"
                            display="block"
                            gutterBottom
                          >
                            {`${review.user_name}`}
                          </Typography>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))
            : null}
        </Grid>
      </Paper>

      {/* Alert for Successfull review */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {alert === "post"
            ? "Review added successfully!"
            : alert === "edit"
            ? "Review updated successfully!"
            : "Review deleted successfully!"}
        </Alert>
      </Snackbar>
    </div>
  );
};
