import React from 'react';
import Project from './Project';
import etudeImg from '../assets/images/etude/etude-01.jpg';
import beactImg from '../assets/images/beact/sc-03.png';

import '../styles/Projects.scss';

const Projects = () => (
  <div>
    <Project
      title="Étude"
      content={`
        We set as a goal to bring back the victims of this incident their colorful youth and future through the expression of music, art, and technology. The goal of the process was to change the way rehabilitation feels for them. Since all of them were just starting to figure out their future, the rehabilitation process was very painful emotionally. The addition of the music and creativity content in their rehabilitation aimed to bring a more positive atmosphere to them. The whole process was recorded so it could be repeated for the society.
      `}
      img={etudeImg}
    />
    <hr />

    <Project
      title="Beact"
      content={`
        An audio/visual interactive art piece, and an instrument that everyone play with to become a DJ + VJ. It's based on the idea of patatap, and using two.js, tone.js as audio and visual library. It combines sequencer with on concept of patatap. I have added some my own animation and will do more to replace ones from patatap.
      `}
      img={beactImg}
    />
  </div>
);

export default Projects;
