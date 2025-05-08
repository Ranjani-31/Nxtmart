import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showPassword: false,
    errorMsg: '',
  }

  usernameChange = event => {
    this.setState({username: event.target.value})
  }

  passwordChange = event => {
    this.setState({password: event.target.value})
  }

  showPassword = () => {
    this.setState(prevState => ({showPassword: !prevState.showPassword}))
  }

  onSubmisstion = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const apiUrl = 'https://apis.ccbp.in/login'
    const newUser = {
      username,
      password,
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(newUser),
    }
    const response = await fetch(apiUrl, options)
    console.log(response)
    if (response.ok) {
      const data = await response.json()
      this.setState({errorMsg: ''})
      Cookies.set('jwt_token', data.jwt_token, {expires: 7})
      const {history} = this.props
      history.replace('/')
    } else {
      const data = await response.json()
      this.setState({errorMsg: data.error_msg})
    }
  }

  render() {
    const {username, password, showPassword, errorMsg} = this.state
    const jwt = Cookies.get('jwt_token')
    if (jwt !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <div className="card-container">
          <img
            className="logo"
            src="https://res.cloudinary.com/djabl2byk/image/upload/v1745334806/Logo_2_lyltqb.png"
            alt="login website logo"
          />
          <form onSubmit={this.onSubmisstion}>
            <label htmlFor="username">Username</label>
            <div className="username">
              <img
                src="https://res.cloudinary.com/djabl2byk/image/upload/v1745339673/profile-circle_l1ngea.svg"
                alt="user name"
              />
              <input
                className="input"
                value={username}
                id="username"
                onChange={this.usernameChange}
              />
            </div>
            <label htmlFor="password">Password</label>
            <div className="password">
              <img
                src="https://res.cloudinary.com/djabl2byk/image/upload/v1745334423/Group_14_ksub8u.svg"
                alt="password"
              />
              <input
                className="input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                id="password"
                onChange={this.passwordChange}
              />
            </div>
            <div>
              <input
                id="showPassword"
                type="checkbox"
                onChange={this.showPassword}
              />
              <label htmlFor="showPassword">Show Password</label>
            </div>
            <button
              disabled={username === '' || password === ''}
              type="submit"
              className="btn"
            >
              Login
            </button>
            <p className="error-msg">{errorMsg}</p>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
