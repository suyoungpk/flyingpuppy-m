$(function () {
    var yOffset = pageYOffset;
    // header move up down
    var header = document.querySelector("header");
    window.addEventListener('scroll', function (e) {
        if (pageYOffset > yOffset) { //scroll down
            header.classList.add('up');
        }
        else if (pageYOffset <= yOffset) { // scroll up
            header.classList.remove('up');
        }
        yOffset = pageYOffset;
    });

})
// gnb button script
function gnbClicked(cur_tab) {

    if (cur_tab == 'button-product') {
        var parent = document.getElementById('button-product').parentElement;
        document.getElementById('button-center').parentElement.classList.remove('open');
        document.getElementById('button-account').parentElement.classList.remove('open');
    }
    else if (cur_tab == 'button-center') {
        var parent = document.getElementById('button-center').parentElement;
        document.getElementById('button-product').parentElement.classList.remove('open');
        document.getElementById('button-account').parentElement.classList.remove('open');
    }
    else if (cur_tab == 'button-account') {
        var parent = document.getElementById('button-account').parentElement;
        document.getElementById('button-center').parentElement.classList.remove('open');
        document.getElementById('button-product').parentElement.classList.remove('open');
    }

    if (parent.classList.contains("open")) {
        parent.classList.remove("open");
    }
    else if (!parent.classList.contains("open")) {
        parent.classList.add("open");
    }
}