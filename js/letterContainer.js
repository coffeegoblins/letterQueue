define(['js/selectionManager', 'js/inputBlocker', 'js/letterQueue', 'js/animationManager', 'js/transitionAnimation', 'js/letter'], function (SelectionManager, InputBlocker, LetterQueue, AnimationManager, TransitionAnimation, Letter)
{
    function LetterContainer(id, letterLength)
    {
        this.id = id;

        var storedLetter = localStorage.getItem(id);
        if (storedLetter)
        {
            this.letter = new Letter(letterLength, JSON.parse(storedLetter));
            this.letter.container = this;
        }

        this.x = 0;
        this.y = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.onResize(letterLength);
        this.isSelected = false;

        SelectionManager.addBoundary(this);
    }

    LetterContainer.prototype.clearLetter = function ()
    {
        localStorage.removeItem(this.id);
        this.letter = null;
    };

    LetterContainer.prototype.onResize = function (letterLength)
    {
        this.width = letterLength;
        this.height = letterLength;
        this.scaledWidth = this.width * this.scaleX;
        this.scaledHeight = this.height * this.scaleY;

        if (this.letter && !AnimationManager.isLetterAnimating(this.letter))
        {
            this.letter.x = this.x;
            this.letter.y = this.y;
            this.letter.onResize(letterLength);
        }
    };

    LetterContainer.prototype.setScale = function (scaleX, scaleY)
    {
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.scaledWidth = this.width * scaleX;
        this.scaledHeight = this.height * scaleY;
    };

    LetterContainer.prototype.onTouchStart = function (touch)
    {
        if (this.letter)
        {
            this.letter.onTouchStart(touch);
        }
    };

    LetterContainer.prototype.onTouchExit = function ()
    {
        this.isSelected = false;
    };

    LetterContainer.prototype.onTouchEnter = function ()
    {
        this.isSelected = true;
    };

    LetterContainer.prototype.onTouchEnd = function (touch)
    {
        var letter = touch.element;
        var sourceContainer = letter.container;

        this.isSelected = false;

        if (this.letter && !sourceContainer)
        {
            // The source is the letter queue and we have a letter
            letter.cancelTouch(touch);
            return;
        }

        this.placeLetter(letter, function ()
        {
            if (sourceContainer)
            {
                // The source is another container
                sourceContainer.clearLetter();
                return;
            }

            // The source is the letter queue
            SelectionManager.removeBoundary(LetterQueue.letters.pop());
            LetterQueue.cycleLetters();

        });
    };

    LetterContainer.prototype.onClick = function ()
    {
        var selectedLetter = SelectionManager.selectedLetter;
        if (!selectedLetter)
        {
            if (this.letter)
            {
                SelectionManager.selectLetter(this.letter);
            }

            return;
        }

        SelectionManager.releaseSelection();

        if (selectedLetter === this.letter)
        {
            LetterQueue.selectNextLetter();
            return;
        }

        var selectedContainer = selectedLetter.container;

        if (this.letter)
        {
            if (selectedContainer)
            {
                // The source is another container, but we have a letter
                this.swapLetters(selectedContainer, this);
                return;
            }

            // The source is the letter queue, but we have a letter
            SelectionManager.selectLetter(this.letter);
            return;
        }

        // No blocking actions, just place the letter
        this.placeLetter(selectedLetter, function ()
        {
            if (selectedContainer)
            {
                // The source is another container
                selectedContainer.clearLetter();
                LetterQueue.selectNextLetter();
                return;
            }

            // The source is the letter queue
            LetterQueue.letters.pop();
            LetterQueue.cycleLetters(function ()
            {
                LetterQueue.selectNextLetter();
            });
        });
    };

    LetterContainer.prototype.swapLetters = function (containerA, containerB, callback)
    {
        var tempLetter = containerA.letter;

        this.swapCount = 0;

        containerA.transitionLetter(containerB.letter, this.onTransitionCompleted.bind(this, callback));
        containerB.transitionLetter(tempLetter, this.onTransitionCompleted.bind(this, callback));
    };

    LetterContainer.prototype.onTransitionCompleted = function (callback)
    {
        this.swapCount--;

        if (this.swapCount === 0 && callback)
        {
            callback();
        }
    };

    LetterContainer.prototype.transitionLetter = function (letter, callback)
    {
        this.letter = letter;
        this.letter.container = this;

        var transitionAnimation = new TransitionAnimation(letter, this, 200, this.onLetterPlaced.bind(this, callback));

        AnimationManager.addAnimation(transitionAnimation);
    };

    LetterContainer.prototype.placeLetter = function (placedLetter, callback)
    {
        InputBlocker.enable();

        if (this.letter)
        {
            this.swapLetters(this, placedLetter.container, callback);
            return;
        }

        var container = placedLetter.container;
        if (container)
        {
            placedLetter.container.letter = null;
        }

        this.transitionLetter(placedLetter, callback);
    };

    LetterContainer.prototype.onLetterPlaced = function (callback)
    {
        if (callback)
        {
            callback();
        }

        InputBlocker.disable();

        localStorage.setItem(this.id, JSON.stringify(this.letter.getSaveValues()));
    };

    LetterContainer.prototype.render = function (context, deltaTime)
    {
        context.strokeStyle = "rgba(0, 0, 0, 0.75)";

        if (this.isSelected)
        {
            context.strokeStyle = "rgba(255, 255, 255, 0.75)";
        }

        // Background
        context.strokeRect(this.x, this.y, this.scaledWidth, this.scaledHeight);

        if (this.letter)
        {
            this.letter.render(context, deltaTime);
        }
    };

    return LetterContainer;
});