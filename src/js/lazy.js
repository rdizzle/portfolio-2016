import 'intersection-observer';

const pictureNodes = document.querySelectorAll('[data-lazy]');

const intersectingCallback = (observerEntries, observerInstance) => {
    observerEntries.forEach(observerEntry => {
        if (observerEntry.isIntersecting) {
            const sourceNodes = observerEntry.target.querySelectorAll('source');
            const imgNode = observerEntry.target.querySelector('img');

            [...sourceNodes].forEach(node => {
                node.setAttribute('srcset', node.dataset.lazySrcset);
                node.setAttribute('sizes', node.dataset.lazySizes);
                node.removeAttribute('data-lazy-srcset');
                node.removeAttribute('data-lazy-sizes');
            });

            imgNode.setAttribute('src', imgNode.dataset.lazySrc);
            imgNode.removeAttribute('data-lazy-src');

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

[...pictureNodes].forEach(node => {
    intersectionObserver.observe(node);

    node.removeAttribute('data-lazy');
    node.querySelector('img').addEventListener('load', loadListener);
});
