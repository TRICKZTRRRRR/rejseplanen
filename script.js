async function fetchSuggestions(input, datalistId) {
    const baseURL = "http://xmlopen.rejseplanen.dk/bin/rest.exe";
    const url = `${baseURL}/location?input=${encodeURIComponent(input)}&format=json`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        updateDatalist(data, datalistId);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

function updateDatalist(data, datalistId) {
    const datalist = document.getElementById(datalistId);
    datalist.innerHTML = ''; // Clear previous suggestions

    if (data.LocationList.StopLocation) {
        data.LocationList.StopLocation.forEach(location => {
            const option = document.createElement('option');
            option.value = location.name;
            datalist.appendChild(option);
        });
    }

    if (data.LocationList.CoordLocation) {
        data.LocationList.CoordLocation.forEach(location => {
            const option = document.createElement('option');
            option.value = location.name;
            datalist.appendChild(option);
        });
    }

    if (data.LocationList.AddressLocation) {
        data.LocationList.AddressLocation.forEach(location => {
            const option = document.createElement('option');
            option.value = location.name;
            datalist.appendChild(option);
        });
    }
}

async function fetchLocation() {
    const baseURL = "http://xmlopen.rejseplanen.dk/bin/rest.exe";
    const startLocation = document.getElementById('startLocationInput').value;
    const stopLocation = document.getElementById('stopLocationInput').value;

    const startUrl = `${baseURL}/location?input=${encodeURIComponent(startLocation)}&format=json`;
    const stopUrl = `${baseURL}/location?input=${encodeURIComponent(stopLocation)}&format=json`;

    try {
        const startResponse = await fetch(startUrl);
        if (!startResponse.ok) {
            throw new Error('Network response for start location was not ok ' + startResponse.statusText);
        }
        const startData = await startResponse.json();

        const stopResponse = await fetch(stopUrl);
        if (!stopResponse.ok) {
            throw new Error('Network response for stop location was not ok ' + stopResponse.statusText);
        }
        const stopData = await stopResponse.json();

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
    const startLocationInput = document.getElementById('startLocationInput');
    const stopLocationInput = document.getElementById('stopLocationInput');
    const fetchDataButton = document.getElementById('fetchDataButton');

    startLocationInput.addEventListener('input', () => fetchSuggestions(startLocationInput.value, 'startSuggestions'));
    stopLocationInput.addEventListener('input', () => fetchSuggestions(stopLocationInput.value, 'stopSuggestions'));
    fetchDataButton.addEventListener('click', fetchLocation);
});
