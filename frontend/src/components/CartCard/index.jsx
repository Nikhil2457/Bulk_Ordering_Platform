import React from 'react';
import './index.css';

const CartCard = ({ cart, onRemove, onIncrement, onDecrement }) => {
  const { id, name, image, unit, quantity, totalPrice } = cart;

  return (
    <div className="cart-card">
      <img src={image} alt={name} className="cart-image" />
      <div className="cart-details">
        <h4>{name}</h4>
        <p>Unit: {unit}</p>
        <p>
          Quantity: 
          <button onClick={onDecrement} className="qty-btn">-</button>
          {quantity}
          <button onClick={onIncrement} className="qty-btn">+</button>
        </p>
        <p>Total: ₹{totalPrice}</p>
      </div>
      <button className="remove-btn" onClick={onRemove}>Remove</button>
    </div>
  );
};

export default CartCard;
