const URL = 'https://api.jikan.moe/v4';
const imagePlace = document.querySelector('.image-place')
const generatorButton = document.querySelector('.generator-button')

async function callApi(urlAPI) {
    try {
        const randomNumber = randomImageGenerator()
        const response = await fetch(`${urlAPI}/anime/${randomNumber}/full`)
        console.log(randomNumber)

        if(response.ok) {
            const data = await response.json();
            imagePlace.src = data.data.images.webp.large_image_url;
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

generatorButton.addEventListener('click', () => {
    callApi(URL)
});