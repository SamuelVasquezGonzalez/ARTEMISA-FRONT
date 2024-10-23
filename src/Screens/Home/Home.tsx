import React from "react";
import {
    Grid,
    Card,
    CardContent,
    Typography,
    CardActionArea,
    IconButton,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import ReceiptIcon from "@mui/icons-material/Receipt";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";

const Home: React.FC = () => {
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <>
            <Navbar />
            <Grid
                container
                spacing={4}
                justifyContent="center"
                alignItems="center"
                style={{ height: "100vh" }}
                padding={"0 20px"}
            >
                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        sx={{
                            borderRadius: 3,
                            boxShadow: 3,
                            transition: "transform 0.3s",
                            "&:hover": {
                                transform: "scale(1.05)",
                            },
                        }}
                    >
                        <CardActionArea
                            onClick={() => handleNavigation("/productos")}
                        >
                            <CardContent sx={{ textAlign: "center" }}>
                                <IconButton>
                                    <ShoppingCartIcon fontSize="large" />
                                </IconButton>
                                <Typography variant="h6">Productos</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Gestiona el catálogo de productos y su inventario.
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        sx={{
                            borderRadius: 3,
                            boxShadow: 3,
                            transition: "transform 0.3s",
                            "&:hover": {
                                transform: "scale(1.05)",
                            },
                        }}
                    >
                        <CardActionArea
                            onClick={() => handleNavigation("/recibos")}
                        >
                            <CardContent sx={{ textAlign: "center" }}>
                                <IconButton>
                                    <ReceiptIcon fontSize="large" />
                                </IconButton>
                                <Typography variant="h6">Recibos</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Revisa y gestiona todos los recibos generados.
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        sx={{
                            borderRadius: 3,
                            boxShadow: 3,
                            transition: "transform 0.3s",
                            "&:hover": {
                                transform: "scale(1.05)",
                            },
                        }}
                    >
                        <CardActionArea
                            onClick={() => handleNavigation("/estadistica")}
                        >
                            <CardContent sx={{ textAlign: "center" }}>
                                <IconButton>
                                    <BarChartIcon fontSize="large" />
                                </IconButton>
                                <Typography variant="h6">Estadística</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Visualiza los reportes y estadísticas de tu negocio.
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
};

export default Home;
