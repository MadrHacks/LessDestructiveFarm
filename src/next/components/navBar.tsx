import React, { Component } from 'react';

class NavBar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-0">
        <img className="logo" src="/public/img/madr-logo.svg" />
        <div className="navbar-brand">MadrHacks Farmer</div>
      </nav>
    );
  }
}

export default NavBar;
