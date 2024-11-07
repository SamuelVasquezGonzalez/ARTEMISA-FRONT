import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { ISales } from "./Components/Cart/CartLink";
import { IProductSale } from "./Components/ProductCard/ProductCard";



interface ProductsContextType {
    productsState: ISales;
    setProductsState: React.Dispatch<React.SetStateAction<ISales>>;
    addProduct: (product: IProductSale) => void;
    updateProductQuantity: (productId: string, quantity: number) => void;
    removeProduct: (productId: string) => void;
    clearProducts: () => void;
    updateProductPrice: (productId: string, price: number) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [productsState, setProductsState] = useState<ISales>({
        products: [],
        totalPrice: 0,
        payType: "Efectivo",
        created: new Date()
    });

    const [isInitialized, setIsInitialized] = useState(false);

        const addProduct = (product: IProductSale) => {
    setProductsState((prevState) => {
        const existingProduct = prevState.products.find(p => p._id === product._id);

        if (existingProduct) {
            const updatedProducts = prevState.products.map(p => p._id === product._id
                ? { ...p, quantity: (p.quantity || 0) + 1 }
                : p
            );

            const updatedTotal = updatedProducts.reduce((sum, item) => {
                // Verifica que el objeto item no sea null o undefined y que price y quantity existan
                if (item && item.price && item.quantity) {
                    return sum + item.price * item.quantity;
                }
                return sum; // Si no hay precio o cantidad, simplemente retorna la suma actual
            }, 0);

            return {
                ...prevState,
                products: updatedProducts,
                total: updatedTotal
            };
        } else {
            const updatedProducts = [...prevState.products, { ...product}]; 
            
            const updatedTotal = updatedProducts.reduce((sum, item) => {
                // Verifica que el objeto item no sea null o undefined y que price y quantity existan
                if (item && item.price && item.quantity) {
                    return sum + item.price * item.quantity;
                }
                return sum; // Si no hay precio o cantidad, simplemente retorna la suma actual
            }, 0);
            
            return {
                ...prevState,
                products: updatedProducts,
                totalPrice: updatedTotal 
            };
        }
    });
};

const updateProductQuantity = (productId: string, quantity: number) => {
    setProductsState((prevState) => {
        if (quantity <= 0) {
            // removeProduct debe devolver el nuevo estado completo
            const updatedProducts = prevState.products.filter(product => product._id !== productId);

            const updatedTotal = updatedProducts.reduce((sum, item) => {
                if (item && item.price && item.quantity) {
                    return sum + item.price * item.quantity;
                }
                return sum;
            }, 0);

            return {
                ...prevState,
                products: updatedProducts,
                totalPrice: updatedTotal
            };
        }

        const updatedProducts = prevState.products.map((product) => {
            if (product._id === productId) {
                return {
                    ...product,
                    quantity, // Actualizamos solo la cantidad
                };
            }
            return product;
        });

        const updatedTotal = updatedProducts.reduce((sum, item) => {
            if (item && item.price && item.quantity) {
                return sum + item.price * item.quantity;
            }
            return sum;
        }, 0);

        return {
            ...prevState,
            products: updatedProducts,
            totalPrice: updatedTotal // Cambié 'total' a 'totalPrice'
        };
    });
};

const removeProduct = (productId: string) => {
    setProductsState((prevState) => {
        const updatedProducts = prevState.products.filter((product) => product._id !== productId);

        const updatedTotal = updatedProducts.reduce((sum, item) => {
            // Si item.price es null o undefined, usamos 0
            return sum + (item?.price ?? 0);
        }, 0);

        return {
            ...prevState,
            products: updatedProducts,
            totalPrice: updatedTotal
        };
    });
};

    const clearProducts = () => {
        setProductsState({
            products: [],
            totalPrice: 0,
            payType: "Efectivo",
            created: new Date()
        })
    }

    const updateProductPrice = (productId: string, price: number) => {
        setProductsState((prevState) => {
            const updatedProducts = prevState.products.map((product) => {
                if (product._id === productId) {
                    return {
                        ...product,
                        price // Actualizamos solo el precio
                    };
                }
                return product;
            });
    
            const updatedTotal = updatedProducts.reduce((sum, item) => {
                if (item && item.price && item.quantity) {
                    return sum + item.price * item.quantity;
                }
                return sum;
            }, 0);
    
            return {
                ...prevState,
                products: updatedProducts,
                totalPrice: updatedTotal
            };
        });
    };
    

    useEffect(() => {
        const localStorageProducts: string | null = localStorage.getItem("cart");

        if (localStorageProducts && typeof localStorageProducts === "string") {
            try {
                const parsedLocalStorage: ISales = JSON.parse(localStorageProducts);
                setProductsState(parsedLocalStorage);
            } catch (err) {
                console.error("Error parsing localStorage data", err);
            }
        }
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("cart", JSON.stringify(productsState));
        }
    }, [productsState, isInitialized]);

    return (
        <ProductsContext.Provider value={{ productsState, setProductsState, addProduct, updateProductQuantity, removeProduct, clearProducts, updateProductPrice }}>
            {children}
        </ProductsContext.Provider>
    );
};

export const useProducts = (): ProductsContextType => {
    const context = useContext(ProductsContext);
    if (!context) {
        throw new Error("useProducts debe usarse dentro de un ProductsProvider");
    }
    return context;
};
