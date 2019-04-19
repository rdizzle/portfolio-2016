// tiny object-fit polyfill
// by @rbnlffl, 2019

if (!('objectFit' in document.documentElement.style)) {
    const toFit = document.querySelectorAll('[data-object-fit]');

    [...toFit].forEach(img => {
        img.addEventListener('load', () => {
            img.parentElement.classList.add('object-fitted');
            img.parentElement.style.backgroundImage = `url(${img.src})`;
        });
    });
}
