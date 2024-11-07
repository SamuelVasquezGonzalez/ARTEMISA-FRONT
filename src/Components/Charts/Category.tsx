import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

interface SalesByCategoryData {
    category: string[];
    totalQuantity: number;
}

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const SalesByCategoryChart: React.FC = () => {
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
                const response = await fetch(`${BACKEND_URL}/v1/stats/category`, {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: token
                    }
                });
                const result = await response.json();

                const salesData: SalesByCategoryData[] = result.data;

                if(salesData.length === 0) throw new Error(result.message)
    
                const labels = salesData.map(item => item.category[0]);
                const quantities = salesData.map(item => item.totalQuantity);
    
                setData({
                    labels,
                    datasets: [
                        {
                            label: 'Ventas',
                            data: quantities,
                            backgroundColor: [
                                '#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40',
                            ],
                        },
                    ],
                });
                onLoading(false)
            } catch (error) {
                console.error('Error fetching sales by category data:', error);
            }
        }
    };

    // useEffect(() => {
    //     if(data){
    //         
    //     }
    // }, [data])

    useEffect(() => {
        fetchData();
    }, []);

    const options = {
        responsive: true,
    };

    return loading ? <h2>No hay datos aún</h2>: <Pie data={data} options={options} />;
};

export default SalesByCategoryChart;
