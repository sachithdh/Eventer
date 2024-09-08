import React from 'react';
import './Abouts.css'; 
import teamMember1 from '../../asset/team-member1.jpg';
import teamMember2 from '../../asset/team-member2.jpg';
import teamMember3 from '../../asset/team-member3.jpg';
import teamMember4 from '../../asset/team-member4.jpg';
import { useState, useEffect } from 'react';
import { CircularProgress, Box } from "@mui/material";

export const About = () => {
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
    <div className="about-container">
      <section className="about-intro">
        <div className="intro-content ">
        <div className='about-div-img1'>
          
          </div>
          <div className="intro-text">
            <h2>Introduction</h2>
            <p>Eventer is your go-to tool for planning and managing university events. From campus activities to student gatherings, our app makes it easy to organize, track, and execute events smoothly. With Eventer, you can handle everything in one place and ensure your events are a success.</p>
          </div>
        </div>
      </section>

      <section className="about-mission">
        <div className="intro-content">
          <div className='about-div-img2'>
          </div>
          <div className="intro-text">
            <h2>Our Mission</h2>
            <p>At Eventer, we simplify event planning for universities by providing an intuitive and efficient platform. We aim to support organizers in creating exceptional events that enhance student engagement and campus life.</p>
          </div>
        </div>
      </section>

      <section className="about-team">
        <h2>Meet OurTeam</h2>
        <div className="team-members">
          <div className="team-member">
            <img src={teamMember1} alt="Team Member 1" />
            <h3>Sachith</h3>
            <p>CEO</p>
          </div>
          <div className="team-member">
            <img src={teamMember2} alt="Team Member 2" />
            <h3>Nadun</h3>
            <p>COO</p>
          </div>
          <div className="team-member">
            <img src={teamMember3} alt="Team Member 3" />
            <h3>Dinuka</h3>
            <p>Event Planner</p>
          </div>
          <div className="team-member">
            <img src={teamMember4} alt="Team Member 4" />
            <h3>Mahesh</h3>
            <p>Event Coordinator</p>
          </div>
        </div>
      </section>
    </div>
  );
};
