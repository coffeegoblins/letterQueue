define([], function ()
{
    function BatchAnimation(animations, timeInMilliseconds, callback)
    {
        this.animations = animations;
        this.callback = callback;
        this.elapsedTime = 0;
        this.endTime = timeInMilliseconds;
    }

    BatchAnimation.prototype.finish = function ()
    {
        for (var i = 0; i < this.animations.length; ++i)
        {
            this.animations[i].finish();
        }

        if (this.callback)
        {
            this.callback();
        }
    };

    BatchAnimation.prototype.update = function (incrementAmount)
    {
        for (var i = 0; i < this.animations.length; ++i)
        {
            this.animations[i].update(incrementAmount);
        }
    };

    return BatchAnimation;
});