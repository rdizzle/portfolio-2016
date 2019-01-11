import 'intersection-observer';

const pictureNodes = document.querySelectorAll('picture[data-lazy]');

const intersectingCallback = (observerEntries, observerInstance) => {
    observerEntries.forEach(observerEntry => {
        if (observerEntry.isIntersecting) {
            const sourceNodes = observerEntry.target.querySelectorAll('source');
            const imgNode = observerEntry.target.querySelector('img');

            for (let sourceNode of sourceNodes.values()) {
                sourceNode.setAttribute('srcset', sourceNode.getAttribute('data-lazy-srcset'));
                sourceNode.setAttribute('sizes', sourceNode.getAttribute('data-lazy-sizes'));
                sourceNode.removeAttribute('data-lazy-srcset');
                sourceNode.removeAttribute('data-lazy-sizes');
            }

            imgNode.setAttribute('src', imgNode.getAttribute('data-lazy-src'));
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

for (let pictureNode of pictureNodes.values()) {
    intersectionObserver.observe(pictureNode);

    pictureNode.removeAttribute('data-lazy');
    pictureNode.querySelector('img').addEventListener('load', loadListener);
}
