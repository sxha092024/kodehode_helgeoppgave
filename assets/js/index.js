const animations_map = new Map();

addEventListener("DOMContentLoaded", DOMContentLoadedEventHandler);

/**
 * 
 * @param {Event} ev 
 */
function DOMContentLoadedEventHandler(ev) {
    log("Event fired:", ev.type);

    let bouncies = document.getElementsByClassName("dvd-bounce");
    for (let i = 0; i < bouncies.length; i++) {
        let el = bouncies[i];
        el.getAnimations()[0].currentTime = Math.random() * 10;
        el.id = `dvd-bounce-${i}`;
        log(el);
        start_bounce(el.parentElement.getBoundingClientRect(), el, (Math.random() * 500) + (100 * i))
    }
    // let container = document.getElementById("dvd-container");
    // let rect = container.getBoundingClientRect();
    // let dvd = document.getElementById("dvd-logo");

    // start_bounce(rect, dvd);


    window.requestAnimationFrame(bounce_step);

    setInterval(footer_fill_page, 100);
}

/**
 * Fills the rest of the viewport by extending the height of the page's (first) footer element
 */
function footer_fill_page() {
    let footer = document.getElementsByTagName("footer")[0];
    let viewport = window.visualViewport;
    let offset = footer.offsetTop;
    footer.style.height = `${viewport.height - offset}px`;
}

/**
 * Logs to console with a `LOCALTIME` ISO 8061 timestamp prefix
 * 
 * The interface is the same as that of console.log
 * 
 * @param  {...any} data 
 */
function log(...data) {
    console.log(`[${new Date().toISOString()}]`, ...data)
}

/**
 * Do a bounce like the good old days
 * @param {DOMRect} bounding_rect 
 * @param {HTMLElement} element 
 * @param {Number} timescale_factor
 * @returns {Number} the id of the interval currently bouncing the element
 */
// TODO Simplify by giving a target, and a parent. This can also enable live resizing of the parent container.
function start_bounce(bounding_rect, element, timescale_factor = 500) {
    log("Starting to bounce:", element, "within rect:", bounding_rect, "timescale_factor:", timescale_factor);

    animations_map.set(
        element.id,
        {
            x: (Math.random() * bounding_rect.width),
            y: (Math.random() * bounding_rect.height),
            x_right: Boolean(Math.round(Math.random())),
            y_up: Boolean(Math.round(Math.random())),
            rect: bounding_rect,
            start: undefined,
            time: undefined,
            timescale_factor: timescale_factor
        }
    );
}

function bounce_step(time) {
    animations_map.forEach((value, key) => {

        if (!value.time) {
            value.start = time;
            value.time = time;
            return;
        }
        value.time = time;
        let xspeed = (value.rect.width / value.timescale_factor);
        let yspeed = (value.rect.height / value.timescale_factor);

        const delta = value.start / value.time;
        value.start = time;

        const el = document.getElementById(key);

        let x = value.x;
        let y = value.y;

        if (value.x_right) {
            let dist = Math.abs((x + xspeed) - x)
            x += dist * delta;
        } else {
            let dist = Math.abs((x - xspeed) - x);
            x -= dist * delta;
        }

        if (!value.y_up) {
            let dist = Math.abs((y + yspeed) - y);
            y += dist * delta;
        } else {
            let dist = Math.abs((y - yspeed) - y);
            y -= dist * delta;
        }

        if (x <= 0) {
            value.x_right = true;
        } else if (x >= (value.rect.width - el.width)) {
            value.x_right = false;
        }

        if (y <= 0) {
            value.y_up = false;
        } else if (y >= (value.rect.height - el.height)) {
            value.y_up = true;
        }

        value.x = x;
        value.y = y;
        el.style.translate = `${x}px ${y}px`;

    });

    window.requestAnimationFrame(bounce_step);
}