'use strict';

const SCROLLERS = document.querySelectorAll('[data-scroll-link]');

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
