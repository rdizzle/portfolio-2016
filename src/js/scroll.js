'use strict';

import { polyfill } from 'smoothscroll-polyfill';

const scrollLinks = document.querySelectorAll('[data-scroll-link]'),
    nav = document.querySelector('nav');

let oldPos = window.pageYOffset;

for (let i = 0; scrollLinks.length > i; i++) {
    scrollLinks[i].addEventListener('click', scrollToElement);
}

function hideNav() {
    nav.classList.add('hidden');
}

function showNav() {
    nav.removeAttribute('class');
}

function scrollToElement(event) {
    event.preventDefault();
    let targetElement = document.getElementById(event.currentTarget.dataset.scrollLink);

    polyfill();
    targetElement.scrollIntoView({
        behavior: 'smooth'
    });
}
