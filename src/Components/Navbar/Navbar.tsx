import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import ArteLogo from "../../assets/general-assets/complete-logo.png";
import CartLink from "../Cart/CartLink";
import { NavLink } from "react-router-dom";

const Navbar: React.FC = () => {
    return (
        <AppBar
            position="fixed"
            sx={{
                backgroundColor: "#9bd7c2",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            }}
        >
            <Toolbar>
                {/* Logo */}
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        flexGrow: 1,
                        display: { xs: "none", sm: "block" }, // Ocultar logo en xs y mostrarlo en sm o más grande
                    }}
                >
                    <img
                        src={ArteLogo}
                        alt="Logo"
                        style={{ height: "40px", marginRight: "20px" }}
                    />
                </Typography>

                {/* Links */}
                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        width: { xs: "100%", sm: "auto" }, // 100% en pantallas xs, auto en pantallas sm y más grandes
                        justifyContent: { xs: "space-between", sm: "flex-start" }, // space-between en xs, flex-start en sm
                        alignItems: "center"
                    }}
                >
                    <NavLink to="/productos" style={{textTransform: "uppercase", color: "white"}}>Productos</NavLink>
                    <NavLink to="/recibos" style={{textTransform: "uppercase", color: "white"}}>Recibos</NavLink>
                    <NavLink to="/estadistica" style={{textTransform: "uppercase", color: "white"}}>Estadística</NavLink>
                    <CartLink />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
