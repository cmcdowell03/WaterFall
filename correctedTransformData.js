
function transformData(jsonData, startDate, endDate, timeframe) {
    const dataMap = new Map();
    let totalIssues = 0, resolvedIssues = 0;

    const groupByFunction = {
        daily: date => date.toISOString().split('T')[0],
        workweek: getWeekNumber,
        quarterly: date => date.getUTCFullYear() + '-Q' + (Math.floor(date.getMonth() / 3) + 1)
    }[timeframe];

    // ... (rest of the function remains the same)
}
