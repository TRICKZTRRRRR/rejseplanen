async function fetchLocation() {
    const baseURL = "http://xmlopen.rejseplanen.dk/bin/rest.exe";
    const startLocation = document.getElementById('startLocationInput').value; // Get start location input
    const stopLocation = document.getElementById('stopLocationInput').value; // Get stop location input

    // Construct URLs for both start and stop locations
    const startUrl = `${baseURL}/location?input=${encodeURIComponent(startLocation)}&format=json`;
    const stopUrl = `${baseURL}/location?input=${encodeURIComponent(stopLocation)}&format=json`;

    try {
        // Fetch data for start location
        const startResponse = await fetch(startUrl);
        if (!startResponse.ok) {
            throw new Error('Network response for start location was not ok ' + startResponse.statusText);
        }
        const startData = await startResponse.json();

        // Fetch data for stop location
        const stopResponse = await fetch(stopUrl);
        if (!stopResponse.ok) {
            throw new Error('Network response for stop location was not ok ' + stopResponse.statusText);
        }
        const stopData = await stopResponse.json();

        // Display both start and stop data
        displayData(startData, stopData);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

function displayData(startData, stopData) {
    const resultElement = document.getElementById('result');
    resultElement.textContent = `Start Location Data: ${JSON.stringify(startData, null, 2)}\n\nStop Location Data: ${JSON.stringify(stopData, null, 2)}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const fetchDataButton = document.getElementById('fetchDataButton');
    fetchDataButton.addEventListener('click', fetchLocation);
});
