'use strict';

const loaders = document.querySelectorAll('.load-reveal');

window.addEventListener('load', showLoaders, true);

function showLoaders() {
    for (let i = 0; loaders.length > i; i++) {
        if (loaders[i].tagName === 'MAIN') {
            loaders[i].removeAttribute('class');
        } else {
            loaders[i].classList.remove('load-reveal');
        }
    }

    window.removeEventListener('load', showLoaders);
}
