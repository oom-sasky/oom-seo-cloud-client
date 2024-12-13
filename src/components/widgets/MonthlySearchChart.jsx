import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler } from 'chart.js';

// Register necessary components with ChartJS
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler
);

const MonthlySearchChart = ({ monthlySearchVolumes, onClick, changeDisplay = false }) => {
    // Map data to chart format
    const labels = monthlySearchVolumes.map(item => `${item.month} ${item.year}`);
    const dataValues = monthlySearchVolumes.map(item => parseInt(item.monthly_searches));

    // State to track if the chart has been clicked
    const [isClicked, setIsClicked] = useState(false);

    // Sync `isClicked` state with the `changeDisplay` prop
    useEffect(() => {
        setIsClicked(changeDisplay);
    }, [changeDisplay]);

    // Handle chart click
    const handleChartClick = (e) => {
        e.stopPropagation(); // Prevent the click event from propagating to parent elements
        setIsClicked(!isClicked); // Toggle the click state
        if (onClick) onClick();  // Call the passed onClick handler
    };

     // Function to calculate the percentage change
    //  const calculateThreeMonthChange = (index) => {
    //     if (index < 3) return null;  // No 3-month change available for the first three months
    //     const previousValue = dataValues[index - 3];
    //     const currentValue = dataValues[index];
    //     const change = ((currentValue - previousValue) / previousValue) * 100;
    //     return change.toFixed(2);  // Return the percentage change (2 decimal places)
    // };

    // Map 3-month change data
    // const percentageChanges = dataValues.map((_, index) => calculateThreeMonthChange(index));

    // Chart configuration
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Monthly Search Volume',
                data: dataValues,
                borderColor: 'rgba(0, 102, 255, 1)',       // Dark blue line color
                backgroundColor: 'rgba(0, 102, 255, 0.2)',  // Light blue fill color with 20% opacity
                borderWidth: 2,  // Adjusted line thickness
                fill: 'origin',  // Explicitly fill from the line to the x-axis
                pointRadius: changeDisplay && isClicked ? 3 : 0,  // Show points only if clicked
            },
        ],
    };

    // Chart options with conditional interaction based on isClicked
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
            tooltip: {
                enabled: changeDisplay ? isClicked : false,  // Enable tooltips only when clicked
            },
        },
        scales: {
            x: {
                display: changeDisplay ? isClicked : false,  // Display X axis only when clicked
            },
            y: {
                display: changeDisplay ? isClicked : false,  // Display Y axis only when clicked
                beginAtZero: true,
            },
        },
        interaction: {
            mode: isClicked ? 'nearest' : 'none',  // Enable hover interactions only when clicked
            intersect: isClicked,  // Only trigger interactions if hover intersects the line
        },
    };

    return (
        <div onClick={handleChartClick} style={{ cursor: 'pointer' }}>
            <Line data={data} options={options} />
        </div>
    );
};

export default MonthlySearchChart;