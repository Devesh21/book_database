import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Home from "./components/Home.js";
import Login from "./components/Login.js";
import Logout from "./components/Logout.js";
import { LinkContainer } from "react-router-bootstrap";
import img from "./image/img.jpg";
import {
  Button,
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  Form,
  FormControl
} from "react-bootstrap";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Navbar bg="light" expand="lg">
            <Navbar.Brand>
              <Link to="/">BookMaster</Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <LinkContainer to="/signup">
                  <Nav.Link>Signup</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
              </Nav>
              <Form inline>
                <FormControl
                  type="text"
                  placeholder="Search"
                  className="mr-sm-2"
                />
                <Button variant="outline-success">Search</Button>
              </Form>
            </Navbar.Collapse>
          </Navbar>
          <div className="App-body">
            <table />
            <Switch>
              <Route exact path="/" component={Home}/>
              <Route path="/login" component={Login} />
              <Route path="/logout" component={Logout} />
              <Route path="/SignUp" component={Logout} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
