import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  Container,
  Typography,
  Box,
  colors,
  Grid,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardMedia,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";

import { Reviews } from "../Reviews";
import { EventParticipant } from "./EventParticipant";
import FormDialogDelete from "./EventDeleteDialog";
import { EventEdit } from "./EventEdit";
import { useNavigate } from "react-router-dom";
// Convert binary data to base64
const convertBinaryToBase64 = (binaryData, contentType) => {
  if (binaryData && binaryData instanceof Uint8Array) {
    const binaryString = Array.from(binaryData)
      .map((byte) => String.fromCharCode(byte))
      .join("");
    return `data:${contentType};base64,${btoa(binaryString)}`;
  } else {
    console.error("Invalid binary data provided:", binaryData);
    return null;
  }
};

export default function EventData() {
  const { eventId } = useParams(); //get the event ID from the route params
  const [event, setEvent] = useState(null);
  const [eventCreatedId, setEventCreatedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState("");
  const [userRole, setUserRole] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [register, setRegister] = useState([]);
  // const [isFav, setIsFev] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Alert visibility state
  const [alert, setAlert] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const location = useLocation();
  const category = location.state?.category;
  console.log(category);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false); // Close the snackbar
  };
  // console.log(userId);
  // console.log(eventCreatedId);

  useEffect(() => {
    if (event && event.created_by) {
      console.log(event.created_by);
      setEventCreatedId(event.created_by);
    }
  }, [event]);

  //get user data from local storage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      const token = jwtDecode(user.token);
      setUserId(token._id);
      setUserRole(token.role);
      axios
        .get(`http://localhost:5000/api/user/${token._id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          setFavorites(res.data.favourite_events || []);
          setRegister(res.data.registered_events || []);
        })
        .catch((err) => {
          console.error("Failed to fetch user data", err);
        });
    } else {
      console.log("User not logged in or invalid access token");
    }
  }, []);

  // Handle favorite events
  const handleFav = async (event_id) => {
    const isFav = favorites.includes(event_id);
    const updatedFavorites = isFav
      ? favorites.filter((id) => id !== event_id)
      : [...favorites, event_id];

    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      await axios
        .put(
          `http://localhost:5000/api/user/edit/${userId}`,
          {
            favourite_events: updatedFavorites,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )
        .then(() => {
          setFavorites(updatedFavorites);
          isFav
            ? setMessage("Event removed from your favorites")
            : setMessage("Event added to favorites");
          isFav ? setAlert("info") : setAlert("success");
          console.log(isFav ? "Removed from favorites" : "Added to favorites");
          setSnackbarOpen(true);
        })
        .catch((err) => {
          setAlert("error");
          setMessage("Failed to add event to favorites");
          setSnackbarOpen(true);
          console.error(err);
        });
    } else {
      console.log("User not logged in or invalid access token");
    }
  };

  //Hadle evet registere
  const handleRegister = async (event_id) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      try {
        // Fetch the latest participants for the event
        const eventResponse = await axios.get(
          `http://localhost:5000/api/event/getEvent/${event_id}`
        );
        const currentParticipants = eventResponse.data.participants;

        const isReg = register.includes(event_id);
        const updatedRegister = isReg
          ? register.filter((id) => id !== event_id)
          : [...register, event_id];

        const updatedParticipants = isReg
          ? currentParticipants.filter((id) => id !== userId)
          : [...currentParticipants, userId];

        // First, update the user's registered events
        await axios.put(
          `http://localhost:5000/api/user/edit/${userId}`,
          {
            registered_events: updatedRegister,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        // Then, update the event's participants
        await axios.put(
          `http://localhost:5000/api/event/edit/${event_id}`,
          {
            participants: updatedParticipants,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        // Update the local state after both requests succeed
        setRegister(updatedRegister);
        isReg
          ? setMessage("Unegistered for event successfully")
          : setMessage("Registered for event successfully");
        isReg ? setAlert("info") : setAlert("success");
        setSnackbarOpen(true);
        console.log(isReg ? "Removed from Register" : "Added to Register");
      } catch (err) {
        setAlert("error");
        setMessage("Failed to register for event");
        setSnackbarOpen(true);
        console.error("Error while registering/unregistering", err);
      }
    } else {
      console.log("User not logged in or invalid access token");
    }
  };

  // Fetch the event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/event/getEvent/${eventId}`
        );

        let eventData = response.data;
        console.log(eventData);

        // Process the event data
        if (eventData.cover_image) {
          const base64Image = convertBinaryToBase64(
            new Uint8Array(eventData.cover_image.data),
            eventData.cover_image.contentType
          );
          eventData.cover_image = base64Image;
        }

        setEvent(eventData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch the event:", error);
        setError("Failed to fetch the event");
        setLoading(false);
      } finally {
        const timer = setTimeout(() => {
          setLoading(false);
        }, 1200);
      }
    };

    fetchEvent();
  }, [eventId]);

  let styleListItem = {
    backgroundColor: "#ede7f6",
    borderRadius: "50px",
    padding: "8px",
    margin: "8px",
  };

  let styleListItemText = {
    ml: 1,
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        {/* <CircularProgress /> */}
      </Box>
    );
  }

  if (error) {
    return <>{error}</>;
  }

  return (
    <>
      <h1>{category}</h1>
      <Container
        maxWidth="xl"
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* upper */}
        <Container>
          {/* event Banner */}
          <Box
            sx={{
              backgroundImage: `url(${event.cover_image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundColor: "#3f51b5",
              height: "400px",
              display: "flex",
              alignItems: "center",
              jestifyContent: "center",
              position: "relative",
            }}
          >
            <IconButton
              variant="variant"
              sx={{
                color: favorites.includes(event._id) ? "#FF5733" : "#AAB7B8", // Custom colors
                position: "absolute",
                bottom: 10,
                right: 40,
              }}
              onClick={() => handleFav(event._id)}
            >
              {favorites.includes(event._id) ? (
                <FavoriteIcon sx={{ fontSize: 60 }} />
              ) : (
                <FavoriteBorderIcon sx={{ fontSize: 60 }} />
              )}
            </IconButton>
          </Box>
          <Box sx={{ width: "50%" }}>
            <Typography variant="h2" component="h1" sx={{ flexGrow: 6 }}>
              {event.title}
            </Typography>
          </Box>
        </Container>
        {/* down  */}
        <Container
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            // bgcolor: 'red',
            // position: 'relative',
            // gap:'34px'
          }}
        >
          <Box sx={{ width: "35%", mt: 4 }}>
            <List>
              <ListItem sx={styleListItem}>
                <ListItemIcon>
                  <EventIcon />
                </ListItemIcon>
                <ListItemText sx={styleListItemText}>
                  {" "}
                  Start Date: {event.start_date}{" "}
                </ListItemText>
              </ListItem>
              <ListItem sx={styleListItem}>
                <ListItemIcon>
                  <AccessTimeIcon />
                </ListItemIcon>
                <ListItemText sx={styleListItemText}>
                  {" "}
                  Start Time: {event.start_time}{" "}
                </ListItemText>
              </ListItem>
              <ListItem sx={styleListItem}>
                <ListItemIcon>
                  <EventIcon />
                </ListItemIcon>
                <ListItemText sx={styleListItemText}>
                  {" "}
                  End Date: {event.end_date}{" "}
                </ListItemText>
              </ListItem>
              <ListItem sx={styleListItem}>
                <ListItemIcon>
                  <AccessTimeIcon />
                </ListItemIcon>
                <ListItemText sx={styleListItemText}>
                  {" "}
                  End Time: {event.end_time}{" "}
                </ListItemText>
              </ListItem>
              <ListItem sx={styleListItem}>
                <ListItemIcon>
                  <LocationOnIcon />
                </ListItemIcon>
                <ListItemText sx={styleListItemText}>
                  {" "}
                  {event.venue}{" "}
                </ListItemText>
              </ListItem>
              <ListItem sx={styleListItem}>
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText sx={styleListItemText}>
                  {" "}
                  Capacity : {event.capacity}{" "}
                </ListItemText>
              </ListItem>
            </List>
          </Box>
          {/* right */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              // justifyContent: "center",
              mt: 3,
              gap: 2,
            }}
          >
            <Box sx={{ width: "500px" }}>
              <Typography variant="h4" sx={{ mx: 2 }}>
                <b>*Description of the Event</b>
              </Typography>
              <Typography variant="body1" sx={{ mx: 2, mt: 1 }}>
                {" "}
                {event.description}
              </Typography>
            </Box>
            <Button
              sx={{
                px: 5,
                py: 2,
                width: "500px",
                height: 55,
                borderRadius: 10,
              }}
              variant="contained"
              color="primary"
              onClick={() => handleRegister(event._id)}
            >
              {register.includes(event._id) ? "Unregister" : "Register"}
            </Button>

            {userId === eventCreatedId ? <FormDialogDelete /> : null}
            {userId === eventCreatedId ? (
              <Button
                sx={{bgcolor: '#ede7f6', borderRadius:10}}
                onClick={() => {
                  navigate(`/edit-event/${eventId}`);
                }}
              >
                Edit
              </Button>
            ) : null}
            {/* <FormDialogDelete/> */}
          </Box>
        </Container>
      </Container>
      <EventParticipant />
      <Reviews />

      {/* alert  */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={alert}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}
