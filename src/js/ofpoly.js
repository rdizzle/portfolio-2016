// tiny object-fit polyfill
// by @rbnlffl, 2019

if (!('objectFit' in document.documentElement.style)) {
    const toFit = document.querySelectorAll('[data-object-fit]');

    [...toFit].forEach(node => {
        node.addEventListener('load', () => {
            node.parentElement.classList.add('object-fitted');
            node.parentElement.style.backgroundImage = `url(${node.src})`;
        });
    });
}
