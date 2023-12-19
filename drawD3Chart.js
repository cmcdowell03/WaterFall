
async function drawD3Chart(startDate, endDate, timeframe, jsonData) {
    if (!jsonData) {
        console.error('No data provided to draw the D3 chart.');
        return;
    }

    try {
        const transformedData = transformData(jsonData, startDate, endDate, timeframe);
        const d3Data = transformedData.chartData.slice(1).map(d => ({
            group: d[0],
            value: d[1]
        }));

        if (!d3Data.length) {
            console.error('No valid data available for D3 chart');
            return;
        }

        d3.select("#d3_chart_div").selectAll("*").remove();

        const margin = {top: 20, right: 20, bottom: 30, left: 40},
              width = 960 - margin.left - margin.right,
              height = 500 - margin.top - margin.bottom;

        const svg = d3.select("#d3_chart_div")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", \`translate(\${margin.left}, \${margin.top})\`);

        const xScale = d3.scaleBand()
            .range([0, width])
            .padding(0.1)
            .domain(d3Data.map(d => d.group));

        const yScale = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(d3Data, d => d.value)]);

        svg.append("g")
            .attr("transform", \`translate(0,\${height})\`)
            .call(d3.axisBottom(xScale));

        svg.append("g")
            .call(d3.axisLeft(yScale));

        svg.selectAll(".bar")
            .data(d3Data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.group))
            .attr("width", xScale.bandwidth())
            .attr("y", d => yScale(d.value))
            .attr("height", d => height - yScale(d.value))
            .attr("fill", "steelblue");
    } catch (error) {
        console.error('Error in rendering D3 Chart:', error);
    }
}
