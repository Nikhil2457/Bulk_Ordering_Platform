import React from 'react';
import './index.css';

const CartCard = ({ cart, onRemove }) => {
  // ✅ Correct
  const { id, name, image, unit, quantity, totalPrice } = cart;


  return (
    <div className="cart-card">
      <img src={image} alt={name} className="cart-image" />
      <div className="cart-details">
        <h4>{name}</h4>
        <p>Unit: {unit}</p>
        <p>Quantity: {quantity}</p>
        <p>Total: ₹{totalPrice}</p>
      </div>
      <button className="remove-btn" onClick={() => onRemove(id)}>Remove</button>
    </div>
  );
};

export default CartCard;
