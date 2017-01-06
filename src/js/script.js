'use strict';

const SCROLLERS = document.querySelectorAll('[data-scroll-link]'),
    LOADERS = document.querySelectorAll('.load-reveal'),
    NAV = document.querySelector('nav');

let oldPos = window.pageYOffset;

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

function hideNav() {
    NAV.classList.add('hidden');
}

function showNav() {
    NAV.removeAttribute('class');
}

window.addEventListener('load', () => {
    for (let i = 0; LOADERS.length > i; i++) {
        if (LOADERS[i].tagName == 'MAIN') {
            LOADERS[i].removeAttribute('class');
        } else {
            LOADERS[i].classList.remove('load-reveal');
        }
    }
}, false);

window.addEventListener('scroll', () => {
    let newPos = window.pageYOffset;

    if (newPos > oldPos) {
        if (!NAV.classList.contains('hidden')) {
            hideNav();
        }
    } else {
        if (NAV.classList.contains('hidden')) {
            showNav();
        }
    }

    oldPos = newPos;
}, false);
