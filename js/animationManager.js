define(['js/selectionManager', 'js/inputBlocker', 'js/transitionAnimation', 'js/bobbingAnimation', 'js/batchAnimation'], function (SelectionManager, InputBlocker, TransitionAnimation, BobbingAnimation, BatchAnimation)
{
    function AnimationManager()
    {
        this.activeAnimations = [];
        this.blockingAnimationCount = 0;

        SelectionManager.on("letterSelected", this.onLetterSelected.bind(this));
        SelectionManager.on("selectionReleased", this.removeAnimations.bind(this));
    }

    AnimationManager.prototype.batchAnimations = function (animations, timeInMillseconds, callback)
    {
        var batchAnimation = new BatchAnimation(animations, timeInMillseconds, callback);
        this.addAnimation(batchAnimation);
    };

    AnimationManager.prototype.onLetterSelected = function (letter)
    {
        var animation = new BobbingAnimation(letter, 250);
        this.activeAnimations.push(animation);
    };

    AnimationManager.prototype.removeAnimations = function (letter)
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

    AnimationManager.prototype.transition = function (letter, targetValues, timeInMillseconds, callback)
    {
        this.removeAnimations(letter);
        this.blockingAnimationReferenceCount++;
        InputBlocker.enable();

        var animation = new TransitionAnimation(letter, targetValues, timeInMillseconds,
            this.onBlockingAnimationCompleted.bind(this, callback));

        this.activeAnimations.push(animation);
    };

    AnimationManager.prototype.update = function (deltaTime)
    {
        for (var i = 0; i < this.activeAnimations.length; ++i)
        {
            var animation = this.activeAnimations[i];
            var incrementAmount = deltaTime / (animation.endTime || animation.intervalTime);

            animation.elapsedTime += deltaTime;
            animation.update(incrementAmount);

            if (animation.elapsedTime >= animation.endTime)
            {
                this.removeAnimation(animation);
            }
        }
    };

    AnimationManager.prototype.addAnimation = function (animation)
    {
        if (animation.isInputBlocking)
        {
            InputBlocker.enable();
            this.blockingAnimationCount++;
        }

        this.activeAnimations.push(animation);
    };

    AnimationManager.prototype.removeAnimation = function (animation)
    {
        animation.finish();

        this.activeAnimations.splice(this.activeAnimations.indexOf(animation), 1);

        if (animation.isInputBlocking)
        {
            this.blockingAnimationCount--;
            if (this.blockingAnimationCount === 0)
            {
                InputBlocker.disable();
            }
        }
    };

    return new AnimationManager();
});