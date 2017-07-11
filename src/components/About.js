import React from 'react';
import fbIcon from '../assets/images/fb-icon.svg';
import ghIcon from '../assets/images/gh-icon.svg';
import mdIcon from '../assets/images/medium-icon.svg';
import '../styles/About.scss';

const About = () => (
  <div>
    <h1 className="about-title">About</h1>
    <div className="about-container">
      <p className="about-content">
        Vibert Thio is digging into edged tech,
        and transforming it to the energy of
        creating his art pieces in new form.
      </p>

      <p className="about-content">
        Thio is studying in National Taiwan University(NTU),
        majoring in Electrical Engineering.
      </p>

      <p className="about-content">
        Mostly,
        he makes audio/visual art by using Processing(Java), C++ and Javascript.
        He is currently also working on research of VR and Bio-art study.
      </p>

      <div>
        <ul className="sn-list">
          <li>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.facebook.com/vibert.thio"
            >
              <img
                src={fbIcon}
                className="sn-icon"
                alt="fb-icon"
              />
            </a>
          </li>
          <li>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://github.com/vibertthio"
            >
              <img
                src={ghIcon}
                className="sn-icon"
                alt="gh-icon"
              />
            </a>
          </li>
          <li>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://medium.com/@vibertthio"
            >
              <img
                src={mdIcon}
                className="sn-icon"
                alt="medium-icon"
              />
            </a>
          </li>

        </ul>
      </div>
    </div>
  </div>
);


export default About;
