import React from 'react';
import '../styles/about.css'; // Assuming you have a CSS file for styling

function About() {
  return (
    <div>
      <main className="main-content-about">
        <div className="about-container">
          <h1>About Me</h1>
          <div className="about-content">
            <div className="about-image">
              <img src= {require("../assets/images/portrait.jpg")} alt="Ivory Le" />
            </div>
            <div className="about-text">
            <p>
              Hi! My name is Ivory. You’ve probably already read my resume or found me through LinkedIn. Either way, this platform was originally built as my photo gallery—you should definitely check it out! I love taking street photography and capturing moments with my beloved ones. I travel a lot, so this is also a way for me to revive those memories. Besides that, I also have a workspace that archives my previous projects. Let’s get in touch if you think any of this sounds cool!
            </p>
            <p> Oh I also love music, i put my playlist down there, if it is your vibe, hit the button and i might be able to recommend you some songs based on my still-working-on algorithm :)</p>
            </div>
          </div>
        </div>
      </main>

      <footer>
        <p>&copy; 2024 quamatbong. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default About;
