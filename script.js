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

    if (data.LocationList && data.LocationList.StopLocation) {
        data.LocationList.StopLocation.forEach(location => {
            const option = document.createElement('option');
            option.value = location.name;
            datalist.appendChild(option);
        });
    }

    if (data.LocationList && data.LocationList.CoordLocation) {
        data.LocationList.CoordLocation.forEach(location => {
            const option = document.createElement('option');
            option.value = location.name;
            datalist.appendChild(option);
        });
    }

    if (data.LocationList && data.LocationList.AddressLocation) {
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

async function calculateTotalPrice() {
    const baseURL = "http://xmlopen.rejseplanen.dk/bin/rest.exe";
    const startLocation = document.getElementById('startLocationInput').value;
    const stopLocation = document.getElementById('stopLocationInput').value;
    const numberOfJourneys = parseInt(document.getElementById('numberOfJourneysInput').value) || 0;

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

        if (!startData.LocationList.StopLocation || !stopData.LocationList.StopLocation) {
            throw new Error('Could not find valid stop locations for the provided inputs.');
        }

        const startLocationId = startData.LocationList.StopLocation[0].id;
        const stopLocationId = stopData.LocationList.StopLocation[0].id;

        const tripUrl = `${baseURL}/trip?originId=${startLocationId}&destId=${stopLocationId}&format=json`;
        console.log(`Fetching trip data from: ${tripUrl}`);
        const tripResponse = await fetch(tripUrl);
        if (!tripResponse.ok) {
            throw new Error('Network response for trip was not ok ' + tripResponse.statusText);
        }
        const tripData = await tripResponse.json();
        console.log('Trip data:', tripData);

        if (!tripData.Trip || tripData.Trip.length === 0) {
            throw new Error('No trip data available');
        }

        const distance = tripData.Trip[0].Leg.reduce((total, leg) => total + (leg.distance || 0), 0);
        console.log('Total distance:', distance);
        const pricePerKm = 2; // Example price per km
        const totalPrice = distance * pricePerKm * numberOfJourneys;

        const totalPriceResult = document.getElementById('totalPriceResult');
        totalPriceResult.textContent = `Total Price: ${totalPrice} DKK\nTotal Distance: ${distance} km`;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('fetchDataButton').addEventListener('click', fetchLocation);
    document.getElementById('startLocationInput').addEventListener('input', () => fetchSuggestions(document.getElementById('startLocationInput').value, 'startSuggestions'));
    document.getElementById('stopLocationInput').addEventListener('input', () => fetchSuggestions(document.getElementById('stopLocationInput').value, 'stopSuggestions'));
    document.getElementById('calculatePriceButton').addEventListener('click', calculateTotalPrice);
});
