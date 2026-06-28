import React, { useState } from 'react';
import missing from '../assets/img/Missing_Textures_artwork.jpg';
import './Home.css';

const about = "We are the game dev club club";
const links = "Links to our social media and other stuff";
const test = "Lorem Ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

function Home() {
  const [text, setText] = useState("");
  const [hovered, setHovered] = useState(0);
  const textDisplay = <h2 className="description">{text}</h2>;

  return (
    <div>
      <h2>Home Page</h2>
      <p>Welcome to the home page!</p>
      <div className="home-details">
        <img className="logo" src={missing} alt="Missing Textures Artwork" />
        <h1>HI WE ARE THE GAME DEV CLUB CLUB!!!</h1>
      </div>
      <div className="home-description-div">
        <div>
          <button onMouseOver={() => {
            setText(about);
            setHovered(1);
          }} className="home-description">Who are we?</button>
          {hovered == 1 && textDisplay}
        </div>
        <div>
          <button onMouseOver={() => {
            setText(links);
            setHovered(2);
          }} className="home-description">Links</button>
          {hovered == 2 && textDisplay}
        </div>
        <div>
          <button onMouseOver={() => {
            setText(test);
            setHovered(3);
          }} className="home-description">Test</button>
          {hovered == 3 && textDisplay}
        </div>
      </div>
    </div>
  )
}

export default Home
