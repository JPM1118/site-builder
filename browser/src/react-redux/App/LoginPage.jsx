import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import setUser from './setUser.action'
import axios from 'axios';

const initialState = {
  email: '',
  password: '',
  emailError: '',
  generalError: '',
  passwordError: ''
};

const mapDispatchToProps = dispatch => {
  return {
    setUser: user => {
      dispatch(setUser(user))
    }
  }
}

const mapStateToProps = state => {
  return { user: state.user }
}

class loginPage extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    setUser: PropTypes.func.isRequired
  };

  state = initialState

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }


  enableButton = () => {
    return !(
      this.state.email &&
      this.state.password
    )
  }

  onSubmit = (e) => {
    this.setState(initialState);

    e.preventDefault();

    const user = {
      email: this.state.email,
      password: this.state.password
    };

    axios.post('/api/user', user)
      .then(res => {
        //set current user with redux store.
        console.log(res);
        this.props.setUser({ email: user.email });
      })
      .catch(err => {
        if (err.response.data.error.errors) {
          const errors = err.response.data.error.errors;

          errors.email ? this.setState({ emailError: errors.email.message }) : null
          errors.password ? this.setState({ passwordError: errors.password.message }) : null

        } else {
          this.setState({
            generalError: err.response.data.error.message
          });
        }
      });
  }
  componentDidUpdate() {
    if (this.props.user) {
      this.props.history.push('/')
    }
  }
  render() {
    return (
      <div className='login-page'>
        <form onSubmit={this.onSubmit} className='login-page__form'>
          <h1 className='login-page__title'>Login</h1>
          <p className='login-page__general-error'>
            {this.state.generalError}
          </p>

          <div className='login-page__input'>
            <label className='login-page__label'>
              Email
              <span className='login-page__error'>{this.state.emailError}</span>
            </label>
            <input
              name='email'
              value={this.state.email}
              type='email'
              onChange={this.handleChange}
              className='login-page__input-field'
            />
          </div>

          <div className='login-page__input'>
            <label className='login-page__label'>
              Password
              <span className='login-page__error'>{this.state.passwordError}</span>
            </label>
            <input
              name='password'
              value={this.state.password}
              type='password'
              onChange={this.handleChange}
              className='login-page__input-field'
            />
          </div>

          <div>
            <button
              disabled={this.enableButton()}
              className='login-page__submit-button'
            >
              login
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(loginPage);
