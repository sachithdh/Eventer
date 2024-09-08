import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import axios from "axios";
import '../contactPage/Contact.css'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    processed: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    let errors = {};
    if (!formData.name) errors.name = "Name is required";
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email address is invalid";
    }
    if (!formData.message) errors.message = "Message is required";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length === 0) {
      setFormErrors({});
      setFormSubmitted(false);

      try {
        const response = await axios.post(
          "http://localhost:5000/api/contact/addContact",
          formData
        );

        if (response) {
          console.log("Data saved successfully:", response.data);
          setFormSubmitted(true); 
          setFormData({ name: "", email: "", message: "" });
        } else {
          console.error("Failed to save data:", response.status);
        }
      } catch (error) {
        console.error(
          "Error saving data:",
          error.response ? error.response.data : error.message
        );
      }
    } else {
      setFormErrors(errors); 
    }
  };

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "200%",
        maxWidth: 500,
        mx: "auto",
        mt: 5,
      }}
      onSubmit={handleSubmit}
    >
      <Typography variant="h4" component="h1" gutterBottom className="contact-form">
        <h3>Or leave a short message..</h3>
      </Typography>
      {formSubmitted && (
        <Alert severity="success">
          Your message has been sent successfully!
        </Alert>
      )}
      <TextField
        label="Name (required)"
        variant="outlined"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={!!formErrors.name}
        helperText={formErrors.name}
      />
      <TextField
        label="Email (required)"
        variant="outlined"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={!!formErrors.email}
        helperText={formErrors.email}
      />
      <TextField
        label="Message"
        variant="outlined"
        name="message"
        value={formData.message}
        onChange={handleChange}
        error={!!formErrors.message}
        helperText={formErrors.message}
        multiline
        rows={4}
      />
      <Button type="send" variant="contained" color="success">
        Send
      </Button>
    </Box>
  );
};

export default ContactForm;
