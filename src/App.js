import {Component} from 'react'
import {Route, Switch} from 'react-router-dom'

import './App.css'
import Login from './components/Login'
import Cart from './components/Cart'

import Home from './components/Home'
import NotFound from './components/NotFound'

import ProtectedRoute from './components/ProtectedRoute'

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/login" component={Login} />
        <ProtectedRoute exact path="/" component={Home} />
        <ProtectedRoute exact path="/cart" component={Cart} />
        <Route component={NotFound} />
      </Switch>
    )
  }
}

export default App
