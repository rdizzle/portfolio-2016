'use strict';

const loaders = document.querySelectorAll('.load-reveal');

window.addEventListener('load', showLoaders);

function showLoaders() {
    for (let i = 0; loaders.length > i; i++) {
        if (loaders[i].classList.length === 1) {
            loaders[i].removeAttribute('class');
        } else {
            loaders[i].classList.remove('load-reveal');
        }
    }

    window.removeEventListener('load', showLoaders);
}
