import React from 'react'
import ReactApexChart from 'react-apexcharts'

export const ActivityDetailChart = ({ data }) => {
    const dataEntries = Object.entries(data);

    // Extraer los nombres y las calificaciones para las categorías y los datos del gráfico
    const categories = dataEntries.map(([name]) => name);
    const chartData = dataEntries.map(([name, qualification]) => parseFloat(qualification));

    console.log(categories, chartData)

    const series = [{
        name: 'Grade',
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
            <p className="mb-1 text-lg font-medium">Activity average</p>
            <p className="pb-5 text-sm font-normal text-gray-600">Compare all the activities average.</p>
            <div id="chart">
                <ReactApexChart options={options} series={series} type="bar" height={350} />
            </div>
        </>
    )
}
