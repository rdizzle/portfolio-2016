import 'intersection-observer';

const pictures = document.querySelectorAll('[data-lazy]');

const intersectingCallback = (observerEntries, observerInstance) => {
    observerEntries.forEach(observerEntry => {
        if (observerEntry.isIntersecting) {
            const sources = observerEntry.target.querySelectorAll('source');
            const img = observerEntry.target.querySelector('img');

            [...sources].forEach(source => {
                source.setAttribute('srcset', source.dataset.lazySrcset);
                source.setAttribute('sizes', source.dataset.lazySizes);
                source.removeAttribute('data-lazy-srcset');
                source.removeAttribute('data-lazy-sizes');
            });

            img.setAttribute('src', img.dataset.lazySrc);
            img.removeAttribute('data-lazy-src');

            observerInstance.unobserve(observerEntry.target);
        }
    });
};

const loadListener = event => {
    event.currentTarget.parentNode.parentNode.classList.add('visible');
    event.currentTarget.removeEventListener('load', loadListener);
};

const intersectionObserver = new IntersectionObserver(intersectingCallback, {
    rootMargin: '25%'
});

[...pictures].forEach(picture => {
    intersectionObserver.observe(picture);

    picture.removeAttribute('data-lazy');
    picture.querySelector('img').addEventListener('load', loadListener);
});
