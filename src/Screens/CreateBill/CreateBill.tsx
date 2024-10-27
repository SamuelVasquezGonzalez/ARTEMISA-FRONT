import React, { useEffect, useState } from "react";
import { ISales, PayType } from "../../Components/Cart/CartLink";
import { useProducts } from "../../ProductContext";
import {
    Container,
    Typography,
    Button,
    Box,
    Alert,
    Card,
    CardContent,
    CardMedia,
    Divider,
    TextField,
} from "@mui/material";
import { MoneyOff, Payment, CreditCard } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import { sendData } from "../../Service/Api";
import toast, { Toaster } from "react-hot-toast";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

const ReceiptPage = () => {
    const { productsState, clearProducts } = useProducts();
    const [payType, setPayType] = useState<PayType>("Efectivo");
    const [amountReceived, setAmountReceived] = useState<number | null>(null);
    const [receipt, setReceipt] = useState<ISales | null>(null);
    const [isSaved, setIsSaved] = useState<boolean>(true);
    const [lastConsecutive, setLastConsecutive] = useState<number>(0);
    const [countdown, setCountdown] = useState<number | null>(null);
    const navigate = useNavigate();

    const token = localStorage.getItem("token") || undefined;
    const success = (message: string) => toast.success(message);
    const error = (message: string) => toast.error(message);

    const handleContinue = () => {
        const changeToReturn =
            (amountReceived && amountReceived - productsState.totalPrice) || 0;
        const receiptData = {
            totalPrice: productsState.totalPrice,
            created: new Date(),
            payType,
            products: productsState.products,
            moneyReturned: changeToReturn,
        };
        setReceipt(receiptData);
       
    };


    useEffect(() => {
        if(receipt?.products && receipt?.products.length > 0){
            handleSubmit();
        }
    }, [receipt])

    const changeToReturn =
        amountReceived && amountReceived - productsState.totalPrice;

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "") {
            setAmountReceived(null);
        } else {
            setAmountReceived(parseFloat(value) || null);
        }
    };

    const handleSubmit = async () => {
        const response = await sendData({ token, path: "/v1/sales", body: { saleData: receipt } });

        if (response.ok) {
            success("Se ha guardado esta venta");
            setIsSaved(true);
            startCountdown();
        } else {
            error("No pudimos guardar esta venta");
        }
    };

    const startCountdown = () => {
        let seconds = 3;
        setCountdown(seconds);
        const interval = setInterval(() => {
            seconds -= 1;
            setCountdown(seconds);
            if (seconds === 0) {
                clearInterval(interval);
                clearProducts();
                navigate("/recibos");
            }
        }, 1000);
    };
    const getLastConsecutive = async () => {
        if (token) {
            try {
                const response = await fetch(`${BACKEND_URL}/v1/sales/last`, {
                    method: 'GET',
                    headers: {
                        authorization: token,
                        'Content-Type': 'application/json',
                    },
                });
    
                const data = await response.json();
    
                console.log(data);
                if (response.ok) {
                    const lastConsecutive = data.data.consecutive;
                    setLastConsecutive(lastConsecutive);
                } else {
                    console.error('Error en la respuesta:', data);
                }
            } catch (error) {
                console.error('Error en el fetch:', error);
            }
        }
    };
    
    
    useEffect(() => {
        getLastConsecutive();
        setIsSaved(false);
    }, []);

    const isAmountValid =
        amountReceived !== null &&
        amountReceived >= productsState.totalPrice;

    if (productsState.products.length === 0) {
        return (
            <Typography variant="h6">
                No hay productos en el carrito.
            </Typography>
        );
    }

    return (
        <>
            <Navbar />
            <Container maxWidth="md" style={{ marginTop: 70 }}>
                <Typography fontWeight={"bold"} variant="h4" gutterBottom align="center">
                    Generar Recibo #{lastConsecutive + 1}
                </Typography>

                <Box mb={2} display="flex" justifyContent="center">
                    <Typography variant="h6">
                        Total a pagar: ${productsState.totalPrice.toLocaleString()}
                    </Typography>
                </Box>

                <Box mb={2} display="flex" justifyContent="center" flexWrap={"wrap"}>
                    {[
                        { type: "Transferencia", icon: <Payment /> },
                        { type: "Efectivo", icon: <MoneyOff /> },
                        { type: "Tarjeta", icon: <CreditCard /> },
                    ].map(({ type, icon }) => (
                        <Button
                            key={type}
                            variant={payType === type ? "contained" : "outlined"}
                            disabled={isSaved}
                            color="primary"
                            onClick={() => setPayType(type as PayType)}
                            style={{ margin: "0 5px", display: 'flex', alignItems: 'center' }}
                        >
                            {icon}
                            <Typography variant="body1" style={{ marginLeft: 5 }}>
                                {type}
                            </Typography>
                        </Button>
                    ))}
                </Box>

               

                {payType === "Efectivo" && (
                    <Box mb={2}>
                        <TextField
                            label="Ingrese el dinero dado por el cliente"
                            type="number"
                            value={amountReceived || ""}
                            onChange={handleAmountChange}
                            fullWidth
                        />
                        {amountReceived !== null &&
                            amountReceived < productsState.totalPrice && (
                                <Alert severity="error">
                                    El monto recibido no puede ser menor al total.
                                </Alert>
                            )}
                        {amountReceived !== null &&
                            amountReceived > productsState.totalPrice && (
                                <Typography>
                                    Cambio a devolver: ${changeToReturn?.toLocaleString()}
                                </Typography>
                            )}
                    </Box>
                )}

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleContinue}
                    disabled={isSaved || !isAmountValid && payType === "Efectivo"}
                >
                    {isSaved ? "Ya se ha guardado este recibo" : "Continuar y generar recibo"}
                </Button>

                {countdown !== null && (
                    <Typography variant="h6" align="center" color="error">
                        Serás redirigido en {countdown} segundos...
                    </Typography>
                )}


                <Divider style={{ margin: "20px 0" }} />

                {/* Lista de productos a facturar */}
                <Box display="flex" overflow="auto" marginTop={2}>
                    {productsState.products.map((product) => (
                        <Card
                            key={product._id}
                            style={{
                                marginRight: 10,
                                minWidth: 80,
                                maxWidth: 100,
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="70"
                                image={product?.picture?.url}
                                alt={product.name}
                            />
                            <CardContent>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {product.name}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.primary"
                                >
                                    ${product?.price && product?.price.toLocaleString()} x {product.quantity}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                {receipt && (
                    <>
                        <Divider style={{ margin: "20px 0" }} />
                        <Box
                            padding={2}
                            border={1}
                            borderColor="grey.300"
                            borderRadius={2}
                            marginBottom={"80px"}
                        >
                            <Typography variant="h5" align="center">
                                Recibo
                            </Typography>
                            <Typography align="center">
                                Consecutivo: #{lastConsecutive + 1}
                            </Typography>
                            <Typography align="center">
                                Fecha: {receipt.created.toLocaleDateString()}{" "}
                                {receipt.created.toLocaleTimeString()}
                            </Typography>
                            <Box mt={2}>
                                {receipt.products.map((product) => (
                                    <Box
                                        key={product._id}
                                        display="flex"
                                        justifyContent="space-between"
                                        mb={1}
                                    >
                                        <Typography>{product.name}</Typography>
                                        <Typography>
                                            ${product?.price && product.price.toLocaleString()} x{" "}
                                            {product.quantity}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                            <Box
                                mt={2}
                                borderTop={1}
                                borderColor="grey.400"
                                pt={1}
                                display={"flex"}
                                flexDirection={"column"}
                                alignItems={"end"}
                            >
                                <Typography>
                                    <strong>Total: </strong>${receipt.totalPrice.toLocaleString()}
                                </Typography>
                                <Typography>
                                    <strong>Método de Pago: </strong>
                                    {receipt.payType}
                                </Typography>
                                {payType === "Efectivo" && (
                                    <>
                                        <Typography>
                                            <strong>Recibido: </strong>
                                            ${amountReceived?.toLocaleString()}
                                        </Typography>
                                        <Typography>
                                            <strong>Cambio a Devolver: </strong>
                                            ${changeToReturn?.toLocaleString()}
                                        </Typography>
                                    </>
                                )}
                            </Box>
                        </Box>
                    </>
                )}
                
                <Toaster />
            </Container>
        </>
    );
};

export default ReceiptPage;
