define([], function ()
{
    function Label(text, x, y, fontSize)
    {
        this.x = x;
        this.y = y;
        this.text = text;
        this.fontSize = fontSize;
    }

    Label.prototype.render = function (context)
    {
        context.fillStyle = "white";
        context.font = this.fontSize + "px Arial";
        context.textAlign = "left";
        context.fillText(this.text, this.x, this.y);
    };

    return Label;
});