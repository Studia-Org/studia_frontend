import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { useTranslation } from 'react-i18next';
export const ActivityDetailChart = ({ data }) => {
    const { t } = useTranslation();
    const dataEntries = Object.entries(data);

    // Extraer los nombres y las calificaciones para las categorías y los datos del gráfico
    const categories = dataEntries.map(([name]) => name);
    const chartData = dataEntries.map(([name, qualification]) => parseFloat(qualification));


    const series = [{
        name: t("DASHBOARD.activity_average"),
        data: chartData
    }]
    const options = {
        chart: {
            type: 'bar',
            height: 350
        },
        plotOptions: {
            bar: {
                horizontal: true,
                colors: {
                    ranges: [{
                        from: 0,
                        to: 5,
                        color: '#60a5fa',
                    }, {
                        from: 5.01,
                        to: 8,
                        color: '#2563eb',
                    }, {
                        from: 8.01,
                        to: 10,
                        color: '#1e40af',
                    }]
                },
            }
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: categories
        },
        yaxis: {
            max: 10
        }
    }

    return (
        <>
            <p className="mb-1 text-lg font-medium">{t("DASHBOARD.activities_average")}</p>
            <p className="pb-5 text-sm font-normal text-gray-600">{t("DASHBOARD.compare_activity")}</p>
            <div id="chart">
                <ReactApexChart options={options} series={series} type="bar" height={350} />
            </div>
        </>
    )
}
