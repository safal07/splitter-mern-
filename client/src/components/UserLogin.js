import React, { Component} from 'react';
import {Redirect} from 'react-router';
import {connect} from 'react-redux';
import {login} from '../actions/authActions'
import {renderError} from '../utilities/renderError';
import Notification from './Notification';
import Header from './Header';

function mapStateToProps(state) {
  return({
    auth: state.auth,
    errors: state.errors
  });
}

function mapDispatchToProps(dispatch) {
  return({
    loginUser: (email, password) => {
      dispatch(login(email, password));
    }
  });
}


class UserLogin extends Component{
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }


  login = (e) => {
    e.preventDefault();
    this.props.loginUser(this.state.email, this.state.password);
  }


  render() {
    let loginErrors = renderError(this.props.auth.loginErrors);
    if(!this.props.auth.authenticated) {
      return(
        <div className = "page">
        <Header />
        <Notification />
        <div className = "body">
          <div className = "login-content">
            <p className = "title"> Please login below! </p>
            <ul className = {this.props.auth.loginErrors.length > 0 ? "error-show" : "error-hide"}> <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>{loginErrors} </ul>
            <form className = "loginForm" onSubmit = {this.login}>

                  <div className="one-input">
                    <label > Email: </label>
                    <input type="email" onChange={this.handleChange} name="email" name="email" required>
                    </input>
                  </div>
                  <div className="one-input">
                    <label > Password: </label>
                    <input type="password" onChange={this.handleChange} name="password" name="password" required>
                    </input>
                  </div>
                  <p className = "aggrement"> By clicking login, you agree to comply with the
                  terms and policies of SPLITTER </p>
                  <button type="submit" className="login" name="login">Login</button>
            </form>
            </div>
        </div>
        </div>
      );
    }
    else {
      return(<Redirect to={{
            pathname: '/dashboard',
        }}
      />);

    }

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserLogin);
