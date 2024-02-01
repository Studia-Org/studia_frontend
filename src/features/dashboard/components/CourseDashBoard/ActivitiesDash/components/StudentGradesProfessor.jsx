import React from 'react'
import ReactApexChart from 'react-apexcharts'

export const StudentGradesProfessor = ({ data }) => {
    console.log(data)

    const dataEntries = Object.entries(data);

    // Extraer los nombres y las calificaciones para las categorías y los datos del gráfico
    const categories = dataEntries.map(([name]) => name);
    const chartData = dataEntries.map(([name, qualification]) => parseFloat(qualification));
    const average = (chartData.reduce((sum, value) => sum + value, 0) / chartData.length).toFixed(2);
    const finalChartData = []

    chartData.forEach((value, index) => {
        let chartInfo = {
            x: categories[index],
            y: value,
            goals: [
                {
                    name: 'Student average',
                    value: average,
                    strokeHeight: 2,
                    strokeDashArray: 2,
                    strokeColor: 'red'
                }
            ]
        }
        finalChartData.push(chartInfo)
    })
    const series = [{
        name: 'Grades',
        data: finalChartData
    }];


    const options = {
        chart: {
            height: 350,
            type: 'bar',
        },
        plotOptions: {
            bar: {
                columnWidth: '45%',
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
            },
        },
        dataLabels: {
            enabled: false
        },
        legend: {
            show: false,
        },
        yaxis: {
            max: 10,
        },
        xaxis: {
            categories: categories,
        }
    };

    return (
        <>
            <p className="mb-1 text-lg font-medium">Students average</p>
            <p className="pb-5 text-sm font-normal text-gray-600">Check how are your students progressing on the course.</p>
            <div id="chart">
                <ReactApexChart options={options} series={series} type="bar" height={350} />
            </div>
            <div id="html-dist"></div>
        </>
    )
}
