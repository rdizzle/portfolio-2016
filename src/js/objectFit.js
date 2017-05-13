'use strict';

import objectFitImages from 'object-fit-images';

const polyfill = () => {
    objectFitImages();

    window.removeEventListener('DOMContentLoaded', polyfill);
};

window.addEventListener('DOMContentLoaded', polyfill);
