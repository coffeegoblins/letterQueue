define(['js/transitionAnimation', 'js/animationManager'], function (TransitionAnimation, AnimationManager)
{
    function Letter(letterLength)
    {
        this.score = 1;
        this.x = 0;
        this.y = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.width = letterLength;
        this.height = letterLength;
        this.setScale(1, 1);
        this.color = {};
        this.letterValue = "A";
        this.letterOpacity = 1;

        this.elapsedTime = null;
        this.deltaTime = null;
        this.deltaPosition = null;
        this.deltaScale = null;
        this.deltaColor = null;
        this.deltaOpacity = null;
    }

    Letter.prototype.onResize = function (letterLength)
    {
        this.width = letterLength;
        this.height = letterLength;
        this.scaledWidth = this.width * this.scaleX;
        this.scaledHeight = this.height * this.scaleY;
    };

    Letter.prototype.setScale = function (scaleX, scaleY)
    {
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.scaledWidth = this.width * scaleX;
        this.scaledHeight = this.height * scaleY;
    };

    Letter.prototype.onTouchStart = function (touch)
    {
        touch.element = this;
        touch.originalX = this.x;
        touch.originalY = this.y;
        touch.offsetX = touch.pageX - this.x;
        touch.offsetY = touch.pageY - this.y;
    };

    Letter.prototype.onTouchCancel = function (touch)
    {
        var transitionAnimation = new TransitionAnimation(this,
        {
            x: touch.originalX,
            y: touch.originalY
        }, 200);

        AnimationManager.addAnimation(transitionAnimation);
    };

    Letter.prototype.onTouchMove = function (x, y)
    {
        this.x = x;
        this.y = y;
    };

    Letter.prototype.onTouchEnter = function () {

    };

    Letter.prototype.onTouchExit = function () {

    };

    Letter.prototype.onTouchEnd = function () {

    };

    Letter.prototype.render = function (context, deltaTime)
    {
        // Background
        context.fillStyle = "rgba(" + Math.floor(this.color.r) + ", " + Math.floor(this.color.g) + ", " + Math.floor(this.color.b) + ", " + this.color.a + ")";
        context.fillRect(this.x, this.y, this.scaledWidth, this.scaledHeight);

        // Letter
        context.font = this.scaledWidth * 0.75 + "px Arial";
        context.fillStyle = "rgba(0, 0, 0, " + this.letterOpacity + ")";
        context.textAlign = "center";
        context.fillText(this.letterValue, this.x + this.scaledWidth / 2, this.y + this.scaledWidth * 0.75);

        // Score
        context.font = this.scaledWidth * 0.2 + "px Arial";
        var marginRight = this.scaledWidth - context.measureText(this.score).width * 1.75;
        context.fillStyle = "rgba(0, 0, 0, " + this.letterOpacity + ")";
        context.fillText(this.score, this.x + marginRight, this.y + this.scaledHeight - marginRight);
    };

    return Letter;
});