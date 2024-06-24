async function fetchLocation(userInput) {
    const url = `http://xmlopen.rejseplanen.dk/bin/rest.exe/location?input=${encodeURIComponent(userInput)}&format=json`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        console.log(`Results for ${userInput}:`, data);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

async function fetchAllLocations() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const inputs = [];

    // Generate combinations of letters (this is a simplified example)
    for (let i = 0; i < alphabet.length; i++) {
        for (let j = 0; j < alphabet.length; j++) {
            inputs.push(alphabet[i] + alphabet[j]);
        }
    }

    // Generate combinations of numbers
    for (let i = 0; i < numbers.length; i++) {
        for (let j = 0; j < numbers.length; j++) {
            inputs.push(numbers[i] + numbers[j]);
        }
    }

    // Add common road prefixes/suffixes if necessary
    const prefixes = ['vej', 'gade', 'alle', 'boulevard', 'stræde'];
    for (let prefix of prefixes) {
        for (let input of inputs) {
            await fetchLocation(input + prefix);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchAllLocations();
});
