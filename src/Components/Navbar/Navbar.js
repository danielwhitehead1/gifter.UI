import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import logo from './../../Icons/logo_transparent.png';
import { Auth } from 'aws-amplify';
import { isBrowser, isMobile } from 'react-device-detect';
import './Navbar.css';

class TopNavbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showNavItems: isBrowser
    }
  }

  handleLogout = async event => {
    await Auth.signOut();
    this.props.userHasAuthenticated(false);
    this.props.history.push("/login");
  }

  hideNavBar = () => {
    if(isMobile) {
      this.setState({showNavItems: false})
    }
  }

  toggleNavBar = () => {
    this.setState({showNavItems: !this.state.showNavItems})
  }

  userLoggedIn() {
    return(
      <div>
        <Nav>
          <NavItem componentClass={Link} href="/contacts" to="/contacts" active={window.location.pathname === '/contacts'}>Contacts</NavItem>
          <NavItem componentClass={Link} href="/profile" to="/profile" active={window.location.pathname === '/profile'}>Profile</NavItem>
        </Nav>
        <Nav pullRight>
          <NavItem onClick={ this.handleLogout }>Logout</NavItem>
        </Nav>
      </div>
    );
  }

  userNotLoggedIn() {
    return(
      <Nav pullRight>
        <NavItem componentClass={Link} href="/login" to="/login" active={window.location.pathname === '/login'} onClick={this.hideNavBar}>Login</NavItem>
        <NavItem componentClass={Link} href="/signup" to="/signup" active={window.location.pathname === '/signup'} onClick={this.hideNavBar}>Signup</NavItem>
      </Nav>
    );
  }

  navbarItems() {
    if(this.props.isAuthenticated) {
      return(this.userLoggedIn());
    }
    else {
      return(this.userNotLoggedIn());
    }
  }

  render() {
    return(
      <Navbar fixedTop>
        <Navbar.Header>
          <Navbar.Brand>
            <img src={logo} alt='Gifter logo' className="navbar-logo" />
            <Link to='/' className="gifter-text">Gifter</Link>
          </Navbar.Brand>
        </Navbar.Header>
        { this.state.showNavItems ? 
          <div>
            { this.navbarItems() } 
            { isMobile ?
              <Nav pullRight>
                <NavItem eventKey={1} href="#" onClick={this.toggleNavBar}>
                  Hide
                </NavItem> 
              </Nav>
              : ''
            } 
          </div>
          :
          <Nav pullRight>
            { isMobile ? 
              <NavItem eventKey={1} href="#" onClick={this.toggleNavBar}>
                Show
              </NavItem> 
            : '' 
            }
          </Nav> 
        }
      </Navbar>
    );
  }
}
export default withRouter(TopNavbar);