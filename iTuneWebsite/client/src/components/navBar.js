// NAVBAR 
// REACT ROUTER DOM
// APP.CSS
// REACT BOOTSTRAP

import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../App.css";

function NavBar() {
  return (
    <header className="App-header">
      <Navbar expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="/">
          <div className="wrap-Brand">
            
            <h2 className="logoName"> iTunes Search</h2>
          </div>
        </Navbar.Brand>

        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text className="nav-text">
            <Nav className="mr-auto">
              <Link to="/music" className="link">
                Music
              </Link>
              <Link to="/movies" className="link">
                Movies
              </Link>
              <Link to="/videos" className="link">
                Videos
              </Link>
              <Link to="/audiobooks" className="link">
                Audio Books
              </Link>
            </Nav>
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
}

export default NavBar;
