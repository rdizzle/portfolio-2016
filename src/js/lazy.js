'use strict';

import 'intersection-observer';

const pictures = document.querySelectorAll('picture[data-lazy]');

const callback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sources = entry.target.querySelectorAll('source');
            const img = entry.target.querySelector('img');

            for (let source of sources) {
                source.setAttribute('srcset', source.getAttribute('data-lazy-srcset'));
                source.setAttribute('sizes', source.getAttribute('data-lazy-sizes'));
                source.removeAttribute('data-lazy-srcset');
                source.removeAttribute('data-lazy-sizes');
            }

            img.setAttribute('src', img.getAttribute('data-lazy-src'));
            img.removeAttribute('data-lazy-src');

            observer.unobserve(entry.target);
        }
    });
};

const load = event => {
    event.currentTarget.parentNode.parentNode.classList.add('visible');
    event.currentTarget.removeEventListener('load', load);
};

const inst = new IntersectionObserver(callback, {
    rootMargin: '25%'
});

for (let picture of pictures) {
    inst.observe(picture);

    picture.removeAttribute('data-lazy');
    picture.querySelector('img').addEventListener('load', load);
}
