define([], function ()
{
    function Label(text, x, y, fontSize)
    {
        this.x = x;
        this.y = y;
        this.scaleX = 1;
        this.scaleY = 1;
        this.text = text;
        this.fontSize = fontSize;
        this.textAlign = "left";
        this.color = {
            r: 255,
            g: 255,
            b: 255,
            a: 1
        };
    }

    Label.prototype.setScale = function () {

    };

    Label.prototype.render = function (context)
    {
        context.fillStyle = "rgba(" + Math.floor(this.color.r) + ", " + Math.floor(this.color.g) + ", " + Math.floor(this.color.b) + ", " + this.color.a + ")";
        context.font = this.fontSize + "px Arial";
        context.textAlign = this.textAlign;
        context.fillText(this.text, this.x, this.y);
    };

    return Label;
});