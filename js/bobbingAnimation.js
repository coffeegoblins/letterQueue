define([], function ()
{
    function BobAnimation(letter, timeInMillseconds)
    {
        this.targetObject = letter;
        this.originalY = this.targetObject.y;
        this.elapsedTime = 0;
        this.intervalTime = timeInMillseconds;

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

    BobAnimation.prototype.update = function (incrementAmount)
    {
        var modifiedIncrementAmount = incrementAmount * this.incrementDirection * this.deltaThreshold;

        this.currentThreshold += modifiedIncrementAmount;

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