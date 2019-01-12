// tiny object-fit polyfill
// by @rbnlffl, 2019

const nodes = document.querySelectorAll('[data-object-fit]');

if (nodes && !('objectFit' in nodes[0].style)) {
    for (const node of nodes) {
        node.addEventListener('load', event => {
            const parent = node.parentElement;

            parent.classList.add('object-fitted');
            parent.style.backgroundImage = `url(${event.target.src})`;

            event.preventDefault();
        });
    }
}
