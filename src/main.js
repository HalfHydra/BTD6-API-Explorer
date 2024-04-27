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

const container = document.createElement('div');
container.id = 'container';
document.body.appendChild(container);

document.body.classList.add('hex-bg');

const header = document.createElement('div');
header.id = 'header';
header.classList.add('header');
container.appendChild(header);

const headerDiv = document.createElement('div');
headerDiv.id = 'header-div';
headerDiv.classList.add('header-div');
header.appendChild(headerDiv);

const title = document.createElement('h1');
title.id = 'title';
title.classList.add('title');
title.classList.add('black-outline');
title.innerHTML = 'Bloons TD 6 OAK Tool';
headerDiv.appendChild(title);

// const titleImg = document.createElement('img');
// titleImg.id = 'title-img';
// titleImg.classList.add('title-img');
// titleImg.src = './Assets/UI/TitleContainer.png';
// headerDiv.appendChild(titleImg);

const headerContainer = document.createElement('div');
headerContainer.id = 'header';
headerContainer.classList.add('header-container');
header.appendChild(headerContainer);

let headers = ['Overview', 'Inventory', 'Achievements', 'Maps', 'Settings'];

headers.forEach((headerName) => {
    let headerElement = document.createElement('p');
    headerElement.classList.add('header-label');
    headerElement.classList.add('black-outline');
    headerElement.id = headerName.toLowerCase();
    headerElement.innerHTML = headerName;
    headerContainer.appendChild(headerElement);
})