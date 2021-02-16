$(function () {

    var vh = document.documentElement.clientHeight;
    console.log(vh);
    // scroll magic init
    var controller = new ScrollMagic.Controller({
        globalSceneOptions: {
            triggerHook: 'onLeave',
        }
    });

    // section object fade in-out animation
    var fadingObj = [];
    var fadingTrigger = [];
    // sec1 - 1개 / sec2 - 4개 / sec3 - 4개 /sec4 - 4개
    var durations = [0.7 * vh,
    0.7 * vh, 0.7 * vh, 0.7 * vh, 0.7 * vh,
    0.7 * vh + 550, 0.7 * vh, 0.6 * vh, 0.6 * vh,
    0.7 * vh, 0.7 * vh, 0.7 * vh, 0.7 * vh, 0.7 * vh, 0.7 * vh, 0.7 * vh, 0.7 * vh, 0.7 * vh, 0.7 * vh, 0.7 * vh, 0.7 * vh, 0.7 * vh, 0.7 * vh, 0.7 * vh, 0.7 * vh];
    var offsets = [-0.8 * vh
        , -0.8 * vh, -0.8 * vh, -0.8 * vh, -0.8 * vh
        , -0.8 * vh, -0.8 * vh, -0.8 * vh, -0.8 * vh,
    -0.8 * vh, -0.8 * vh, -0.8 * vh, -0.8 * vh, -0.8 * vh, -0.8 * vh, -0.8 * vh, -0.8 * vh, -0.8 * vh, -0.8 * vh, -0.8 * vh, -0.8 * vh, -0.8 * vh, -0.8 * vh, -0.8 * vh, -0.8 * vh];

    var Objs = document.getElementsByClassName("fade");
    for (idx = 0; idx < Objs.length; idx++) {
        fadingObj.push(Objs[idx]);
    }
    var triggers = document.getElementsByClassName("trigger-fade");
    for (idx = 0; idx < triggers.length; idx++) {
        fadingTrigger.push(triggers[idx]);
    }

    var idx = 0;
    fadingObj.forEach(function () {
        var object = fadingObj[idx];
        var trigger = fadingTrigger[idx];
        var scene = new ScrollMagic.Scene({ triggerElement: trigger, duration: durations[idx], offset: offsets[idx] })
            .on("enter", function () {
                object.classList.remove("fade");
            })
            .on("leave", function () {
                object.classList.add("fade");
            })
            .addTo(controller);
        idx++;
    })

    // section object move up-down animation
    var upDownObj = [];
    var upDownTrigger = [];
    // sec1 - 1개 / sec2 - 4개 / sec3 - 4개 /sec4 - 4개
    var durations = [0.7 * vh,
    0.7 * vh, 0.7 * vh, 0.7 * vh, 0.7 * vh,
    0.7 * vh + 550, 0.7 * vh, 0.6 * vh, 0.6 * vh,
    0.7 * vh, 0.7 * vh, 0.7 * vh, 0.7 * vh, 0.7 * vh, 0.7 * vh, 0.7 * vh, 0.7 * vh, 0.7 * vh, 0.7 * vh, 0.7 * vh, 0.7 * vh, 0.7 * vh, 0.7 * vh, 0.7 * vh, 0.7 * vh];
    var offsets = [-0.8 * vh
        , -0.8 * vh, -0.8 * vh, -0.8 * vh, -0.8 * vh
        , -0.8 * vh, -0.8 * vh, -0.8 * vh, -0.8 * vh,
    -0.8 * vh, -0.8 * vh, -0.8 * vh, -0.8 * vh, -0.8 * vh, -0.8 * vh, -0.8 * vh, -0.8 * vh, -0.8 * vh, -0.8 * vh, -0.8 * vh, -0.8 * vh, -0.8 * vh, -0.8 * vh, -0.8 * vh, -0.8 * vh];

    var Objs = document.getElementsByClassName("upDown");
    for (idx = 0; idx < Objs.length; idx++) {
        upDownObj.push(Objs[idx]);
    }
    var triggers = document.getElementsByClassName("trigger-upDown");
    for (idx = 0; idx < triggers.length; idx++) {
        upDownTrigger.push(triggers[idx]);
    }

    var idx = 0;
    upDownObj.forEach(function () {
        var object = upDownObj[idx];
        var trigger = upDownTrigger[idx];
        var scene = new ScrollMagic.Scene({ triggerElement: trigger, duration: durations[idx], offset: offsets[idx] })
            .on("enter", function () {
                object.classList.remove("upDown");
            })
            .on("leave", function () {
                object.classList.add("upDown");
            })
            .addTo(controller);
        idx++;
    })
    // sec3 info zoom in-out
    var sec3_bg = document.getElementById("sec03-bg");

    var zoomObj = [];
    var zoomTrigger = [];
    var offset = -0.5 * vh;
    var Objs = document.getElementsByClassName("zoom");
    for (idx = 0; idx < Objs.length; idx++) {
        zoomObj.push(Objs[idx]);
    }

    var triggers = document.getElementsByClassName("trigger-zoom");
    for (idx = 0; idx < triggers.length; idx++) {
        zoomTrigger.push(triggers[idx]);
    }

    for (idx = 0; idx < zoomObj.length; idx++) {
        if (idx == 0) {
            var scene = new ScrollMagic.Scene({ triggerElement: zoomTrigger[idx], duration: 330, offset: offset })
                .on("enter", function () {
                    zoomObj[0].classList.add("zoom");
                    zoomObj[1].classList.remove("zoom");
                    zoomObj[2].classList.remove("zoom");
                    sec3_bg.classList.add("bg1");
                })
                .on("leave", function () {
                    zoomObj[0].classList.remove("zoom");
                    sec3_bg.classList.remove("bg1");
                })
                .addTo(controller);
        }
        else if (idx == 1) {
            var scene = new ScrollMagic.Scene({ triggerElement: zoomTrigger[idx], duration: 250, offset: offset })
                .on("enter", function () {
                    zoomObj[1].classList.add("zoom");
                    sec3_bg.classList.add("bg2");
                })
                .on("leave", function () {
                    zoomObj[1].classList.remove("zoom");
                    sec3_bg.classList.remove("bg2");
                })
                .addTo(controller);
        }
        else if (idx == 2) {
            var scene = new ScrollMagic.Scene({ triggerElement: zoomTrigger[idx], duration: 1000, offset: offset })
                .on("enter", function () {
                    zoomObj[2].classList.add("zoom");
                    sec3_bg.classList.add("bg3");
                })
                .on("leave", function () {
                    zoomObj[2].classList.remove("zoom");
                    sec3_bg.classList.remove("bg3");

                })
                .addTo(controller);
        }
    }
    // sec3 title pinning 
    var pinObj = document.getElementById("sec03-title");
    var scene = new ScrollMagic.Scene({ triggerElement: pinObj, duration: 600, offset: -70 })
        .setPin(pinObj)
        .addTo(controller);
    init();
    function init() {
        sec3_bg.classList.add("bg1");
        animation();
        function animation() {
            var cur_scr = pageYOffset;
            requestAnimationFrame(animation);
        }
    }
})