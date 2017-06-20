'use strict';

import Layzr from 'layzr.js';

const lazyLoad = () => {
        Layzr().update().check().handlers(true);

        document.removeEventListener('DOMContentLoaded', lazyLoad);
    },

    animateLoad = event => {
        event.currentTarget.parentNode.classList.add('visible');

        event.currentTarget.removeEventListener('load', animateLoad);
    },

    setAnimateListeners = () => {
        const images = document.getElementsByClassName('work-item-image');

        for (let i = 0; i < images.length; i++) {
            images[i].addEventListener('load', animateLoad);
        }

        document.removeEventListener('DOMContentLoaded', setAnimateListeners);
    };

document.addEventListener('DOMContentLoaded', lazyLoad);
document.addEventListener('DOMContentLoaded', setAnimateListeners);
