'use strict';

import objectFitImages from 'object-fit-images';

const polyfill = () => {
    objectFitImages();

    document.removeEventListener('DOMContentLoaded', polyfill);
};

document.addEventListener('DOMContentLoaded', polyfill);
