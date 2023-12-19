
function transformData(jsonData, startDate, endDate, timeframe) {
    const dataMap = new Map();
    let totalIssues = 0, resolvedIssues = 0;

    const groupByFunction = {
        daily: date => date.toISOString().split('T')[0],
        workweek: getWeekNumber,
        quarterly: date => \`\${date.getUTCFullYear()}-Q\${Math.floor(date.getMonth() / 3) + 1}\`
    }[timeframe];

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

        if (!dataMap.has(targetEndGroup)) {
            dataMap.set(targetEndGroup, { targetEnd: 0, resolution: 0 });
        }
        if (resolutionGroup && !dataMap.has(resolutionGroup)) {
            dataMap.set(resolutionGroup, { targetEnd: 0, resolution: 0 });
        }

        dataMap.get(targetEndGroup).targetEnd += 1;
        if (resolutionGroup) {
            dataMap.get(resolutionGroup).resolution += 1;
        }
    });

    const sortedGroups = Array.from(dataMap.keys()).sort();
    const dataArray = [['Group', 'Cumulative Target End - Bars', 'Cumulative Resolution - Bars', 'Gap to Target', 'Unresolved Issues']];    
    let cumulativeTargetEnd = 0;
    let cumulativeResolution = 0;

    sortedGroups.forEach(group => {
        const groupData = dataMap.get(group);
        cumulativeTargetEnd += groupData.targetEnd;
        cumulativeResolution += groupData.resolution || 0;
        const gapToTarget = cumulativeTargetEnd - cumulativeResolution;
        const unresolvedIssues = totalIssues - cumulativeResolution;
        dataArray.push([group, cumulativeTargetEnd, cumulativeResolution, gapToTarget, unresolvedIssues]);
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

function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return \`\${d.getUTCFullYear()}-W\${weekNo.toString().padStart(2, '0')}\`;
}
