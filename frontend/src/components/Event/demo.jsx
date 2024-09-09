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

export const EventEdite = () => {
  const [userId, setUserId] = useState("");
  const [category, setCategory] = useState(""); // For event category
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [createdEvent, setCreatedEvent] = useState({});
  const [eventData, setEventdata] = useState({});
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [loading, setLoading] = useState(true);
  const [coverImg, setCoverImg] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    venue: "",
    description: "",
    capacity: "",
  });
  const [errors, setErrors] = useState({});

  console.log(eventData);
  //fetch the user
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/event/getEvent/${eventId}`
        );

        let eventData = response.data;
        setFormData(eventData.title);
        console.log(formData.title);

        console.log("ljfoej", eventData);

        if (eventData.cover_image) {
          const base64Image = convertBinaryToBase64(
            new Uint8Array(eventData.cover_image.data),
            eventData.cover_image.contentType
          );
          eventData.cover_image = base64Image;
        }

        setEventdata(eventData);
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

  console.log(eventData);

  //get user id from local storage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;
    const jwStr = jwtDecode(token);
    const user_id = jwStr._id;
    setUserId(user_id);
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.title) newErrors.title = "Event title is required";
    if (!formData.start_date) newErrors.start_date = "Start Date is required";
    if (!formData.start_time) newErrors.start_time = "Start Time is required";
    if (!formData.end_date) newErrors.end_date = "End Date is required";
    if (!formData.end_time) newErrors.end_time = "End Time is required";
    if (!formData.venue) newErrors.venue = "Venue is required";
    if (!formData.capacity) newErrors.capacity = "Capacity is required";
    if (!category) newErrors.category = "Event category is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    if (coverImg) {
      formDataToSend.append("cover_image", coverImg, coverImg.name);
    } else {
      setAlertMessage("No image selected. Please choose an image to upload.");
      setSnackbarOpen(true);
      return;
    }
    formDataToSend.append("created_by", userId);
    const created_at = new Date().toISOString();
    formDataToSend.append("created_at", created_at);
    formDataToSend.append("category", category);
    const user = JSON.parse(localStorage("user"));
    if (user && user.token) {
      try {
        const result = await axios.put(
          `http://localhost:5000/api/event/edit/${eventId}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setCreatedEvent(result.data);
        updateUser(result.data);
        setAlertMessage("Event created successfully!");
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate("/event");
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
              <Grid item xs={12} md={6}>
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
                    value={eventData.title}
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
                    value={eventData.start_date}
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
                    value={eventData.start_time}
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
                    value={eventData.end_date}
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
                    value={eventData.end_time}
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
                    value={eventData.venue}
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
                    value={eventData.description}
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
                    value={eventData.capacity}
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
                      value={eventData.category}
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

              {/* Image Upload */}
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    position: "relative",
                    mb: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    mt: { xs: 4, md: 0 },
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "300px",
                      backgroundColor: "#e0e0e0",
                      borderRadius: 4,
                      overflow: "hidden",
                      boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                      position: "relative",
                      "&:hover": {
                        boxShadow: "0px 6px 15px rgba(0,0,0,0.2)",
                      },
                    }}
                  >
                    <img
                      src={coverImg ? URL.createObjectURL(coverImg) : addImg}
                      alt="Event cover"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <label htmlFor="icon-button-file">
                      <Input
                        accept="image/*"
                        id="icon-button-file"
                        type="file"
                        onChange={handleImageChange}
                      />
                      <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="span"
                        sx={{
                          position: "absolute",
                          bottom: 16,
                          right: 16,
                          backgroundColor: "white",
                          borderRadius: "50%",
                          boxShadow: 2,
                          "&:hover": {
                            backgroundColor: "#f5f5f5",
                          },
                        }}
                      >
                        <AddPhotoAlternate />
                      </IconButton>
                    </label>
                  </Box>
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
