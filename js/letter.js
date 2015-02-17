define(['js/transitionAnimation', 'js/animationManager', 'js/inputBlocker'], function (TransitionAnimation, AnimationManager, InputBlocker)
{
    function Letter(letterLength, letterValues)
    {
        if (!letterValues)
        {
            letterValues = {};
        }

        this.score = letterValues.score || 1;
        this.x = letterValues.x || 0;
        this.y = letterValues.y || 0;
        this.scaleX = letterValues.scaleX || 1;
        this.scaleY = letterValues.scaleY || 1;
        this.width = letterValues.width || letterLength;
        this.height = letterValues.height || letterLength;
        this.scaledWidth = letterValues.scaledWidth || letterLength;
        this.scaledHeight = letterValues.scaledHeight || letterLength;
        this.setScale(this.scaleX, this.scaleY);
        this.color = letterValues.color ||
        {};
        this.letterValue = letterValues.letterValue || "A";
        this.letterOpacity = letterValues.letterOpacity || 1;
        this.container = letterValues.container;

        this.elapsedTime = null;
        this.deltaTime = null;
        this.deltaPosition = null;
        this.deltaScale = null;
        this.deltaColor = null;
        this.deltaOpacity = null;
    }

    Letter.prototype.getSaveValues = function ()
    {
        return {
            score: this.score,
            x: this.x,
            y: this.y,
            scaleX: this.scaleX,
            scaleY: this.scaleY,
            width: this.width,
            height: this.height,
            scaledWidth: this.scaledWidth,
            scaledHeight: this.scaledHeight,
            color: this.color,
            letterValue: this.letterValue,
            letterOpacity: this.letterOpacity
        };
    };

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

    Letter.prototype.onTouchMove = function (x, y)
    {
        this.x = x;
        this.y = y;
    };

    Letter.prototype.onTouchEnter = function () {

    };

    Letter.prototype.onTouchExit = function () {

    };

    Letter.prototype.cancelTouch = function (touch)
    {
        InputBlocker.enable();
        var transitionAnimation = new TransitionAnimation(this,
            {
                x: touch.originalX,
                y: touch.originalY
            },
            200,
            function ()
            {
                InputBlocker.disable();
            });

        AnimationManager.addAnimation(transitionAnimation);
    };

    Letter.prototype.onTouchEnd = function (touch)
    {
        if (touch.targetBoundary)
        {
            return;
        }

        this.cancelTouch(touch);
    };

    Letter.prototype.render = function (context)
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