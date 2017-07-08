import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import Project from './Project';
import projects from './Projects.content';

import '../styles/Projects.scss';

const Projects = () => (
  <div>
    <ul>
      {projects.map((p, index) =>
        <div className="project-list-item">
          <li>
            <Project
              title={p.title}
              content={ReactHtmlParser(p.content)}
              img={p.img}
            />
          </li>
          { index < (projects.length - 1) ?
            <hr className="project-devider" /> : ''
          }
        </div>,
      )}
    </ul>
  </div>
);

export default Projects;
