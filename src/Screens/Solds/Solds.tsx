import React, { useEffect, useState } from "react";
import { ISales } from "../../Components/Cart/CartLink";
import { getData } from "../../Service/Api";
import dayjs from "dayjs";
import {
    Box,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    IconButton,
    TextField,
} from "@mui/material";
import ReciboCard from "../../Components/ReciboCard/ReciboCard";
import SortIcon from "@mui/icons-material/Sort";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import Navbar from "../../Components/Navbar/Navbar";

const Solds: React.FC = () => {
    const [recibos, setRecibos] = useState<ISales[]>([]);
    const [filteredRecibos, setFilteredRecibos] = useState<ISales[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [price, setPrice] = useState<number | string>("");
    const [consecutivo, setConsecutivo] = useState<number | string>("");
    const [orderAsc, setOrderAsc] = useState<boolean>(true);
    const [showTotal, setShowTotal] = useState<boolean>(false); // Estado para mostrar/ocultar el total

    const token = localStorage.getItem("token") || undefined;

    const getRecibos = async () => {
        const response = await getData({ token, path: "/v1/sales/all" });

        if (!response.ok) {
            console.log(response);
        } else {
            setRecibos(response.data as ISales[]);
            setFilteredRecibos(response.data as ISales[]);
        }
    };

    useEffect(() => {
        getRecibos();
    }, []);

    // Filtrar recibos según los criterios seleccionados
    useEffect(() => {
        let filtered = [...recibos];

        // Filtrar por fecha
        if (selectedDate) {
            filtered = filtered.filter((recibo) => {
                const createdDate = dayjs(recibo.created);
                return createdDate.isSame(dayjs(selectedDate), 'day');
            });
        }

        // Filtrar por precio
        if (price) {
            filtered = filtered.filter((recibo) => recibo.totalPrice === Number(price));
        }
 
        // Filtrar por consecutivo
        if (consecutivo) {
            filtered = filtered.filter((recibo) => recibo.consecutive === Number(consecutivo));
        }

        setFilteredRecibos(filtered);
    }, [selectedDate, price, consecutivo, recibos]);

    // Función de ordenación
    const sortRecibos = (a: ISales, b: ISales) => {
        const dateComparison = new Date(b.created).getTime() - new Date(a.created).getTime();
        if (dateComparison !== 0) return dateComparison; // Primero por fecha
        return orderAsc ? a.consecutive - b.consecutive : b.consecutive - a.consecutive; // Luego por consecutivo
    };

    // Ordenar los recibos según el estado de orderAsc
    const sortedRecibos = [...filteredRecibos].sort(sortRecibos);
    
    // Agrupar recibos por fecha
    const groupByDate = (sales: ISales[]) => {
        const grouped: { [key: string]: ISales[] } = {};

        sales.forEach((sale) => {
            const date = dayjs(sale.created).format("YYYY-MM-DD");
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(sale);
        });

        return grouped;
    };

    const groupedRecibos = groupByDate(sortedRecibos);

    // Ordenar las fechas en orden descendente
    const sortedDates = Object.keys(groupedRecibos).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    // Calcular el total de todos los recibos
    const total = filteredRecibos.reduce((acc, recibo) => acc + recibo.totalPrice, 0);

    return (
        <>
            <Navbar />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ padding: "16px", marginTop: "80px" }}>
                    {/* Filtros */}
                    <Box sx={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                        {/* Filtro por fecha */}
                        <DesktopDatePicker
                            label="Selecciona una fecha"
                            inputFormat="DD/MM/YYYY"
                            value={selectedDate}
                            onChange={(newValue) => setSelectedDate(newValue)}
                            renderInput={(params) => <TextField {...params} />}
                        />

                        {/* Filtro por precio */}
                        <TextField
                            label="Precio"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />


                        {/* Filtro por consecutivo */}
                        <TextField
                            label="Consecutivo"
                            type="number"
                            value={consecutivo}
                            onChange={(e) => setConsecutivo(e.target.value)}
                        />

                        {/* Ordenar por precio */}
                        <IconButton onClick={() => setOrderAsc(!orderAsc)} aria-label="toggle order">
                            <SortIcon />
                            {orderAsc ? "Ascendente" : "Descendente"}
                        </IconButton>
                    </Box>

                    {/* Mostrar los recibos agrupados por fecha en orden descendente */}
                    {sortedDates.map((date) => (
                        <Box key={date} sx={{ marginBottom: "24px" }}>
                            <Typography variant="h5" gutterBottom>
                                {dayjs(date).format("DD/MM/YYYY")}
                            </Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                                {groupedRecibos[date].map((recibo) => (
                                    <ReciboCard key={recibo._id} recibo={recibo} />
                                ))}
                            </Box>
                        </Box>
                    ))}
                </Box>

                {/* Div flotante para mostrar el total de recibos */}
                <Box
                    sx={{
                        position: "fixed",
                        bottom: 16,
                        right: 16,
                        backgroundColor: "white",
                        boxShadow: 2,
                        padding: "8px 16px",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <IconButton onClick={() => setShowTotal(!showTotal)}>
                        {showTotal ? <VisibilityOff /> : <Visibility />}
                    </IconButton>

                    <Typography variant="body1" sx={{ marginLeft: 1 }}>
                            Total vendido: ${showTotal ? total.toLocaleString(): "**********"}
                        </Typography>
                </Box>
            </LocalizationProvider>
        </>
    );
};

export default Solds;
