const checkbox = document.querySelector('.toggle__checkbox');

const toggle = event => {
    const val = event.target.checked;

    if (val) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('dark', true);
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('dark', false);
    }
};

const check = () => {
    if (localStorage.getItem('dark') === 'true') {
        checkbox.checked = true;
        document.documentElement.classList.add('dark');
    }
}

checkbox.addEventListener('change', toggle);
document.addEventListener('DOMContentLoaded', check, {
    once: true
});
