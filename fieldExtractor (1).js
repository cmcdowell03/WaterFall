
function readFileAndInterpretFields(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function(event) {
            const content = event.target.result;
            
            try {
                if (isJson(content)) {
                    const fields = extractJsonFields(JSON.parse(content));
                    resolve(fields);
                } else if (isCsv(content)) {
                    const fields = extractCsvFields(content);
                    resolve(fields);
                } else {
                    throw new Error("Unsupported file format");
                }
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = function() {
            reject(reader.error);
        };

        reader.readAsText(file);
    });
}

function isJson(content) {
    try {
        JSON.parse(content);
        return true;
    } catch (e) {
        return false;
    }
}

function isCsv(content) {
    // Simple check for CSV format
    return content.includes(",") && content.includes("\n");
}

function extractJsonFields(json) {
    if (Array.isArray(json) && json.length > 0) {
        return Object.keys(json[0]);
    }
    return [];
}

function extractCsvFields(csv) {
    const firstLine = csv.split("\n")[0];
    return firstLine.split(",");
}
