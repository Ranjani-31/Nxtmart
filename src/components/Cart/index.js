import {Component} from 'react'
import Header from '../Header'
import './index.css'

class Cart extends Component {
  state = {
    orderPlaced: false,
    cartItems: JSON.parse(localStorage.getItem('cartData')) || [],
  }

  returnHome = () => {
    localStorage.removeItem('cartData')
    this.setState({orderPlaced: false})
    const {history} = this.props
    history.push('/')
  }

  orderPlace = () => {
    this.setState({orderPlaced: true})
  }

  getTotal = () => {
    const {cartItems} = this.state
    const price = cartItems.reduce(
      (acc, item) => acc + item.price.slice(1) * item.count,
      0,
    )
    return price
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

  render() {
    const {cartItems, orderPlaced} = this.state
    return (
      <div className="cart-container">
        <Header />
        <div className="cart-content">
          {orderPlaced ? (
            <div className="cart-ordered-view">
              <img
                src="https://res.cloudinary.com/djabl2byk/image/upload/v1746051018/Group_7417_acef0r.svg"
                alt="paymet"
              />
              <h1>Payment Successful</h1>
              <p>Thank you for ordering</p>
              <p>Your payment is successfully completed</p>
              <button onClick={this.returnHome}>Return to Homepage</button>
            </div>
          ) : (
            <div className="cart-container-items">
              {cartItems.length === 0 ? (
                <div className="empty-cart-container">
                  <img
                    src="https://res.cloudinary.com/djabl2byk/image/upload/v1745336410/shopping-cart-01_rgsuxy.svg"
                    alt="empty cart"
                  />
                  <h1>Your cart is empty</h1>
                </div>
              ) : (
                <div className="ordered-items">
                  <h1>Items</h1>

                  <ul>
                    {cartItems.map(item => (
                      <li
                        data-testid="cartItem"
                        key={item.id}
                        className="cart-product-container"
                      >
                        <div className="cart-product-details-container">
                          <img
                            src={item.image}
                            alt="product"
                            className="cart-product-image"
                          />
                          <div>
                            <p>{item.name}</p>
                            <p>{item.weight}</p>
                            <p>{item.price.slice(1) * item.count}</p>
                          </div>
                        </div>
                        <div className="quantity-controls">
                          <button
                            onClick={() => {
                              this.decreaseQuantity(item.id)
                            }}
                            data-testid="decrement-quantity"
                          >
                            -
                          </button>
                          <p data-testid="item-quantity">{item.count}</p>
                          <button
                            onClick={() => {
                              this.increaseQuantity(item.id)
                            }}
                            data-testid="increment-quantity"
                          >
                            +
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="total-price">
                    <p data-testid="total-price">
                      Total ({cartItems.length} items): ₹{this.getTotal()}
                    </p>
                    <button onClick={this.orderPlace} className="checkout">
                      Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default Cart
