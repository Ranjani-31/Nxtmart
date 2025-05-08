import {Component} from 'react'
import Cookies from 'js-cookie'
import {NavLink, Link} from 'react-router-dom'
import './index.css'

class Header extends Component {
  logout = () => {
    Cookies.remove('jwt_token')
    const {history} = this.props
    history.replace('/login')
  }

  render() {
    return (
      <div className="header-container">
        <Link to="/">
          <img
            className="header-logo"
            src="https://res.cloudinary.com/djabl2byk/image/upload/v1745334806/Logo_2_lyltqb.png"
            alt="website logo"
          />
        </Link>
        <ul className="nav-links">
          <li>
            <NavLink
              to="/"
              exact
              className={({isActive}) => (isActive ? 'active links' : 'links')}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({isActive}) => (isActive ? 'active links' : 'links')}
              to="/cart"
            >
              Cart
            </NavLink>
          </li>
          <li>
            <button onClick={this.logout} className="logout-btn">
              <img
                src="https://res.cloudinary.com/djabl2byk/image/upload/v1745673456/logout_msmoxe.svg"
                alt="logout icon"
              />
              <p>Logout</p>
            </button>
          </li>
        </ul>
      </div>
    )
  }
}

export default Header
