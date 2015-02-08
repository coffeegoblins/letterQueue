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

        SelectionManager.addClickEventListener(this, this.onClick.bind(this), true);
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

    Button.prototype.onClick = function ()
    {
        if (this.callback)
        {
            this.callback();
        }
    };

    Button.prototype.render = function (context)
    {
        context.fillStyle = "rgb(245, 245, 200)";
        context.fillRect(this.x, this.y,
            this.scaledWidth, this.scaledHeight);

        context.fillStyle = "rgb(85, 39, 0)";
        context.strokeRect(this.x, this.y, this.scaledWidth, this.scaledHeight);

        context.font = this.scaledHeight / 2 + "px Arial";
        context.fillStyle = "black";
        context.textAlign = "center";
        context.fillText(this.text, this.x + this.scaledWidth / 2, this.y + this.scaledHeight / 1.5);
    };

    return Button;
});