define([], function ()
{
    function TransitionAnimation(letter, targetValues, timeInMilliseconds, callback)
    {
        this.targetObject = letter;
        this.callback = callback;
        this.elapsedTime = 0;
        this.endTime = timeInMilliseconds;

        this.targetValues = targetValues;
        this.targetValues.x = this.selectValue(targetValues.x, letter.x);
        this.targetValues.y = this.selectValue(targetValues.y, letter.y);
        this.targetValues.scaleX = this.selectValue(targetValues.scaleX, letter.scaleX);
        this.targetValues.scaleY = this.selectValue(targetValues.scaleY, letter.scaleY);
        this.targetValues.letterOpacity = this.selectValue(targetValues.letterOpacity, letter.letterOpacity);
        this.targetValues.color = this.selectValue(targetValues.color, letter.color);

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

    // This function is necessary since 0 is falsey and the target values can be zero
    TransitionAnimation.prototype.selectValue = function (targetValue, letterValue)
    {
        if (targetValue !== null && targetValue !== undefined)
        {
            return targetValue;
        }

        return letterValue;
    };

    TransitionAnimation.prototype.update = function (incrementAmount)
    {
        this.targetObject.x += this.deltaX * incrementAmount;
        this.targetObject.y += this.deltaY * incrementAmount;
        this.targetObject.letterOpacity += this.deltaOpacity * incrementAmount;
        this.targetObject.color.r += this.deltaColor.r * incrementAmount;
        this.targetObject.color.g += this.deltaColor.g * incrementAmount;
        this.targetObject.color.b += this.deltaColor.b * incrementAmount;
        this.targetObject.color.a += this.deltaColor.a * incrementAmount;

        this.targetObject.setScale(this.targetObject.scaleX + this.deltaScaleX * incrementAmount,
            this.targetObject.scaleY + this.deltaScaleY * incrementAmount);
    };

    TransitionAnimation.prototype.finish = function ()
    {
        this.targetObject.x = this.targetValues.x;
        this.targetObject.y = this.targetValues.y;
        this.targetObject.letterOpacity = this.targetValues.letterOpacity;
        this.targetObject.color.r = this.targetValues.color.r;
        this.targetObject.color.g = this.targetValues.color.g;
        this.targetObject.color.b = this.targetValues.color.b;
        this.targetObject.color.a = this.targetValues.color.a;

        this.targetObject.setScale(this.targetValues.scaleX, this.targetValues.scaleY);

        if (this.callback)
        {
            this.callback();
        }
    };

    return TransitionAnimation;
});