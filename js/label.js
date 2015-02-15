define([], function ()
{
    function Label(text, x, y, fontSize)
    {
        this.x = x;
        this.y = y;
        this.text = text;
        this.fontSize = fontSize;
        this.textAlign = "left";
    }

    Label.prototype.render = function (context)
    {
        context.fillStyle = "white";
        context.font = this.fontSize + "px Arial";
        context.textAlign = this.textAlign;
        context.fillText(this.text, this.x, this.y);
    };

    return Label;
});