/*
    date : 2020.11.23 
    writer: Suyoung Park
    syntax : ES5 / vanilla with vivus.js
*/
var mainjs = (function () {
    var yOffset = 0,
        _yOffset = 0,
        currentIndex = 0,
        sceneOffsets = [],
        header = document.querySelector('header'),
        currentStep = 0,
        prevStep = 0,
        lockScroll = false,
        screenWidth = window.outerWidth,
        screenHeight = window.outerHeight,
        addressBarSize = document.body.clientHeight - screenHeight,
        sceneInfo = [
            {
                type: 'normal',
                position: 'top',
                container: document.querySelector('#scroll-scene01'),
                heightNum: 1,
                height: 0,
                space: 0,
                innerScene: 0,
                objs: [
                    document.querySelector('#scroll-scene01 .video')
                ]
            },
            {
                type: 'sticky',
                position: 'top',
                container: document.querySelector('#scroll-scene02'),
                heightNum: 5,
                height: 0,
                space: 65,
                innerScene: 6,
                objs: [
                    document.querySelector('#scrollWrapper'),
                    document.querySelector('#fixedContainer'),
                    document.querySelector('#scroll-scene02 h2'),
                    document.querySelectorAll('#scroll-scene02 li'),
                    document.querySelector('#scroll-scene02 .stick .progress')
                ]
            },
            {
                type: 'sticky',
                container: document.querySelector('#scroll-scene03'),
                position: 'center',
                heightNum: 1,
                height: 0,
                space: 0,
                innerScene: 0,
                objs: []
            },
            {
                type: 'normal',
                container: document.querySelector('#scroll-scene04'),
                position: 'center',
                heightNum: 1,
                height: 0,
                space: 0,
                innerScene: 0,
                objs: []
            },
            {
                type: 'normal',
                container: document.querySelector('#scroll-scene05'),
                position: 'center',
                heightNum: 1,
                height: 0,
                space: 0,
                innerScene: 0,
                objs: []
            },
            {
                type: 'normal',
                container: document.querySelector('#scroll-scene06'),
                position: 'center',
                heightNum: 1,
                height: 0,
                space: 0,
                innerScene: 0,
                objs: []
            }
        ];
    window.addEventListener('beforeunload', function () {
        window.scrollTo(0, 0); //새로고침 시 상단부터 시작
        setLayout();
    });
    window.addEventListener('load', function () {
        window.scrollTo(0, 0); //새로고침 시 상단부터 시작
        setLayout();
        // var url = document.getElementsByTagName('iframe').src;
        // document.getElementsByTagName('iframe').src = url;
    });
    var onceEvent = true;
    window.addEventListener('scroll', function (e) {
        scrollEvent(e);
    });

    window.addEventListener('resize', function () {
        if (screenWidth != window.outerWidth) location.reload();
    });
    function scrollEvent(e) {
        if (lockScroll) {
            window.scrollTo(0, _yOffset);
            return;
        }
        yOffset = pageYOffset;
        var _direction = (yOffset - _yOffset) >= 0 ? 'down' : 'up';
        _yOffset = yOffset;
        for (var i = 0; i < sceneOffsets.length; i++) {
            if (yOffset > sceneOffsets[i]) currentIndex = i;
            else break;
        }

        if (currentIndex > 0) header.classList.remove('ver2');
        else header.classList.add('ver2');
        playAnimation(currentIndex);
        if (_direction == 'down') { // downscroll
            if (yOffset != 0) header.classList.add('up');
            else header.classList.remove('up');
            currentIndex++;
            if (currentIndex > sceneOffsets.length - 1) currentIndex = sceneOffsets.length - 1;
        } else { // upscroll

            header.classList.remove('up');
            currentIndex--;
            if (currentIndex < 0) {
                currentIndex = 0;
                if (yOffset < 0) location.reload();
            }
        }
    }
    function playAnimation(currentIndex) {
        switch (currentIndex) {
            case 0:
                sceneInfo[0].objs[0].classList.remove('fix');
                sceneInfo[1].container.classList.remove('play');
                sceneInfo[1].objs[1].classList.remove('play', 'stop');
                sceneInfo[1].objs[1].style.top = '0px';
                sceneInfo[1].objs[1].style.bottom = 'auto';
                resetInnerScene1();
                break;
            case 1:
                sceneInfo[0].objs[0].classList.add('fix');
                sceneInfo[1].container.classList.add('play');
                sceneInfo[1].objs[1].style.top = '0px';
                sceneInfo[1].objs[1].style.bottom = 'auto';
                var rate = 100 - Math.round((yOffset - sceneOffsets[1]) / (sceneInfo[1].height - (screenHeight * 0.5)) * 100);
                currentStep = currentInnerStep(rate);
                if (currentStep)
                    if (currentStep != prevStep || currentStep == 0) playInnerScene1(currentStep);
                prevStep = currentStep;

                var compareOffset;
                if (sceneInfo[2].position == 'top')
                    compareOffset = sceneOffsets[2];
                else if (sceneInfo[2].position == 'center')
                    compareOffset = sceneOffsets[2] + (screenHeight - sceneInfo[2].height) * 0.5;

                var diff = compareOffset - yOffset;
                if (diff > 0 && diff <= screenHeight) {
                    sceneInfo[1].objs[1].classList.remove('play');
                    sceneInfo[1].objs[1].classList.add('stop');
                    sceneInfo[1].objs[1].style.top = 'auto';
                    sceneInfo[1].objs[1].style.bottom = '0px';
                } else {
                    sceneInfo[1].objs[1].classList.remove('stop');
                    sceneInfo[1].objs[1].classList.add('play');
                    sceneInfo[1].objs[1].style.top = -sceneOffsets[1] + 'px';
                }
                break;
            case 2:
                sceneInfo[1].objs[1].classList.remove('play');
                sceneInfo[1].objs[1].classList.add('stop');
                sceneInfo[1].objs[1].style.top = 'auto';
                sceneInfo[1].objs[1].style.bottom = '0px';
                //resetInnerScene1();
                if (onceEvent) {
                    onceEvent = !onceEvent;
                }
                break;
            case 3:
                if (!onceEvent) {
                    onceEvent = !onceEvent;
                }
                break;
            case 4:
                if (onceEvent) {
                    onceEvent = !onceEvent;
                }
                break;
            case 5:
                if (!onceEvent) {
                    onceEvent = !onceEvent;
                }
                break;
        }
    }
    function currentInnerStep(rate) {
        var stepNum = sceneInfo[currentIndex].innerScene;
        var step = 100 / stepNum;
        for (var i = 1; i < stepNum + 1; i++)
            if (rate >= (100 - step * i)) return i;
        return false;
    }
    function playInnerScene1(step) {
        if (step > sceneInfo[currentIndex].innerScene - 1) step = sceneInfo[currentIndex].innerScene - 1;
        var plusCnt,
            playobj = sceneInfo[1].objs[3],
            playobjContainer = playobj[step - 1];
        for (var i = 0; i < playobj.length; i++) {
            playobj[i].classList.remove('play', 'fadeOut');
        }
        sceneInfo[1].objs[4].classList.remove('p20', 'p40', 'p60', 'p80', 'p100');
        playobjContainer.classList.add('play');
        var svg = new Vivus('svg-arr', {
            type: 'scenario',
            duration: 200
        });
        switch (step) {
            case 1:
                sceneInfo[1].objs[4].classList.add('p20');
                var cnt = 35;
                var num = playobjContainer.querySelector('.number');
                plusCnt = setInterval(function () {
                    num.innerHTML = cnt;
                    if (cnt == 70) clearInterval(plusCnt);
                    else cnt++;
                }, 50);
                svg.play(1);
                break;
            case 2:
                svg.finish();
                playobj[0].classList.add('fadeOut');
                sceneInfo[1].objs[4].classList.add('p40');
                break;
            case 3:
                playobj[1].classList.add('fadeOut');
                sceneInfo[1].objs[4].classList.add('p60');
                break;
            case 4:
                playobj[2].classList.add('fadeOut');
                sceneInfo[1].objs[4].classList.add('p80');
                var cnt1 = 67;
                var cnt2 = 30;
                var num1 = playobjContainer.querySelector('.number1');
                var num2 = playobjContainer.querySelector('.number2');
                plusCnt = setInterval(function () {
                    num1.innerHTML = cnt1;
                    num2.innerHTML = cnt2;
                    if (cnt1 == 94) clearInterval(plusCnt);
                    else {
                        cnt1++; cnt2++;
                    }
                }, 30);
                break;
            case 5:
            default:
                playobj[3].classList.add('fadeOut');
                sceneInfo[1].objs[4].classList.add('p100');
                break;
        }
    }
    function resetInnerScene1() {
        currentStep = prevStep = 0;
        var playobj = sceneInfo[1].objs[3];
        sceneInfo[1].objs[4].classList.remove('p20', 'p40', 'p60', 'p80', 'p100');
        for (var i = 0; i < playobj.length; i++)
            playobj[i].classList.remove('play');
    }
    function setLayout() {//각 씬의 스크롤 위치 배열 셋팅
        for (var i = 0; i < sceneInfo.length; i++) {
            var height = sceneInfo[i].container.offsetHeight;
            if (sceneInfo[i].space < 1) sceneInfo[i].space = screenHeight * sceneInfo[i].space;
            if (i == 1) height = screenHeight - sceneInfo[i].space;
            sceneInfo[i].height = height * sceneInfo[i].heightNum;
            sceneInfo[i].container.style.height = sceneInfo[i].height + 'px';
            var offset = sceneInfo[i].container.offsetTop - sceneInfo[i].space;
            if (sceneInfo[i].position == 'center')
                offset -= (screenHeight - sceneInfo[i].height) * 0.5;
            sceneOffsets.push(offset);
            if (i == 1) {
                sceneInfo[i].container.style.height = height + addressBarSize + 'px';
                sceneInfo[i].objs[0].style.height = sceneInfo[0].height + sceneInfo[1].height + 'px';

            }
        }
    }
    function init() {
        scrollTo(0, 0);
        yOffset = 0;
        _yOffset = 0;
        currentIndex = 0;
        sceneOffsets = [];
        currentStep = 0;
        prevStep = 0;
        lockScroll = false;
        screenWidth = window.outerWidth;
        screenHeight = window.outerHeight;
        addressBarSize = document.body.clientHeight - screenHeight;
        setLayout();
    }
})();