var videoElement = $("#video")[0];

$(videoElement).chromeContext({
    items: [{
            title: 'Hello',
            onclick: function () {
                console.log('hello.');
            }
        },
        {
            separator: true
        },
        {
            title: 'World',
            onclick: function () {
                console.log('world.');
            }
        }
    ]
});

Hammer(videoElement).add(new Hammer.Pan({
    direction: Hammer.DIRECTION_ALL,
    threshold: 1
}));

Hammer(videoElement).on("pan", handleDrag);

var lastPosX = 0;
var lastPosY = 0;
var isDragging = false;

function handleDrag(event) {
    console.log("drag");
    var elem = event.target;
    if (!isDragging) {
        isDragging = true;
        lastPosX = elem.offsetLeft;
        lastPosY = elem.offsetTop;
    }
    var posX = event.deltaX - lastPosX;
    var posY = event.deltaY - lastPosY;
    var changeTime = posX / video.width * 2 * 120;

    console.log(posX);
    video.currentTime += changeTime;

    lastPosX = event.deltaX;
    lastPosY = event.deltaY;

    if (event.isFinal) {
        isDragging = false;
    }
}


Hammer(videoElement).on('tap', function (event) {
    if (isPlaying){
        video.pause();
        isPlaying = false;
    }else{
        video.play();
        isPlaying = false;
    }
    console.log("tap");
});

