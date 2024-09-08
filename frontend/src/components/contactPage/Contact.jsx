import React from 'react';
import { Container, Grid, Box, Typography } from '@mui/material';
import ContactForm from './contactForm';
import './Contact.css';
import image from '../../asset/contactImage2.jpg';
import { useState, useEffect } from 'react';
import {CircularProgress } from "@mui/material";

export const Contact = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(()=>{
      setLoading(false);
    },1000);
  }, []); 

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container className="contact-container">
      <Typography variant="h4" component="h1" className="contact-title">
        Get in touch
      </Typography>
      <Typography variant="body1" className="contact-subtitle">
        Want to get in touch? We'd love to hear from you. Here's how you can reach us...
      </Typography>
      <Box className="circle-image-container">
        <img src={image} alt="Contact Us" className="circle-image" />
      </Box>
      <Grid container spacing={4} className="contact-grid">
        <Grid item xs={12} md={4}>
          <Box className={`contact-box talk-to-team`}>
            <Typography variant="h5" gutterBottom>
              Talk to Team
            </Typography>
            <Typography variant="body1">
              Interested in our services? Reach out to our team member.
            </Typography>
            <Typography variant="h6" className="contact-number">
              (123) 456-7890
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box className={`contact-box contact-support`}>
            <Typography variant="h5" gutterBottom>
              Contact Customer Support
            </Typography>
            <Typography variant="body1">
              Need help? Our support team is here for you.
            </Typography>
            <Typography variant="h6" className="contact-email">
              info@eventer.com
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box className={`contact-box visit-us`}>
            <Typography variant="h5" gutterBottom>
              Visit Us
            </Typography>
            <Typography variant="body1">
              Visiting nearby? Stop in and see us.
            </Typography>
            <Typography variant="h6" className="contact-address">
              43, Reid Avenue, Colombo 07, <br />Sri Lanka.
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Box className="contact-form-container">
        <ContactForm />
      </Box>
    </Container>
  );
};
