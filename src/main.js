const URL = 'https://api.jikan.moe/v4';
const NUMBER = 60000;
const imagePlace = document.querySelector('.image-place')
const generatorButton = document.querySelector('.generator-button')
const imageSection = document.querySelector('.image-section');

async function callApi(urlAPI) {
    try {
        const randomNumber = randomImageGenerator(NUMBER)
        const response = await fetch(`${urlAPI}/anime/${randomNumber}/full`)
        console.log(randomNumber)

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

generatorButton.addEventListener('click', () => {
    callApi(URL)
});