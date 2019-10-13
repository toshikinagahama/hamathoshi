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
            title: 'キャンセル',
            onclick: function () {
                $('.cctx:visible').hide();
            }
        }
    ]
});

function triggerEvent(element, event) {
    if (document.createEvent) {
        // IE以外
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent(event, true, true); // event type, bubbling, cancelable
        return element.dispatchEvent(evt);
    } else {
        // IE
        var evt = document.createEventObject();
        return element.fireEvent("on" + event, evt)
    }
}

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

    var menu = $('.cctx[data-cctxId="' + $(videoElement).attr('data-cctxId') + '"]');
    console.log(event.center);

    menu.css('top', event.center.y).css('left', event.center.x).show();


    if (isPlaying){
        video.pause();
        isPlaying = false;
    }else{
        video.play();
        isPlaying = false;
    }

    console.log("tap");

});

Hammer(videoElement).on('press', function (event) {
    var menu = $('.cctx[data-cctxId="' + $(videoElement).attr('data-cctxId') + '"]');
    console.log(event.center);

    menu.css('top', event.center.y).css('left', event.center.x).show();
});
