import React, { useState } from "react";
import { useProducts } from "../../ProductContext";
import './Cart.css'
import { IProductSale } from "../ProductCard/ProductCard";

const CartProduct: React.FC<IProductSale> = ({picture, name, price, quantity, _id}) => {
    const { updateProductQuantity, removeProduct } = useProducts()

    const handleIncrease = () => {
        if(_id && quantity){
            updateProductQuantity(_id, quantity + 1);
        }
    }

    const handleDecrease = () => {
        if(_id && quantity){
            if (quantity > 1) {
                updateProductQuantity(_id, quantity - 1);
            } else {
                removeProduct(_id);
            }
        }
        
    };


    return (
        <div className="product-cart-card">
            <div className="image">
                <img
                    src={picture?.url}
                    alt={name}
                />
            </div>

            <div className="info">
                <h3>{name}</h3>
                <p>x{quantity} ${price.toLocaleString()}</p>
            </div>

                <div className="controls controls-visible">
                    <button onClick={handleIncrease}>+</button>
                    <p>{quantity}</p>
                    <button onClick={handleDecrease}>-</button>
                </div>

        
        </div>
    );
}

export default CartProduct;