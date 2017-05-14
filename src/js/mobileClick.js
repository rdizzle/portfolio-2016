'use strict';

let lastClicked = null;

const images = document.getElementsByClassName('work-item'),

    determineAction = () => {
        event.preventDefault();

        if (lastClicked === event.currentTarget) {
            window.open(event.currentTarget.href);
        }

        lastClicked = event.currentTarget;
    },

    isTouchDevice = () => window.navigator.userAgent.indexOf('iPhone') > -1 || window.navigator.userAgent.indexOf('iPod') > -1 || window.navigator.userAgent.indexOf('iPad') > -1 || window.navigator.userAgent.indexOf('Android') > -1 || window.navigator.userAgent.indexOf('Windows Phone') > -1 && 'ontouchstart' in window;

if (isTouchDevice()) {
    for (let i = 0; i < images.length; i++) {
        images[i].addEventListener('click', determineAction);
    }
}
