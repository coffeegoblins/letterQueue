define([], function ()
{
    function BobAnimation(letter, timeInMillseconds)
    {
        this.targetObject = letter;
        this.elapsedTime = 0;
        this.intervalTime = timeInMillseconds;
        this.incrementDirection = 1;

        this.onResize();
    }

    BobAnimation.prototype.resetValues = function ()
    {
        this.targetObject.y = this.originalY;
    };

    BobAnimation.prototype.onResize = function ()
    {
        this.currentThreshold = 0;
        this.originalY = this.targetObject.y;
        this.lowerThreshold = -this.targetObject.height / 10;
        this.upperThreshold = this.targetObject.height / 10;
        this.deltaThreshold = this.upperThreshold - this.lowerThreshold;
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