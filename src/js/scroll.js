'use strict';

import jump from 'jump.js';

const scrollLinks = document.querySelectorAll('[data-scroll-link]'),
    nav = document.querySelector('nav');

for (let i = 0; scrollLinks.length > i; i++) {
    scrollLinks[i].addEventListener('click', scrollToElement);
}

function scrollToElement(event) {
    event.preventDefault();
    let targetElement = document.getElementById(event.currentTarget.dataset.scrollLink);

    jump(targetElement);
}
