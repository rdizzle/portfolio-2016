'use strict';

const toggler = document.getElementById('navigation-toggle'),
    navigation = document.querySelector('nav'),
    links = document.getElementsByClassName('nav-link');

toggler.addEventListener('click', toggleNavigation);

function toggleNavigation(event) {
    event.preventDefault();

    navigation.classList.toggle('open');
}

for (let i = 0; i < links.length; i++) {
    links[i].addEventListener('click', toggleNavigation);
}
