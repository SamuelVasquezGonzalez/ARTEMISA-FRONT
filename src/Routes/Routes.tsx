import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { LoadingFallback } from "./Fallback/Fallback";
import PrivateRoutes from "../Middlewares/PrivateRoutes";
import { Fab } from "@mui/material";

import { useAuth } from "../UserContext";
import SignOut from "../Components/SignOut/SignOut";

// Screens imports using LazyLoading


const Login = lazy(() => import("../Screens/Login/Login"))
const Home = lazy(() => import("../Screens/Home/Home"))

// Other Routes
const Mantenimiento = lazy(() => import("../Screens/InMaintenance/InMaintenance"))
const NotFound = lazy(() => import("../Screens/NotFound/NotFound"))
const Products = lazy(() => import("../Screens/Products/Products"))
const ReceiptPage = lazy(() => import("../Screens/CreateBill/CreateBill"))
const Solds = lazy(() => import("../Screens/Solds/Solds"))
const Stats = lazy(() => import("../Screens/Stats/Stats"))

export const RoutesMiddleware: React.FC = () => {


    return (
        <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>

                <SignOut/>

                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/maintenance" element={<Mantenimiento />} />
                    <Route path="/*" element={<NotFound />} />



                    {/* RUTAS PRIVADAS */}
                    <Route path="/home" element={
                    <PrivateRoutes requiredRole={["Admin"]}>
                        <Home />
                    </PrivateRoutes>} />
                    
                    <Route path="/productos" element={
                    <PrivateRoutes requiredRole={["Admin"]}>
                        <Products />
                    </PrivateRoutes>} />
                    
                    <Route path="/crear/factura" element={
                    <PrivateRoutes requiredRole={["Admin"]}>
                        <ReceiptPage />
                    </PrivateRoutes>} />
                   
                    <Route path="/recibos" element={
                    <PrivateRoutes requiredRole={["Admin"]}>
                        <Solds />
                    </PrivateRoutes>} />
                    
                    <Route path="/estadistica" element={
                    <PrivateRoutes requiredRole={["Admin"]}>
                        <Stats />
                    </PrivateRoutes>} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}