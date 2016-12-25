'use strict';

const SCROLLERS = document.querySelectorAll('[data-scroll-link]'),
    LOADERS = document.querySelectorAll('.load-reveal');

for (let i = 0; SCROLLERS.length > i; i++) {
    SCROLLERS[i].addEventListener('click', scrollToElement, false);
}

function scrollToElement(event) {
    event.preventDefault();
    let targetElement = document.getElementById(event.currentTarget.dataset.scrollLink);

    // use polyfill from iamdustan/smoothscroll
    targetElement.scrollIntoView({
        behavior: 'smooth'
    });
}

window.onload = () => {
    for (let i = 0; LOADERS.length > i; i++) {
        LOADERS[i].removeAttribute('class');
    }
};
