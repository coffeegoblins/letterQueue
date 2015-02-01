define([], function ()
{
    function Letter(letterLength)
    {
        this.score = 1;
        this.x = 0;
        this.y = 0;
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

    Letter.prototype.setScale = function (scaleX, scaleY)
    {
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.scaledWidth = this.width * scaleX;
        this.scaledHeight = this.height * scaleY;
    };

    Letter.prototype.render = function (context, deltaTime)
    {
        // Background
        context.fillStyle = "rgba(" + Math.floor(this.color.r) + ", " + Math.floor(this.color.g) + ", " + Math.floor(this.color.b) + ", " + Math.floor(this.color.a) + ")";
        context.fillRect(this.x, this.y, this.scaledWidth, this.scaledHeight);

        // Letter
        context.font = this.scaledWidth * 0.75 + "px Arial";
        var marginLeft = (this.scaledWidth - context.measureText(this.letterValue).width) / 2;
        context.fillStyle = "rgba(0, 0, 0, " + this.letterOpacity + ")";
        context.fillText(this.letterValue, this.x + marginLeft, this.y + this.scaledWidth * 0.75);

        // Score
        context.font = this.scaledWidth * 0.2 + "px Arial";
        var marginRight = this.scaledWidth - context.measureText(this.score).width * 1.75;
        context.fillStyle = "rgba(0, 0, 0, " + this.letterOpacity + ")";
        context.fillText(this.score, this.x + marginRight, this.y + this.scaledHeight - marginRight);
    };

    return Letter;
});