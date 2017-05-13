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

    isTouchDevice = () => {
        return window.navigator.userAgent.includes('iPhone') || window.navigator.userAgent.includes('iPod') || window.navigator.userAgent.includes('iPad') || window.navigator.userAgent.includes('Android') || window.navigator.userAgent.includes('Windows Phone') && 'ontouchstart' in window;
    };

if (isTouchDevice()) {
    for (let i = 0; i < images.length; i++) {
        images[i].addEventListener('click', determineAction);
    }
}
