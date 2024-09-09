import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  CalendarToday,
  AccessTime,
  Room,
  People,
  Description,
  AddPhotoAlternate,
} from "@mui/icons-material";

import addImg from "../../asset/addImage.jpg";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correct import
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const Input = styled("input")({
  display: "none",
});

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
export const EventEdit = () => {
  const [userId, setUserId] = useState("");
  const [category, setCategory] = useState(""); // For event category
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  //get user id from local storage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;
    const jwStr = jwtDecode(token);
    const user_id = jwStr._id;
    setUserId(user_id);
  }, []);

  const [coverImg, setCoverImg] = useState(null);
  const [errors, setErrors] = useState({});

  //fetch the user
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/event/getEvent/${eventId}`
        );

        let eventData = response.data;
        if (eventData.cover_image) {
          const base64Image = convertBinaryToBase64(
            new Uint8Array(eventData.cover_image.data),
            eventData.cover_image.contentType
          );
          eventData.cover_image = base64Image;
        }
        setFormData({
          title: eventData.title || "",
          start_time: eventData.start_time || "",
          start_date: eventData.start_date || "",
          end_time: eventData.end_time || "",
          end_date: eventData.end_date || "",
          venue: eventData.venue || "",
          description: eventData.description || "",
          capacity: eventData.capacity || "",
          category: eventData.category || "",
        });
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

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImg(file);
    }
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Handle Submit: ", formData);

    console.log("Ent:", eventId);
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      try {
        const result = await axios.put(
          `http://localhost:5000/api/event/edit/${eventId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setAlertMessage("Event created successfully!");
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate(`/event/${eventId}`);
        }, 3000);
      } catch (error) {
        console.log("Error uploading event:", error);
      }
    } else {
      console.log("User not logged in or invalid access token");
    }
  };

  // Handle snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false); // Close the snackbar
  };

  return (
    <>
      <Box
        sx={{ height: "100vh", maxWidth: 1000, margin: "auto", p: 3, mt: 8 }}
      >
        <Typography
          variant="h3"
          textAlign="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#333" }}
        >
          Edit Event
        </Typography>
        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            p: 4,
            backgroundColor: "#f9f9f9",
            boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <CardContent>
            <Grid container spacing={4}>
              <Grid item xs={12} md={12}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <TextField
                    variant="filled"
                    label="Event Title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    error={!!errors.title}
                    helperText={errors.title}
                    InputProps={{
                      style: { fontSize: "18px", fontWeight: "bold" },
                    }}
                    sx={{ backgroundColor: "#fff", borderRadius: 2 }}
                  />
                  <TextField
                    variant="filled"
                    fullWidth
                    label="Start Date"
                    name="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday />
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.start_date}
                    helperText={errors.start_date}
                    sx={{ backgroundColor: "#fff", borderRadius: 2 }}
                  />
                  <TextField
                    variant="filled"
                    fullWidth
                    label="Start Time"
                    name="start_time"
                    type="time"
                    value={formData.start_time}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccessTime />
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.start_time}
                    helperText={errors.start_time}
                    sx={{ backgroundColor: "#fff", borderRadius: 2 }}
                  />
                  <TextField
                    variant="filled"
                    fullWidth
                    label="End Date"
                    name="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday />
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.end_date}
                    helperText={errors.end_date}
                    sx={{ backgroundColor: "#fff", borderRadius: 2 }}
                  />
                  <TextField
                    variant="filled"
                    fullWidth
                    label="End Time"
                    name="end_time"
                    type="time"
                    value={formData.end_time}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccessTime />
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.end_time}
                    helperText={errors.end_time}
                    sx={{ backgroundColor: "#fff", borderRadius: 2 }}
                  />
                  <TextField
                    variant="filled"
                    fullWidth
                    label="Venue"
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Room />
                        </InputAdornment>
                      ),
                    }}
                    error={!!errors.venue}
                    helperText={errors.venue}
                    sx={{ backgroundColor: "#fff", borderRadius: 2 }}
                  />
                  <TextField
                    variant="filled"
                    fullWidth
                    label="Description (*Max 200 characters)"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                    inputProps={{
                      maxLength: 200,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Description />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ backgroundColor: "#fff", borderRadius: 2 }}
                  />
                  <TextField
                    variant="filled"
                    fullWidth
                    label="Capacity"
                    name="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <People />
                        </InputAdornment>
                      ),
                    }}
                    error={!!errors.capacity}
                    helperText={errors.capacity}
                    sx={{ backgroundColor: "#fff", borderRadius: 2 }}
                  />

                  {/* Category Dropdown */}
                  <FormControl variant="filled" fullWidth required>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                      labelId="category-label"
                      id="category"
                      value={"communities"}
                      onChange={handleCategoryChange}
                      error={!!errors.category}
                      sx={{
                        backgroundColor: "#fff",
                        borderRadius: 2,
                      }}
                    >
                      <MenuItem value={"sports"}>Sports</MenuItem>
                      <MenuItem value={"parties"}>Parties</MenuItem>
                      <MenuItem value={"communities"}>Communities</MenuItem>
                      <MenuItem value={"theaters"}>Theaters</MenuItem>
                      <MenuItem value={"concerts"}>Concerts</MenuItem>
                      <MenuItem value={"event"}>Event</MenuItem>
                    </Select>
                  </FormControl>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={{
                      height: "50px",
                      fontSize: "18px",
                      fontWeight: "bold",
                      textTransform: "none",
                      borderRadius: "12px",
                      transition: "background-color 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#0056b3",
                      },
                    }}
                  >
                    Edite Event
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
      {/* Alert for Successfull review */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={
            alertMessage ===
            "No image selected. Please choose an image to upload."
              ? "error"
              : "success"
          }
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
