define(['js/selectionManager'], function (SelectionManager)
{
    function Button(text, callback)
    {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.text = text;
        this.setScale(1, 1);
        this.callback = callback;
        this.borderFillStyle = "rgb(0, 0, 0)";

        SelectionManager.addBoundary(this);
    }

    Button.prototype.setScale = function (scaleX, scaleY)
    {
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.scaledWidth = this.width * scaleX;
        this.scaledHeight = this.height * scaleY;
    };

    Button.prototype.onResize = function (letterLength)
    {
        this.width = letterLength * 2;
        this.height = letterLength;
        this.setScale(1, 1);
    };

    Button.prototype.onTouchStart = function (touch)
    {
        touch.element = touch;
        this.borderFillStyle = "rgb(255, 255, 255)";
    };

    Button.prototype.onTouchExit = function ()
    {
        this.borderFillStyle = "rgb(0, 0, 0)";
    };

    Button.prototype.onTouchEnter = function ()
    {
        this.borderFillStyle = "rgb(255, 255, 255)";
    };

    Button.prototype.onTouchEnd = function ()
    {
        this.borderFillStyle = "rgb(0, 0, 0)";
        
        if (this.callback)
        {
            this.callback();
        }
    };

    Button.prototype.render = function (context)
    {
        // Background
        context.fillStyle = "rgb(245, 245, 200)";
        context.fillRect(this.x, this.y,
            this.scaledWidth, this.scaledHeight);

        // Border
        context.strokeStyle = this.borderFillStyle;
        context.strokeRect(this.x, this.y, this.scaledWidth, this.scaledHeight);

        // Text
        context.font = this.scaledHeight / 2 + "px Arial";
        context.fillStyle = "black";
        context.textAlign = "center";
        context.fillText(this.text, this.x + this.scaledWidth / 2, this.y + this.scaledHeight / 1.5);
    };

    return Button;
});