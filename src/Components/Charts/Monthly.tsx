import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/es'; // Importar la localización en español

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

// Configurar dayjs para usar la localización en español
dayjs.locale('es');
dayjs.extend(localizedFormat);

// Registrando los componentes requeridos de chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlySalesChart: React.FC = () => {
    const [data, setData] = useState({
        labels: [] as string[],
        datasets: [] as {
            label: string;
            data: number[];
            backgroundColor: string[];
        }[],
    });
    const [loading, onLoading] = useState<boolean>(true)

    const token = localStorage.getItem("token") || undefined;

    const fetchData = async () => {
        if (token) {
            try {
                const response = await fetch(`${BACKEND_URL}/v1/stats/monthlysales`, {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: token,
                    },
                });
                const result = await response.json();

                // Obteniendo los nombres de los meses
                const labels = [
                    dayjs().subtract(1, 'month').format('MMMM').toUpperCase(), // Mes anterior en mayúsculas
                    dayjs().format('MMMM').toUpperCase(), // Mes actual en mayúsculas
                ];
                const counts = [result.data.lastMonth, result.data.actualMonth];

                setData({
                    labels,
                    datasets: [
                        {
                            label: 'Ventas mensuales',
                            data: counts,
                            backgroundColor: ['#4caf50', '#ff5722'],
                        },
                    ],
                });
                
            } catch (error) {
                console.error('Error fetching monthly sales data:', error);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if(data){
            onLoading(false)
        }
    }, [data])

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return loading ? <h2>No hay datos aún</h2>: <Bar data={data} options={options} />;
};

export default MonthlySalesChart;
