import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

// Interfaz para los datos de ventas por tipo de pago
interface SalesByPaymentTypeData {
    _id: string; // Tipo de pago (por ejemplo, "Efectivo" o "Transferencia")
    count: number; // Cantidad de ventas
}

// Registrando componentes necesarios de chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const SalesByPaymentTypeChart: React.FC = () => {
    const [data, setData] = useState<{
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            backgroundColor: string[];
        }[];
    }>({
        labels: [],
        datasets: [],
    });
    const [loading, onLoading] = useState<boolean>(true)

    const token = localStorage.getItem("token") || undefined
 
    const fetchData = async () => {
        if(token){
            try {
                const response = await fetch(`${BACKEND_URL}/v1/stats/payments`, {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: token
                    }
                });
                const result = await response.json();
    
                // Tipar result.data como un arreglo de SalesByPaymentTypeData
                const paymentData: SalesByPaymentTypeData[] = result.data;
    
                if(paymentData.length === 0) throw new Error(result.message)

                const labels = paymentData.map(item => item._id); // Obtener el tipo de pago
                const counts = paymentData.map(item => item.count); // Obtener la cantidad
    
                setData({
                    labels,
                    datasets: [
                        {
                            label: 'Sales by Payment Type',
                            data: counts,
                            backgroundColor: ['#3f51b5', '#e91e63', '#00bcd4', '#ff9800'],
                        },
                    ],
                });
                onLoading(false)
            } catch (error) {
                console.error('Error fetching sales by payment type data:', error);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const options = {
        responsive: true,
    };

    return loading ? <h2>No hay datos aún</h2>: <Doughnut data={data} options={options} />;
};

export default SalesByPaymentTypeChart;
