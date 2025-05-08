import Cookies from 'js-cookie'
import {Redirect, Route} from 'react-router-dom'

const ProtectedRoute = props => {
  const jwt = Cookies.get('jwt_token')
  if (!jwt) {
    return <Redirect to="/login" />
  }
  return <Route {...props} />
}

export default ProtectedRoute
