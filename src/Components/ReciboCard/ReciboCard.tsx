import React, { useState } from "react";
import { Card, CardContent, Typography, Button, Collapse, List, ListItem, ListItemText, Divider } from "@mui/material";
import { ISales } from "../../Components/Cart/CartLink";
import dayjs from "dayjs";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface ReciboCardProps {
    recibo: ISales;
}

const ReciboCard: React.FC<ReciboCardProps> = ({ recibo }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    return (
        <Card
            sx={{
                marginBottom: "16px",
                width: "100%",
                maxWidth: "320px",
                backgroundColor: "#f5f5f5",
                borderRadius: 2,
                boxShadow: 4,
            }}
        >
            <CardContent
                sx={{
                    // Centramos solo en pantallas de 400px o menos
                    "@media (max-width: 400px)": {
                        textAlign: "center", // Centra los textos principales
                    },
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Recibo #{recibo.consecutive || recibo._id}
                </Typography>
                <Typography variant="body1">
                    Total: ${recibo.totalPrice.toLocaleString()}
                </Typography>
                <Typography variant="body1">
                    Método de pago: {recibo.payType}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Fecha: {dayjs(recibo.created).format("DD/MM/YYYY")}
                </Typography>
                
                {/* Condición correcta para moneyReturned */}
                {recibo.moneyReturned && recibo.moneyReturned > 0 ? (
                    <Typography variant="body2" color="textSecondary">
                        Cambio devuelto: ${recibo.moneyReturned.toLocaleString()}
                    </Typography>
                ) : null}

                {/* Botón para expandir/colapsar */}
                <Button
                    onClick={toggleExpand}
                    variant="text"
                    endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    sx={{ width: "100%" }}
                >
                    {expanded ? "Ocultar productos" : "Ver productos"}
                </Button>

                {/* Contenedor colapsable para los productos */}
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <List
                        sx={{
                            // Textos de productos NO deben estar centrados
                            textAlign: "left",
                        }}
                    >
                        {recibo.products.map((product) => (
                            <React.Fragment key={product._id}>
                                <ListItem>
                                    <ListItemText
                                        primary={`${product.name} (x${product.quantity})`}
                                        secondary={`Precio unitario: $${product.price?.toLocaleString()}`}
                                    />
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                </Collapse>
            </CardContent>
        </Card>
    );
};

export default ReciboCard;
