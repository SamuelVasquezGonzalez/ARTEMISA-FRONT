import React, { useEffect, useRef, useState } from "react";
import "./Cart.css";
import { useProducts } from "../../ProductContext";
import CartProduct from "./CartProduct";
import { NavLink } from "react-router-dom";
import { Button } from "@mui/material";
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import { IProductSale } from "../ProductCard/ProductCard";
import CloseIcon from '@mui/icons-material/Close';


export type PayType = "Transferencia" | "Efectivo" | "Tarjeta"

export interface ISales {
    _id?: string
    idClient?: string,
    totalPrice: number,
    created: Date,
    payType: PayType,
    products: IProductSale[],
    moneyReturned?: number
    consecutive?: number
}


const CartLink: React.FC = () => {
    const [open, onOpen] = useState<boolean>(false);
    const { productsState } = useProducts();
    const [showNotify, setShowNotify] = useState<boolean>(false);
    const [prevProductCount, setPrevProductCount] = useState<number>(productsState.products.length);
    const cartRef = useRef<HTMLDivElement | null>(null);
    const cartButtonRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (productsState.products.length > prevProductCount) {
            setShowNotify(true);
            setTimeout(() => {
                setShowNotify(false);
            }, 1500);
        }
        setPrevProductCount(productsState.products.length);
    }, [productsState.products]);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [open]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                cartRef.current &&
                !cartRef.current.contains(event.target as Node) &&
                !cartButtonRef.current?.contains(event.target as Node)
            ) {
                onOpen(false);
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    const handleCartButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onOpen(!open);
    };

    return (
        <>
            <li className="navbar-item cart">
                <div className="cart-counter">
                    {productsState.products.length}
                </div>
                <Button sx={{width: "30px !important", height: "30px !important", padding: 0 }} color="inherit" ref={cartButtonRef} onClick={handleCartButtonClick}>
                    <ReceiptOutlinedIcon />
                </Button>
                {showNotify && (
                    <div className="cart-notification">
                        <p>Se añadio al carrito</p>
                    </div>
                )}
            </li>

            {open && (
                <div
                    className="cart-products-container"
                    ref={cartRef}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="cart-title">
                        <h2>Carrito de productos</h2>
                        <button onClick={() => onOpen(false)} className="close-cart-btn"><CloseIcon/></button>
                    </div>

                    <div className="product-cart-list">
                        {productsState.products.length === 0 ? (
                            <div className="clean-cart-container">
                                <h2>Tu carrito esta limpio</h2>
                                <i className="ri-shopping-cart-line"></i>
                            </div>
                        ) : (
                            productsState.products.map(({ name, quantity, price, picture, _id, stock, category, buyPrice }) => (
                                <CartProduct
                                    key={_id}
                                    name={name}
                                    quantity={quantity}
                                    price={price}
                                    picture={picture}
                                    _id={_id}
                                    stock={stock}
                                    category={category}
                                    buyPrice={buyPrice}
                                />
                            ))
                        )}
                    </div>

                    {productsState.products.length > 0 && (
                        <div className="cart-info">
                            Total a pagar: ${productsState.totalPrice.toLocaleString()}

                            <NavLink to={"/crear/factura"} className="button">Generar venta</NavLink>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default CartLink;
