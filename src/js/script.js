$(document).ready(function () {
    'use strict';

    var navHeight = $('header').outerHeight(),
        aboutPos = null,
        whatPos = null,
        projectsPos = null,
        contactPos = null,
        scrollDisabled = false;

    getPositions();

    $('[data-scroll-target]').click(function (event) {
        event.preventDefault();
        scrollToTarget('#' + event.target.dataset.scrollTarget);
    });

    $('.mobile-menu').click(function (event) {
        event.preventDefault();
        if ($(document).width() > 767) {
            return null;
        }
        createMobileMenu();
    });

    $('body').on('click', '.mobile-menu-close', function (event) {
        event.preventDefault();
        destroyMobileMenu();
    });

    $('body').on('click', '.mobile-menu-container [data-scroll-target]', function (event) {
        event.preventDefault();
        destroyMobileMenu();
        scrollToTarget('#' + event.target.dataset.scrollTarget);
    });

    $(window).on('scroll', function () {
        var scrollPos = $(this).scrollTop();

        if (scrollPos > 0 && !($('header').hasClass('white'))) {
            $('header').addClass('white');
        }
        if (scrollPos === 0 && $('header').hasClass('white')) {
            $('header').removeAttr('class');
        }

        if ($(document).width() < 767) {
            return null;
        }

        if (scrollPos < aboutPos && !($('a[data-scroll-target="top"]').hasClass('active'))) {
            $('a.active').removeClass('active');
            $('header a[data-scroll-target="top"]').addClass('active');
        }
        if (scrollPos >= aboutPos && scrollPos < whatPos && !($('a[data-scroll-target="about-me"]').hasClass('active'))) {
            $('a.active').removeClass('active');
            $('header a[data-scroll-target="about-me"]').addClass('active');
        }
        if (scrollPos >= whatPos && scrollPos < projectsPos && !($('a[data-scroll-target="what-i-do"]').hasClass('active'))) {
            $('a.active').removeClass('active');
            $('header a[data-scroll-target="what-i-do"]').addClass('active');
        }
        if (scrollPos >= projectsPos && scrollPos < contactPos && !($('a[data-scroll-target="projects"]').hasClass('active'))) {
            $('a.active').removeClass('active');
            $('header a[data-scroll-target="projects"]').addClass('active');
        }
        if (scrollPos >= contactPos && !($('a[data-scroll-target="contact"]').hasClass('active'))) {
            $('a.active').removeClass('active');
            $('header a[data-scroll-target="contact"]').addClass('active');
        }
    });

    $(window).on('resize', function () {
        getPositions();
    });

    $(document).on('touchmove', function (event) {
        if (scrollDisabled) {
            event.preventDefault();
        }
    });

    function getPositions() {
        aboutPos = $('h1#about-me').offset().top - navHeight - 31;
        whatPos = $('h1#what-i-do').offset().top - navHeight - 31;
        projectsPos = $('h1#projects').offset().top - navHeight - 31;
        contactPos = $('h1#contact').offset().top - navHeight - 31;
    }

    function scrollToTarget(target) {
        $('html, body').animate({
            scrollTop: $(target).offset().top - navHeight - 30
        }, 500);
    }

    function createMobileMenu() {
        $('body').append('<div class="mobile-menu-container"></div>');
        $('.mobile-menu-container').append('<a href="#" class="mobile-menu-close"><i class="fa fa-times"></i></a>');
        $('.mobile-menu-container').append('<div class="center-container"></div>');
        $('.mobile-menu-container .center-container').append('<ul></ul>');
        $('.mobile-menu-container .center-container ul').append(
            '<li><a href="#top" data-scroll-target="top">Home</a></li>' +
            '<li><a href="#about-me" data-scroll-target="about-me">About Me</a></li>' +
            '<li><a href="#what-i-do" data-scroll-target="what-i-do">What I Do</a></li>' +
            '<li><a href="#projects" data-scroll-target="projects">Projects</a></li>' +
            '<li><a href="#contact" data-scroll-target="contact">Contact</a></li>'
        );
        $('.mobile-menu-container').animate({
            'opacity': 1
        }, 350);
        scrollDisabled = true;
    }

    function destroyMobileMenu() {
        $('.mobile-menu-container').animate({
            'opacity': 0
        }, 350, function () {
            $('.mobile-menu-container').remove();
        });
        scrollDisabled = false;
    }
});
