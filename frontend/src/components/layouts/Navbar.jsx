import React, { useState } from 'react';
import './NavbarCss.css'; // Make sure to create this CSS file

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className='btndiv'>
      <button className="openbtn" onClick={() => setIsOpen(!isOpen)}>☰</button>
      </div>
      <div className={`overlay ${isOpen ? "show" : ""}`}>
        <a href="javascript:void(0)" className="closebtn" onClick={() => setIsOpen(!isOpen)}>&times;</a>
        <div className="overlay-content">
          <a href="#">Home</a>
          <a href="#">Services</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
