const URL = 'https://api.jikan.moe/v4';
const NUMBER = 60000;
const imagePlace = document.querySelector('.image-place')
const generatorButton = document.querySelector('.generator-button')
const imageSection = document.querySelector('.image-section');
const filterBtn = document.querySelector('.filter-button');
const animeGenrerSelector = document.getElementById('anime-genres-select');

async function callApi(urlAPI) {
    try {
        const randomNumber = randomImageGenerator(NUMBER)
        const response = await fetch(`${urlAPI}/anime/${randomNumber}/full`)

        if(response.ok) {
            const data = await response.json();
            const objImg = data.data.images.webp.large_image_url;
            const objTitle = data.data.title;
            const objtSynopsis = data.data.synopsis || 'No Description Yet';
            hiddePreviousContainer();
            getImage(objImg, objTitle, objtSynopsis);
        } else {
            loadingImage()
            setTimeout(() => {
                callApi(URL);
            }, '3000')
        }
        
    } catch(error) {
        console.error(error)
    }
}

async function callApiWithQueryParams(urlAPI) {
    try {
        const response = await fetch(`${urlAPI}`);

        if(response.ok) {
            const data = await response.json();
            let filterResult = []
            for(let obj of data.data) {
                filterResult.push({img: obj.images.webp.large_image_url, title: obj.title, synopsis: obj.synopsis});
            }
            loadContentParams(filterResult);
            insertMoreResultsButton();
        }
    } catch(error) {
        console.error(error)
    }
}

const fillGenrerAnimesAPI = async (urlAPI) => {
    try {
        const response = await fetch(`${urlAPI}/genres/anime`);
        console.log(response)

        if(response.ok) {
            const data = await response.json();
            console.log(data)
            const objData = data.data;
            const hashGenrer = new Map();
            for(let obj of objData) {
                hashGenrer.set(`${obj.name}`, `${obj.mal_id}`);
            }
            return hashGenrer
        }
    } catch(error) {
        console.error(error);
    }
}

function randomImageGenerator(totalList) {  
    const randomNumber = Math.floor(Math.random() * totalList);
    return randomNumber
}

function loadingImage() {
    imageSection.innerHTML = `
    <div class="loading-image image-section__basic">
        <span>Loading Anime...</span>
        <img src="./assets/images/270-ring-with-bg.svg" alt="loading icon" >
    <div>`;
}

function getImage(imgSrc, objTitle, objtSynopsis) {
    imageSection.innerHTML = `
    <div class="anime-img-ok image-section__basic">
        <div class="anime-img-ok__info-container">
            <h2>${objTitle}</h2>
            <p class="info-container__synopsis">${objtSynopsis}</p>
        </div>
        <img class="anime-image" src="${imgSrc}" alt="Random anime image">
    </div>`;
}

function hiddePreviousContainer() {
    const previousElement = imageSection.firstElementChild;
    console.log(previousElement)
    previousElement.style.display = 'none';
}


// Load content with filter
async function filterAnime(page) {
    const animeFiltered = animeGenrerSelector.value;
    const getGenrerId = await fillGenrerAnimesAPI(URL);
    console.log(getGenrerId)
    const APIurl = URL;
    const queryParams = `${APIurl}/anime?genres=${getGenrerId.get(`${animeFiltered}`)}&page=${page || 1}&limit=10`;
    console.log(queryParams)
    callApiWithQueryParams(queryParams);
}

function loadContentParams(filterResult) {
    for(let i = 0; i < filterResult.length; i++) {
        const div = document.createElement('div');
        div.classList.add('anime-img-ok', 'image-section__basic');
        div.innerHTML = `
        <div class="anime-img-ok__info-container">
            <h2>${filterResult[i].title}</h2>
            <p class="info-container__synopsis">${filterResult[i].synopsis}</p>
        </div>
        <img class="anime-image" src="${filterResult[i].img}" alt="Random anime image">`;
        imageSection.appendChild(div);
    }
}

function insertMoreResultsButton() {
    const button = document.createElement('button');
    button.classList.add('load-more-content-btn');
    button.textContent = `Load More Results`;
    imageSection.appendChild(button);
}

let counter;
function loadNewPageContent() {
    counter === undefined ? counter = 2 : counter++;
    filterAnime(counter);
}

// Events
generatorButton.addEventListener('click', () => {
    callApi(URL)
});

filterBtn.addEventListener('click', () => {
   filterAnime();
});

imageSection.addEventListener('click', (event) => {
    if(event.target.className === 'load-more-content-btn') {
        loadNewPageContent();
    }
})