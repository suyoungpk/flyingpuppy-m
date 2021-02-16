$(function () {
    var controller = new ScrollMagic.Controller({
        globalSceneOption: {
            triggerHook: 0,
        }
    })
    var canvas_bg = document.getElementById("bgcanvas");
    var canvas_cover = document.getElementById("foodcanvas");
    var gl_bg = canvas_bg.getContext("2d");
    var gl_cover = canvas_cover.getContext("2d");

    var cover_img;
    var bg_img;
    loadImages();
    function loadImages() {
        cover_img = new Image();
        cover_img.onload = function () {
            bg_img = new Image();
            bg_img.onload = function () {
                bgDraw();
                requestAnimationFrame(foodCropAnimation);
            }
            bg_img.src = "./assets/images/main2/img_dish.png"
        }
        cover_img.src = "./assets/images/main2/img_dishCover.png"
    }

    function bgDraw() {
        gl_bg.drawImage(bg_img, 0, 0, 220, 220);
        gl_cover.drawImage(cover_img, 0, 0, 220, 220);
    }

    function foodCropAnimation() {
        var cropOffset = canvas_cover.getBoundingClientRect().top;
        var start = 300;
        var end = 200;
        gl_cover.drawImage(cover_img, 0, 0, 220, 220);
        if (cropOffset >= end && cropOffset < start) {
            var per = (1 - (cropOffset - end) / (start - end)) * 440;
            gl_cover.clearRect(0, 0, per, 440);
        }
        else if (cropOffset < end) {
            gl_cover.clearRect(0, 0, 440, 440);
        }

        var text0 = document.getElementById("sec03-text0");
        if (text0.getBoundingClientRect().top <= 400 && text0.getBoundingClientRect().top > 100)
            text0.classList.add("fade");
        else if (text0.getBoundingClientRect().top <= 100)
            text0.classList.remove("fade");
        var text1 = document.getElementById("sec03-text1");
        if (text1.getBoundingClientRect().top < 400 && text1.getBoundingClientRect().top > 100)
            text1.classList.add("fade");
        else if (text1.getBoundingClientRect().top <= 100)
            text1.classList.remove("fade");
        var text2 = document.getElementById("sec04-text");
        if (text2.getBoundingClientRect().top < 400 && text2.getBoundingClientRect().top > 100)
            text2.classList.add("fade");
        else if (text2.getBoundingClientRect().top <= 100)
            text2.classList.remove("fade");


        requestAnimationFrame(foodCropAnimation);
    }

    //Fade Object Animation


    var pinTrigger = document.getElementById("sec06-pin");
    var scene6 = document.getElementById("scroll-scene06");
    var scene = new ScrollMagic.Scene({ triggerElement: pinTrigger, duration: 3000, offset: 275 })
        .setPin(scene6)
        .addTo(controller);


    // sec4 shader canvas
    // Get A WebGL context
    /** @type {HTMLCanvasElement} */
    var canvas = document.querySelector("#glcanvas");
    var gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }

    // setup GLSL program
    var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader", "fragment-shader"]);

    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, "a_position");
    var texcoordLocation = gl.getAttribLocation(program, "a_texcoord");
    var dog_texcoordLocation = gl.getAttribLocation(program, "a_dog_texcoord");

    // lookup uniforms
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");
    var textureLocation = gl.getUniformLocation(program, "u_texture");
    var textureLocation_flow = gl.getUniformLocation(program, "u_texture_flow");

    var dog_textureLocation = gl.getUniformLocation(program, "u_dog_texture");
    var dog_textureLocation_flow = gl.getUniformLocation(program, "u_dog_texture_flow");

    var timeLocation = gl.getUniformLocation(program, "u_time");
    var strengthLocation = gl.getUniformLocation(program, "distortionStrength");
    gl.useProgram(program)
    // Create a buffer.
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Put a 2 unit quad in the buffer
    var positions = [
        -1, -1,
        -1, 1,
        1, -1,
        1, -1,
        -1, 1,
        1, 1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Create a buffer for texture coords
    var texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);


    // Put texcoords in the buffer
    var tex_size = 1.5
    var texcoords = [
        0, 0,
        0, tex_size,
        tex_size, 0,
        tex_size, 0,
        0, tex_size,
        tex_size, tex_size,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);

    var dog_texcoordbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, dog_texcoordbuffer);

    var dog_tex_size = 1.0
    var dog_texcoords = [
        0, 0,
        0, dog_tex_size,
        dog_tex_size, 0,
        dog_tex_size, 0,
        0, dog_tex_size,
        dog_tex_size, dog_tex_size,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dog_texcoords), gl.STATIC_DRAW);

    function requestCORSIfNotSameOrigin(img, url) {
        if ((new URL(url, window.location.href)).origin !== window.location.origin) {
            img.crossOrigin = "";
        }
    }

    // creates a texture info { width: w, height: h, texture: tex }
    // The texture will start with 1x1 pixels and be updated
    // when the image has loaded
    function loadImageAndCreateTextureInfo(url, isFlow) {
        var tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        // Fill the texture with a 1x1 blue pixel.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([0, 0, 255, 255]));

        // let's assume all images are not a power of 2
        if (!isFlow) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        var textureInfo = {
            width: 1,   // we don't know the size until it loads
            height: 1,
            texture: tex,
        };
        var img = new Image();

        if (!isFlow) {
            img.addEventListener('load', function () {
                textureInfo.width = img.width;
                textureInfo.height = img.height;

                gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);

                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            });
        }

        else {
            img.addEventListener('load', function () {
                textureInfo.width = img.width;
                textureInfo.height = img.height;

                gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
                var ext = gl.getExtension('EXT_sRGB');

                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            });
        }

        requestCORSIfNotSameOrigin(img, url);
        img.src = url;
        canvas.style.backgroundImage = "";
        return textureInfo;
    }

    var texInfo1 = loadImageAndCreateTextureInfo('./assets/images/main2/smoke.png', false);
    var texInfo2 = loadImageAndCreateTextureInfo('./assets/images/main2/smoke_flow.png', true);
    var texInfo3 = loadImageAndCreateTextureInfo('./assets/images/main2/nose.png', false);
    var texInfo4 = loadImageAndCreateTextureInfo('./assets/images/main2/nose_flow.png', true);

    function render(time) {
        time *= 0.001; // convert to seconds

        // webglUtils.resizeCanvasToDisplaySize(gl.canvas);
        gl.clearColor(0.0, 0.0, 0.0, 0.0);  // Clear to black, fully opaque
        gl.clearDepth(1.0);                 // Clear everything
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);
        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texInfo1.texture);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texInfo2.texture);
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, texInfo3.texture);
        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_2D, texInfo4.texture);

        // Setup the attributes to pull data from our buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        gl.enableVertexAttribArray(texcoordLocation);
        gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, dog_texcoordbuffer);
        gl.enableVertexAttribArray(dog_texcoordLocation);
        gl.vertexAttribPointer(dog_texcoordLocation, 2, gl.FLOAT, false, 0, 0);

        var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        var matrix = m4.scaling(1, aspect, 1);
        matrix = m4.scale(matrix, 1.2, -1.2, 1);
        matrix = gl.uniformMatrix4fv(matrixLocation, false, matrix);

        // Tell the shader to get the texture from texture unit 0
        gl.uniform1i(textureLocation, 0);
        gl.uniform1i(textureLocation_flow, 1);
        gl.uniform1i(dog_textureLocation, 2);
        gl.uniform1i(dog_textureLocation_flow, 3);
        gl.uniform1f(timeLocation, time);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    var swiper = new Swiper('.swiper-container', {
        speed: 600,
        parallax: true,
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
})