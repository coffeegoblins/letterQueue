define([], function ()
{
    function FadeAnimation(targetObject, targetOpacity, timeInMillseconds, callback)
    {
        this.targetObject = targetObject;
        this.targetOpacity = targetOpacity;
        this.deltaOpacity = targetOpacity - targetObject.color.a;
        this.endTime = timeInMillseconds;
        this.elapsedTime = 0;
        this.callback = callback;
    }

    FadeAnimation.prototype.update = function (deltaTime)
    {
        this.elapsedTime += deltaTime;

        var decrementAmount = deltaTime / this.endTime * this.deltaOpacity;

        this.targetObject.color.a += decrementAmount;
        this.targetObject.color.a = Math.round((this.targetObject.color.a + 0.00001) * 100) / 100;
        this.targetObject.letterOpacity += decrementAmount;

        if (this.elapsedTime > this.endTime)
        {
            this.targetObject.color.a = this.targetOpacity;
            this.targetObject.letterOpacity = this.targetOpacity;

            if (this.callback)
            {
                this.callback();
            }
        }
    };

    return FadeAnimation;
});