'use strict';

const toggler = document.getElementById('navigation-toggle'),
    navigation = document.getElementById('navigation'),
    links = document.getElementsByClassName('nav-link'),
    blurrer = document.getElementById('blur-me');

toggler.addEventListener('click', toggleNavigation);

function toggleNavigation(event) {
    event.preventDefault();

    navigation.classList.toggle('open');
    toggler.classList.toggle('tilted');
    blurrer.classList.toggle('hell-yeah');
}

for (let i = 0; i < links.length; i++) {
    links[i].addEventListener('click', toggleNavigation);
}
