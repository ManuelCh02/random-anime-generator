const URL = 'https://api.jikan.moe/v4';
const imagePlace = document.querySelector('.image-place')
const generatorButton = document.querySelector('.generator-button')
const imageSection = document.querySelector('.image-section');

async function callApi(urlAPI) {
    try {
        const randomNumber = randomImageGenerator()
        const response = await fetch(`${urlAPI}/anime/${randomNumber}/full`)
        console.log(randomNumber)

        if(response.ok) {
            const data = await response.json();
            const objImg = data.data.images.webp.large_image_url;
            hiddePreviousContainer();
            getImage(objImg);
        } else {
            setTimeout(() => {
                callApi(URL);
            }, '3000')
        }
        
    } catch(error) {
        console.error(error)
    }
}

function randomImageGenerator() {
    const NUMBER = 60000;
    const randomNumber = Math.floor(Math.random() * NUMBER);
    return randomNumber
}

function loadingImage() {
    const div = document.createElement('div');
    const span = document.createElement('span');
    const loadingIcon = document.createElement('img');
    span.textContent = 'Loading Anime...';
    loadingIcon.src = `./assets/images/270-ring-with-bg.svg`;

    div.append(span, loadingIcon);
    div.classList.add('loading-image', 'image-section__basic');

    imageSection.append(div);
}

function getImage(imgSrc) {
    const div = document.createElement('div');
    const img = document.createElement('img');

    div.classList.add('anime-img-ok', 'image-section__basic');
    img.alt = 'Random Anime Image';
    img.src = imgSrc;
    div.append(img)

    imageSection.append(div);
}

function hiddePreviousContainer() {
    const previousElement = imageSection.firstElementChild;
    console.log(previousElement)
    previousElement.style.display = 'none';
}

generatorButton.addEventListener('click', () => {
    callApi(URL)
});