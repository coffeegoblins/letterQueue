define(['js/selectionManager', 'js/inputBlocker', 'js/transitionAnimation', 'js/bobbingAnimation'], function (SelectionManager, InputBlocker, TransitionAnimation, BobbingAnimation)
{
    function Animation()
    {
        this.activeAnimations = [];
        SelectionManager.on("letterSelected", this.onLetterSelected.bind(this));
        SelectionManager.on("selectionReleased", this.removeAnimations.bind(this));
    }

    Animation.prototype.onLetterSelected = function (letter)
    {
        this.bobLetter(letter, 350);
    };

    Animation.prototype.removeAnimations = function (letter)
    {
        for (var i = 0; i < this.activeAnimations.length; ++i)
        {
            var animation = this.activeAnimations[i];
            if (animation.targetObject === letter)
            {
                if (animation.resetValues)
                {
                    animation.resetValues();
                }
                
                this.activeAnimations.splice(this.activeAnimations.indexOf(animation), 1);
                return;
            }
        }
    };

    Animation.prototype.transition = function (letter, targetValues, timeInMillseconds, callback)
    {
        this.removeAnimations(letter);
        
        var animation = new TransitionAnimation(letter, targetValues, timeInMillseconds,
            this.resetValues.bind(this, callback));

        this.activeAnimations.push(animation);
    };

    Animation.prototype.resetValues = function (callback, animation)
    {
        this.activeAnimations.splice(this.activeAnimations.indexOf(animation), 1);

        animation.targetObject.x = animation.targetValues.x;
        animation.targetObject.y = animation.targetValues.y;
        animation.targetObject.letterOpacity = animation.targetValues.letterOpacity;
        animation.targetObject.color.r = animation.targetValues.color.r;
        animation.targetObject.color.g = animation.targetValues.color.g;
        animation.targetObject.color.b = animation.targetValues.color.b;
        animation.targetObject.color.a = animation.targetValues.color.a;
        animation.targetObject.setScale(animation.targetValues.scaleX, animation.targetValues.scaleY);

        if (callback)
        {
            callback();
        }
    };

    Animation.prototype.bobLetter = function (letter, timeInMilliseconds)
    {
        var animation = new BobbingAnimation(letter, timeInMilliseconds);
        this.activeAnimations.push(animation);
    };

    Animation.prototype.update = function (deltaTime)
    {
        for (var i = 0; i < this.activeAnimations.length; ++i)
        {
            this.activeAnimations[i].update(deltaTime);
        }
    };

    return new Animation();
});