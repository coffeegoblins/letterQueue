define([], function ()
{
    function TransitionAnimation(letter, targetValues, timeInMilliseconds, callback)
    {
        this.targetObject = letter;
        this.callback = callback;
        this.elapsedTime = 0;
        this.endTime = timeInMilliseconds;
        this.targetValues = targetValues;
        this.targetValues.x = targetValues.x || letter.x;
        this.targetValues.y = targetValues.y || letter.y;
        this.targetValues.scaleX = targetValues.scaleX || letter.scaleX;
        this.targetValues.scaleY = targetValues.scaleY || letter.scaleY;
        this.targetValues.letterOpacity = targetValues.letterOpacity || letter.letterOpacity;
        this.targetValues.color = targetValues.color || letter.color;
        this.deltaX = targetValues.x - letter.x;
        this.deltaY = targetValues.y - letter.y;
        this.deltaScaleX = targetValues.scaleX - letter.scaleX;
        this.deltaScaleY = targetValues.scaleY - letter.scaleY;
        this.deltaOpacity = targetValues.letterOpacity - letter.letterOpacity;
        this.deltaColor = {
            r: this.targetValues.color.r - letter.color.r,
            g: this.targetValues.color.g - letter.color.g,
            b: this.targetValues.color.b - letter.color.b,
            a: this.targetValues.color.a - letter.color.a
        };
    }

    TransitionAnimation.prototype.update = function (deltaTime)
    {
        this.elapsedTime += deltaTime;

        var incrementAmount = deltaTime / this.endTime;

        this.targetObject.x += this.deltaX * incrementAmount;
        this.targetObject.y += this.deltaY * incrementAmount;
        this.targetObject.letterOpacity += this.deltaOpacity * incrementAmount;
        this.targetObject.color.r += this.deltaColor.r * incrementAmount;
        this.targetObject.color.g += this.deltaColor.g * incrementAmount;
        this.targetObject.color.b += this.deltaColor.b * incrementAmount;
        this.targetObject.color.a += this.deltaColor.a * incrementAmount;

        this.targetObject.setScale(this.targetObject.scaleX + this.deltaScaleX * incrementAmount,
            this.targetObject.scaleY + this.deltaScaleY * incrementAmount);

        if (this.elapsedTime >= this.endTime)
        {
            if (this.callback)
            {
                this.callback(this);
            }
        }
    };

    return TransitionAnimation;
});