import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import { Grid } from "@mui/material";
import SalesByPaymentTypeChart from "../../Components/Charts/Payments";
import MonthlySalesChart from "../../Components/Charts/Monthly";
import SalesByCategoryChart from "../../Components/Charts/Category";
import './Stats.css'
import ProductCard, { IProductSale } from "../../Components/ProductCard/ProductCard";
import { getData } from "../../Service/Api";

const Stats: React.FC = () => {
    const [topProducts, setTopProducts] = useState<IProductSale[]>([])

    const token = localStorage.getItem("token") || undefined

    const getProducts = async () => {
        const response = await getData({token, path: "/v1/stats/top"})

        if(response.ok){
            if("data" in response){
                setTopProducts(response.data as IProductSale[])
            }
        }
    }

    console.log(topProducts)
    
    useEffect(() => {
        getProducts()
    }, [])



    return (
        <>
            <Navbar />

            <Grid
                container
                paddingTop="80px"
                padding="80px 20px 0 20px"
                justifyContent="center"
            >
                <div className="chart-item">
                    <MonthlySalesChart />
                </div>
                <div className="chart-item">
                    <SalesByCategoryChart />
                </div>
                <div className="chart-item">
                    <SalesByPaymentTypeChart />
                </div>

                <h2 style={{marginTop: "20px"}}>
                    Productos más vendidos
                </h2>

                <Grid container spacing={4} justifyContent="center" margin={"20px"}>
                    {topProducts.map((product) => (
                        <ProductCard
                            _id={product._id}
                            name={product.name}
                            category={product.category}
                            price={product.price}
                            stock={product.stock}
                            key={product._id}
                            picture={product.picture}
                            reload={getProducts}
                            buyPrice={product.buyPrice}
                            isStat={true}
                        />
                    ))}
                </Grid>
            </Grid>
        </>
    );
};

export default Stats;
