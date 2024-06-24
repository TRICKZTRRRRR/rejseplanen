async function fetchLocation() {
    const userInput = "Telegrafvej"; // Example input
    const url = `http://xmlopen.rejseplanen.dk/bin/rest.exe/location?input=${encodeURIComponent(userInput)}&format=json`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchLocation();
});
