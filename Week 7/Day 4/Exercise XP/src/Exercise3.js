import { Component } from 'react';
import './Exercise.css';

const style_header = {
  color: 'white',
  backgroundColor: 'DodgerBlue',
  padding: '10px',
  fontFamily: 'Arial',
};

class Exercise extends Component {
  render() {
    return (
      <div className="tag-exercise">
        <h1 style={style_header}>This is a styled heading</h1>
        <p className="para">This paragraph is styled with an imported CSS file.</p>
        <a href="https://react.dev/">Explore React</a>
        <form className="sample-form" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="visitor-name">Your name</label>
          <input id="visitor-name" name="name" type="text" placeholder="Enter your name" />
          <button type="submit">Submit</button>
        </form>
        <img
          className="sample-image"
          src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=80"
          alt="A happy dog looking toward the camera"
        />
        <ul className="tag-list">
          <li>JSX</li>
          <li>Components</li>
          <li>Props</li>
        </ul>
      </div>
    );
  }
}

export default Exercise;