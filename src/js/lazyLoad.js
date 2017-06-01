'use strict';

import Layzr from 'layzr.js';

const lazyLoad = () => {
    Layzr({
        threshold: 20
    }).update().check().handlers(true);
};

document.addEventListener('DOMContentLoaded', lazyLoad);
