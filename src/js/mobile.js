'use strict';

let lastClicked;

const images = document.getElementsByClassName('work-item');

const determineAction = () => {
    event.preventDefault();

    if (lastClicked === event.currentTarget) {
        window.open(event.currentTarget.href);
    }

    lastClicked = event.currentTarget;
};

const isTouchDevice = () => window.navigator.userAgent.indexOf('iPhone') > -1 || window.navigator.userAgent.indexOf('iPod') > -1 || window.navigator.userAgent.indexOf('iPad') > -1 || window.navigator.userAgent.indexOf('Android') > -1 || window.navigator.userAgent.indexOf('Windows Phone') > -1 && 'ontouchstart' in window;

if (isTouchDevice()) {
    for (let image of images) {
        image.addEventListener('click', determineAction);
    }
}
