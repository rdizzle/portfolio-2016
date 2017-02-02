'use strict';

const scrollers = document.querySelectorAll('[data-scroll-link]'),
    loaders = document.querySelectorAll('.load-reveal'),
    nav = document.querySelector('nav');

let oldPos = window.pageYOffset;

window.addEventListener('load', showLoaders, false);

for (let i = 0; scrollers.length > i; i++) {
    scrollers[i].addEventListener('click', scrollToElement, false);
}

window.addEventListener('scroll', scrollHandler, false);

function hideNav() {
    nav.classList.add('hidden');
}

function showNav() {
    nav.removeAttribute('class');
}

function showLoaders() {
    for (let i = 0; loaders.length > i; i++) {
        if (loaders[i].tagName === 'MAIN') {
            loaders[i].removeAttribute('class');
        } else {
            loaders[i].classList.remove('load-reveal');
        }
    }
}

function scrollToElement() {
    event.preventDefault();
    let targetElement = document.getElementById(event.currentTarget.dataset.scrollLink);

    targetElement.scrollIntoView({
        behavior: 'smooth'
    });
}

function scrollHandler() {
    let newPos = window.pageYOffset;

    if (newPos > oldPos) {
        if (!nav.classList.contains('hidden')) {
            hideNav();
        }
    } else {
        if (nav.classList.contains('hidden')) {
            showNav();
        }
    }

    oldPos = newPos;
}
