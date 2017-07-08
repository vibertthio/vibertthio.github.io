import React from 'react';
import PropTypes from 'prop-types';
import '../styles/Projects.scss';

const Project = props => (
  <div className="project-container">
    <div>
      <h1 className="project-title">{props.title}</h1>
      <div className="thumbnail-project-img">
        <img
          src={props.img}
          className="project-img"
          alt="project-img"
        />
      </div>
      <div className="description-container">
        <p className="projects-description">
          {props.content}
        </p>
      </div>
    </div>

  </div>
);

Project.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
};

export default Project;
