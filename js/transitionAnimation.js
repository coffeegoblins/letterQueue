define([], function ()
{
    function TransitionAnimation(targetObject, targetValueObject, timeInMilliseconds, callback)
    {
        this.targetObject = targetObject;
        this.targetValueObject = targetValueObject;
        this.callback = callback;
        this.elapsedTime = 0;
        this.endTime = timeInMilliseconds;
        this.targetValues = {};

        this.onResize();
    }

    // This function is necessary since 0 is falsey and the target values can be zero
    TransitionAnimation.prototype.selectValue = function (targetValue, targetObjectValue)
    {
        if (targetValue !== null && targetValue !== undefined)
        {
            return targetValue;
        }

        return targetObjectValue;
    };

    TransitionAnimation.prototype.onResize = function ()
    {
        this.elapsedTime = 0;
        this.targetValues.x = this.selectValue(this.targetValueObject.x, this.targetObject.x);
        this.targetValues.y = this.selectValue(this.targetValueObject.y, this.targetObject.y);
        this.targetValues.scaleX = this.selectValue(this.targetValueObject.scaleX, this.targetObject.scaleX);
        this.targetValues.scaleY = this.selectValue(this.targetValueObject.scaleY, this.targetObject.scaleY);
        this.targetValues.letterOpacity = this.selectValue(this.targetValueObject.letterOpacity, this.targetObject.letterOpacity);
        this.targetValues.color = this.selectValue(this.targetValueObject.color, this.targetObject.color);

        this.deltaX = this.targetValues.x - this.targetObject.x;
        this.deltaY = this.targetValues.y - this.targetObject.y;
        this.deltaScaleX = this.targetValues.scaleX - this.targetObject.scaleX;
        this.deltaScaleY = this.targetValues.scaleY - this.targetObject.scaleY;
        this.deltaOpacity = this.targetValues.letterOpacity - this.targetObject.letterOpacity;
        this.deltaColor = {
            r: this.targetValues.color.r - this.targetObject.color.r,
            g: this.targetValues.color.g - this.targetObject.color.g,
            b: this.targetValues.color.b - this.targetObject.color.b,
            a: this.targetValues.color.a - this.targetObject.color.a
        };
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