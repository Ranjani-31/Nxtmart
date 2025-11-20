import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const status = {
  initial: 'INITIAL',
  inProgress: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {
    apiStatus: status.initial,
    data: [],
    activeTab: '',
    cartItems: JSON.parse(localStorage.getItem('cartData')) || [],
  }

  componentDidMount() {
    this.getData()
  }

  addCartItem = item => {
    const newItem = {
      id: item.id,
      name: item.name,
      weight: item.weight,
      price: item.price,
      image: item.image,
      count: 1,
    }

    this.setState(prevState => {
      const newValue = [...prevState.cartItems, newItem]
      localStorage.setItem('cartData', JSON.stringify(newValue))
      return {cartItems: newValue}
    })
  }

  increaseQuantity = id => {
    this.setState(prevState => {
      const updatedList = prevState.cartItems.map(item => {
        if (item.id === id) {
          return {...item, count: item.count + 1}
        }
        return item
      })
      localStorage.setItem('cartData', JSON.stringify(updatedList))

      return {cartItems: updatedList}
    })
  }

  decreaseQuantity = id => {
    this.setState(prevState => {
      const newList = prevState.cartItems.map(item => {
        if (item.id === id) {
          return {
            ...item,
            count: item.count - 1,
          }
        }
        return item
      })
      const updatedList = newList.filter(item => item.count > 0)
      localStorage.setItem('cartData', JSON.stringify(updatedList))

      return {cartItems: updatedList}
    })
  }

  getData = async () => {
    this.setState({apiStatus: status.inProgress})
    const apiurl = 'https://apis2.ccbp.in/nxt-mart/category-list-details'
    const jwt = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    }
    const response = await fetch(apiurl, options)
    if (response.ok) {
      const data = await response.json()
      const {categories} = data
      this.setState({
        apiStatus: status.success,
        data: categories,
        activeTab: categories[0].name.split(' ')[0],
      })
    } else {
      this.setState({apiStatus: status.failure})
    }
  }

  renderHome = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case status.inProgress:
        return this.loadingView()
      case status.success:
        return this.successView()
      case status.failure:
        return this.failureView()
      default:
        return null
    }
  }

  loadingView = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" color="#088c03" height={80} width={80} />
    </div>
  )

  failureView = () => (
    <div className="failure-view-container">
      <img
        src="https://res.cloudinary.com/djabl2byk/image/upload/v1745334456/Group_7519_c2ybnl.svg"
        alt="failure view"
      />
      <h1>Oops! Something went wrong.</h1>
      <p className="error-msg">We are having some trouble</p>
      <button onClick={this.retry}>Retry</button>
    </div>
  )

  showAll = () => {
    this.setState({activeTab: ''})
  }

  successView = () => {
    const {data, activeTab, cartItems} = this.state
    const isOrdered = id => cartItems.some(item => item.id === id)
    const categoriesWithId = data.map(item => ({
      ...item,
      id: item.name.split(' ')[0],
    }))
    const getQuantity = id => {
      const item = cartItems.find(eachProduct => eachProduct.id === id)
      return item ? item.count : 1
    }

    return (
      <div>
        <div className="success-view-content">
          {/* Category Buttons */}
          <div className="side-nav">
            {categoriesWithId.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  this.setState({activeTab: item.id})
                  document
                    .getElementById(item.id)
                    .scrollIntoView({behavior: 'smooth', block: 'start'})
                }}
                className="nav-btns"
              >
                <span
                  className={`side-nav-links ${
                    activeTab === item.id ? 'active-tab' : ''
                  }`}
                >
                  {item.name}
                </span>
              </button>
            ))}
          </div>

          {/* Product List */}
          <ul className="product-list-container">
            {categoriesWithId.map(item => (
              <li id={item.id} key={item.id} className="product-category">
                <div>
                  <img
                    src="https://res.cloudinary.com/djabl2byk/image/upload/v1745677197/arrow-right_xyc4vu.svg"
                    alt="arrow"
                  />
                  <h1>{item.name}</h1>
                </div>
                <div className="product-items">
                  {item.products.map(eachProduct => (
                    <div
                      key={eachProduct.id}
                      className="product-card"
                      data-testid="product"
                    >
                      <img
                        src={eachProduct.image}
                        alt={eachProduct.name}
                        className="product-image"
                        loading="lazy"
                      />
                      <div className="product-details">
                        {isOrdered(eachProduct.id) ? (
                          <div className="quantity-controls">
                            <button
                              className="quantity-btn"
                              onClick={() =>
                                this.decreaseQuantity(eachProduct.id)
                              }
                              data-testid="decrement-count"
                            >
                              -
                            </button>
                            <p data-testid="active-count">
                              {getQuantity(eachProduct.id)}
                            </p>
                            <button
                              className="quantity-btn"
                              onClick={() =>
                                this.increaseQuantity(eachProduct.id)
                              }
                              data-testid="increment-count"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              this.addCartItem(eachProduct)
                            }}
                            data-testid="add-button"
                          >
                            Add
                          </button>
                        )}
                        <div className="cart-details">
                          <p className="product-title">{eachProduct.name}</p>
                          <p className="product-weight">{eachProduct.weight}</p>
                          <p className="product-price">{eachProduct.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  retry = () => {
    this.getData()
  }

  render() {
    const {apiStatus} = this.state
    const {history} = this.props
    return (
      <div className="home-container">
        <Header history={history} />
        <div className="home-content">
          {this.renderHome()}
          {apiStatus === status.success && <Footer />}
        </div>
      </div>
    )
  }
}

export default Home
