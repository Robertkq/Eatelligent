import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-container">
      <h1 className="about-header">About Us</h1>
      <p className="about-text">
        Welcome to Eatelligent, your go-to platform for personalized diet plans and nutritional guidance. Our mission is to help you achieve your health and fitness goals through tailored diet plans that suit your lifestyle and preferences.
      </p>
      <h2 className="about-subheader">Our Mission</h2>
      <p className="about-text">
        At Eatelligent, we believe that a healthy diet is the foundation of a healthy life. Our goal is to provide you with the tools and resources you need to make informed dietary choices and maintain a balanced diet.
      </p>
      <h2 className="about-subheader">Features</h2>
      <ul className="about-list">
        <li>Personalized diet plans based on your preferences and goals</li>
        <li>Easy-to-use interface for tracking your diet and progress</li>
        <li>Comprehensive nutritional information for each meal</li>
        <li>Support for various dietary preferences and restrictions</li>
      </ul>
      <h2 className="about-subheader">Contact Us</h2>
      <p className="about-text">
        If you have any questions or need support, feel free to reach out to us at:
      </p>
      <ul className="about-list">
        <li>Email: <a href="mailto:robert.vuia10@e-uvt.ro">robert.vuia10@e-uvt.ro</a></li>
        <li>Email: <a href="mailto:darius.trica03@e-uvt.ro">darius.trica03@e-uvt.ro</a></li>
      </ul>
    </div>
  );
}

export default About;