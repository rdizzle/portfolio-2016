'use strict';

import Layzr from 'layzr.js';

const lazyLoad = () => {
    Layzr({
        threshold: 25
    }).update().check().handlers(true);

    document.removeEventListener('DOMContentLoaded', lazyLoad);
};

document.addEventListener('DOMContentLoaded', lazyLoad);
