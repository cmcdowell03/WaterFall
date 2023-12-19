
function fetchData(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = event => {
            try {
                const jsonData = JSON.parse(event.target.result);
                resolve(jsonData);
            } catch (error) {
                reject('Error parsing JSON data: ' + error.message);
            }
        };
        reader.onerror = error => reject('File reading error: ' + error.message);
        reader.readAsText(file);
    });
}
