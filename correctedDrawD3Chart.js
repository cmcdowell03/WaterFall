
async function drawD3Chart(startDate, endDate, timeframe, jsonData) {
    // ... (previous code remains unchanged)

    // Corrected part of the function
    const svg = d3.select("#d3_chart_div")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    // ... (rest of the function remains the same)
}
