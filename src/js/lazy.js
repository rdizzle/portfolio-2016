'use strict';

import obzerv from 'obzerv';

const pictures = document.querySelectorAll('picture[data-lazy]');

const callback = (node, inview, untrack) => {
    if (inview) {
        const sources = node.querySelectorAll('source');
        const img = node.querySelector('img');

        for (let source of sources) {
            source.setAttribute('srcset', source.getAttribute('data-lazy-srcset'));
            source.setAttribute('sizes', source.getAttribute('data-lazy-sizes'));
            source.removeAttribute('data-lazy-srcset');
            source.removeAttribute('data-lazy-sizes');
        }

        img.setAttribute('src', img.getAttribute('data-lazy-src'));
        img.removeAttribute('data-lazy-src');

        untrack();
    }
};

const load = event => {
    event.currentTarget.parentNode.parentNode.classList.add('visible');

    event.currentTarget.removeEventListener('load', load);
};

const observer = obzerv.create({
    callback,
    offset: 0
});

for (let picture of pictures) {
    observer.track(picture);

    picture.removeAttribute('data-lazy');
    picture.querySelector('img').addEventListener('load', load);
}
