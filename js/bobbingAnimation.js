define([], function ()
{
    function BobAnimation(letter, timeInMilliseconds)
    {
        this.targetObject = letter;
        this.originalY = this.targetObject.y;
        this.endTime = timeInMilliseconds;

        this.currentThreshold = 0;
        this.lowerThreshold = -10;
        this.upperThreshold = 10;
        this.deltaThreshold = this.upperThreshold - this.lowerThreshold;
        this.incrementDirection = 1;
    }

    BobAnimation.prototype.resetValues = function ()
    {
        this.targetObject.y = this.originalY;
    };

    BobAnimation.prototype.update = function (deltaTime)
    {
        this.elapsedTime += deltaTime;

        var incrementAmount = deltaTime / this.endTime * this.incrementDirection * this.deltaThreshold;

        this.currentThreshold += incrementAmount;

        if (this.currentThreshold >= this.upperThreshold)
        {
            this.incrementDirection = -1;
        }

        if (this.currentThreshold <= this.lowerThreshold)
        {
            this.incrementDirection = 1;
        }

        this.targetObject.y = this.originalY + this.currentThreshold;
    };

    return BobAnimation;
});