import React, { useEffect } from "react";
import { gsap } from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import "../styles/LandingPage.css";
import { Link } from "react-router-dom";

import BalletDoodle from "../assets/images/BalletDoodle.png";
import DancingDoodle from "../assets/images/DancingDoodle.png";
import BlueFLower from "../assets/images/blueflower.png";
import YellowRandomShape from "../assets/images/yellowrandomshape.png";
import PinkHeart from "../assets/images/pinkheart.png";
import Round from "../assets/images/round.png";
import Kendrick from "../assets/images/kendrick.jpg";
import Olivia from "../assets/images/olivia.jpg";
import Sza from "../assets/images/sza.jpg";
import HoangThuyLinh from "../assets/images/hoangthuylinh.jpg";
import Bruno from "../assets/images/bruno.jpg";
import BadBunny from "../assets/images/badbunny.jpg";
import Ivory from "../assets/images/ivory.jpeg";
import ScribbleMusic from "../assets/images/scribble15.svg";
import ScribbleFlower from "../assets/images/scribble41.svg";
import ScribbleMusic2 from "../assets/images/scribble43.svg";
import ScribbleMusic3 from "../assets/images/scribble47.svg";
import WestVillage from "../assets/images/westvillage.jpg";
import DividedWorld from "../assets/images/dividedworld.png";
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const LandingPage = () => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

    // Smooth scroll timeline for green container
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".green-container",
        start: "top top",
        end: "bottom top",
        scrub: 0.5, // smoother scrub
      },
    });

    // Title Animation
    timeline.to(".title", {
      motionPath: {
        path: [
          { x: 38, y: 100 },
          { x: 120, y: 50 },
          { x: 200, y: -200 },
        ],
        curviness: 2, // smoother path
      },
      opacity: 1,
      ease: "linear",
    });

    // Pink Heart Animation
    timeline.to(
      ".pink-heart",
      {
        motionPath: {
          path: [
            { x: -200, y: 0 },
            { x: -300, y: 200 },
            { x: -400, y: 500 },
            { x: -300, y: 700 },
          ],
          curviness: 2,
        },
        rotation: 360,
        ease: "linear",
      },
      "<"
    ); // start slightly after title

    // Blue Flower Animation
    timeline.to(
      ".blue-flower",
      {
        motionPath: {
          path: [
            { x: 0, y: 150 },
            { x: -100, y: 180 },
            { x: -200, y: 200 },
          ],
          curviness: 2,
        },
        ease: "linear",
      },
      "<"
    );

    // Timeline for second section (red container)
    const timeline2 = gsap.timeline({
      scrollTrigger: {
        trigger: ".dancing-doodle",
        start: "center top",
        endTrigger: ".red-container",
        end: "bottom top",
        scrub: 0.7, // smoother scrub
      },
    });

    // Red container background expansion
    timeline2.fromTo(
      ".red-container",
      { scale: 0.7, transformOrigin: "center center" },
      { scale: 1, ease: "power2.out" }
    );

    // Scribble flower scaling
    timeline2.to(
      ".scribble-flower",
      {
        scale: 1.5,
        ease: "power2.out",
      },
      "<"
    );

    // Subtitle vertical movement
    timeline2.to(
      ".subtitle",
      {
        y: 100,
        ease: "power2.out",
      },
      "<"
    );

    // Pink Heart horizontal movement
    timeline2.to(
      ".pink-heart",
      {
        x: "70vw",
        ease: "power1.out",
      },
      ">"
    );

    // Album grid animations
    timeline2.to(
      ".album-grid .album-photo:nth-child(-n+3)",
      {
        x: "50vw",
        opacity: 0.5,
        ease: "power1.out",
        onComplete: () => {
          gsap.set(".album-grid .album-photo:nth-child(-n+3)", { x: "-50vw" });
        },
      },
      "<"
    );

    timeline2.to(
      ".album-grid .album-photo:nth-child(n+4)",
      {
        x: "-50vw",
        opacity: 0.5,
        ease: "power1.out",
      },
      "<"
    );

    // Brown circle movement
    timeline2.to(
      ".brown-circle",
      {
        x: -100,
        opacity: 1,
        ease: "power1.out",
      },
      "<"
    );

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div className="page-container">
      <div className="green-container">
        <div className="grid-container">
          <div className="left-column">
            <img
              src={YellowRandomShape}
              alt="Yellow Shape"
              className="yellow-random-shape"
            />
            <img
              src={DancingDoodle}
              alt="Dancing Doodle"
              className="dancing-doodle"
            />
            <img src={PinkHeart} alt="Pink Heart" className="pink-heart" />
          </div>
          <div className="center-column">
            <img
              src={ScribbleMusic}
              alt="Scribble Music"
              className="scribble-music"
            />
            {/* Scribble music styling moved to LandingPage.css */}
            <div className="center-title">
              <h1 className="title">ivory le</h1>
              <p className="subtitle">WELCOME TO MY PORTFOLIO</p>
            </div>
          </div>
          <div className="right-column">
            <img
              src={BalletDoodle}
              alt="Ballet Doodle"
              className="ballet-doodle"
            />
            <img src={BlueFLower} alt="blue flower" className="blue-flower" />
          </div>
        </div>
      </div>

      {/* Red Section */}
      <div className="red-container">
        <img
          src={ScribbleMusic2}
          alt="Scribble Music"
          className="scribble-music-2"
        />
        <img
          src={ScribbleFlower}
          alt="Scribble Flower"
          className="scribble-flower"
        />
        <img
          src={ScribbleMusic3}
          alt="Scribble Music"
          className="scribble-music-3"
        />
        <div className="album-grid">
          <img src={Kendrick} alt="Kendrick" className="album-photo" />
          <img src={Olivia} alt="Olivia" className="album-photo" />
          <img src={Sza} alt="Sza" className="album-photo" />
          <img src={HoangThuyLinh} className="album-photo" />
          <img src={Bruno} alt="Bruno" className="album-photo" />
          <img src={BadBunny} alt="Bad Bunny" className="album-photo" />
        </div>
        <img src={Round} alt="Brown Circle" className="brown-circle" />
      </div>

      <div className="black-container">
        <div className="app-intro">
          <h2>
            Hi, I’m <span className="highlight">Ivory Le</span> — a Computer
            Science student passionate about
            <span className="highlight"> AI, full-stack development, </span>
            and building impactful digital experiences.
          </h2>

          <div className="steps">
            <div className="step">
              <div className="step-content">
                <span className="step-number">1</span>
                <p>
                  Currently studying{" "}
                  <span className="highlight">
                    Computer Science and Cognitive Science
                  </span>{" "}
                  at Lehigh University with a minor in Applied Math background.
                </p>
              </div>
            </div>

            <div className="step">
              <div className="step-content">
                <span className="step-number">2</span>
                <p>
                  Experienced through internships at{" "}
                  <span className="highlight">Qualcomm </span>
                  and <span className="highlight">Exelon</span>, where I built
                  <span className="highlight">
                    {" "}
                    AI systems, automation pipelines,{" "}
                  </span>
                </p>
              </div>
            </div>

            <div className="step">
              <div className="step-content">
                <span className="step-number">3</span>
                <p>
                  Creator of projects like{" "}
                  <span className="highlight">Matchify</span> and{" "}
                  <span className="highlight">Divided World</span>, researcher
                  in AI and mathematics, and an active member of{" "}
                  <span className="highlight">RTC, O4U, and SASE</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="content-container">
        {/* Heading */}
        <div className="text-gettoknowme">
          <h1>More about me</h1>
        </div>

        {/* Spotify Section */}

        <div className="spotify-container">
          <div className="spotify-text">
            <h2>My <br/><span>Golden </span> Playlist</h2>
            <a
              href="https://open.spotify.com/playlist/0q2tWevD4wafWPrM0MrQko"
              target="_blank"
              rel="noreferrer"
              className="cta-button-light"
            >
              ➜ Listen Now
            </a>
          </div>
          <div className="spotify-square">
            <iframe
              src="https://open.spotify.com/embed/playlist/0q2tWevD4wafWPrM0MrQko?utm_source=generator"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* Photo Gallery Section */}
        <div className="gallery-container">
          <div className="gallery-square">
            <img src={WestVillage} alt="West Village" />
          </div>
          <div className="gallery-text">
            <h2>My <br/><span> Blue</span><br/> Lens</h2>
            <a
              href="/portfolio/myphotos"
              target="_blank"
              rel="noreferrer"
              className="cta-button-light"
            >
              ➜ See my other photos
            </a>
          </div>
        </div>

        {/* Previous Work Section */}
        <div className="work-container">
          <div className="work-text">
            <h2>See <br/> My  <br/> Works</h2>
            <a
              href="/portfolio/myworks"
              target="_blank"
              rel="noreferrer"
              className="cta-button-light"
            >
              ➜ Other previous works
            </a>
          </div>
          <div className="work-square">
              <img src={DividedWorld} alt="Divided World" />
              <p>Divided World</p>
            </div>
          
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
