
function transformData(jsonData, startDate, endDate, timeframe) {
    const dataMap = new Map();
    let totalIssues = 0, resolvedIssues = 0;

    // Determine the grouping function based on the timeframe
    const groupByFunction = {
        daily: date => date.toISOString().split('T')[0],
        workweek: getWeekNumber,
        quarterly: date => `${date.getUTCFullYear()}-Q${Math.floor(date.getMonth() / 3) + 1}`
    }[timeframe];

    // Process and group the issues
    jsonData.forEach(issue => {
        const targetEnd = new Date(issue.fields.targetEnd);
        const resolution = issue.fields.resolution ? new Date(issue.fields.resolution) : null;

        if (targetEnd >= startDate && targetEnd <= endDate) {
            totalIssues++;
            if (resolution && resolution <= endDate) {
                resolvedIssues++;
            }
        }

        const targetEndGroup = groupByFunction(targetEnd);
        const resolutionGroup = resolution ? groupByFunction(resolution) : null;

        // Initialize the group entries if not present
        if (!dataMap.has(targetEndGroup)) {
            dataMap.set(targetEndGroup, { targetEnd: 0, resolution: 0 });
        }
        if (resolutionGroup && !dataMap.has(resolutionGroup)) {
            dataMap.set(resolutionGroup, { targetEnd: 0, resolution: 0 });
        }

        // Accumulate the counts
        dataMap.get(targetEndGroup).targetEnd += 1;
        if (resolutionGroup) {
            dataMap.get(resolutionGroup).resolution += 1;
        }
    });

    // Sort the groups and prepare the data array
    const sortedGroups = Array.from(dataMap.keys()).sort();
    const dataArray = [['Group', 'Cumulative Target End - Bars', 'Cumulative Target End - Line', 'Cumulative Resolution - Bars', 'Cumulative Resolution - Line', 'Gap to Target', 'Unresolved Issues']];    
    let cumulativeTargetEnd = 0;
    let cumulativeResolution = 0;

    sortedGroups.forEach(group => {
        const groupData = dataMap.get(group);
        cumulativeTargetEnd += groupData.targetEnd;
        cumulativeResolution += groupData.resolution || 0;

        // Calculate the difference between the Cumulative Target End and the Cumulative Resolution
        const gapToTarget = cumulativeTargetEnd - cumulativeResolution;

        // Calculate the total unresolved issues as a burndown from the total sum
        const unresolvedIssues = totalIssues - cumulativeResolution;

        dataArray.push([group, cumulativeTargetEnd, cumulativeTargetEnd, cumulativeResolution, cumulativeResolution, gapToTarget, unresolvedIssues]);
    });

    return {
        chartData: dataArray,
        statistics: {
            totalIssues: totalIssues,
            resolvedIssues: resolvedIssues,
            unresolvedIssues: totalIssues - resolvedIssues
        }
    };
}
