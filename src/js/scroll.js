'use strict';

import { polyfill } from 'smoothscroll-polyfill';

const scrollLinks = document.querySelectorAll('[data-scroll-link]'),
    nav = document.querySelector('nav');

let oldPos = window.pageYOffset;

for (let i = 0; scrollLinks.length > i; i++) {
    scrollLinks[i].addEventListener('click', scrollToElement);
}

window.addEventListener('scroll', scrollHandler);

function hideNav() {
    nav.classList.add('hidden');
}

function showNav() {
    nav.removeAttribute('class');
}

function scrollToElement() {
    event.preventDefault();
    let targetElement = document.getElementById(event.currentTarget.dataset.scrollLink);

    polyfill();
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
