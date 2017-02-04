'use strict';

import objectFitImages from 'object-fit-images';

window.addEventListener('DOMContentLoaded', objectFitPolyfill);

function objectFitPolyfill() {
    objectFitImages();

    window.removeEventListener('DOMContentLoaded', objectFitImages);
}
