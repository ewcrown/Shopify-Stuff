getUsers('https://api.github.com/users')

async function getUsers(api) {
    let response = await fetch(api);

    let data = await response.json();

    let swiperWrapper = document.getElementById('slider')

    for (var i = 0; i < data.length; i++) {
        let div = document.createElement('div')
        div.className = 'swiper-slide'
        let inform = data[i]
        div.innerHTML = inform.login
        swiperWrapper.appendChild(div)
    }
}