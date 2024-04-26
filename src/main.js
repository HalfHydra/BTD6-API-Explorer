locJSON = {}
achievementsJSON = {}

fetch('./data/English.json')
    .then(response => response.json())
    .then(data => {
        locJSON = data;
    })
    .catch(error => console.error('Error:', error));

fetch('./data/Achievements150.json')
    .then(response => response.json())
    .then(data => {
        achievementsJSON = data;
    })
    .catch(error => console.error('Error:', error));