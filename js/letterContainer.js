define(['js/selectionManager', 'js/inputBlocker', 'js/letterQueue', 'js/animation'], function (SelectionManager, InputBlocker, LetterQueue, Animation)
{
    function LetterContainer(letterLength)
    {
        this.x = 0;
        this.y = 0;
        this.width = letterLength;
        this.height = letterLength;
        this.scaledWidth = this.width;
        this.scaledHeight = this.height;

        SelectionManager.addClickEventListener(this, this.onClick.bind(this), true);
    }

    LetterContainer.prototype.setScale = function (scaleX, scaleY)
    {
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.scaledWidth = this.width * scaleX;
        this.scaledHeight = this.height * scaleY;
    };

    LetterContainer.prototype.render = function (context, deltaTime)
    {
        // Background
        context.fillStyle = "rgba(0, 0, 0, 0.75)";
        context.strokeRect(this.x, this.y, this.scaledWidth, this.scaledHeight);

        if (this.letter)
        {
            this.letter.render(context, deltaTime);
        }
    };

    LetterContainer.prototype.onClick = function ()
    {
        var selectedLetter = SelectionManager.selectedLetter;
        var selectedContainer = selectedLetter.container;

        if (selectedContainer === this)
        {
            return;
        }

        if (!this.letter)
        {
            // No blocking actions, just place the letter
            this.placeLetter(selectedLetter, function ()
            {
                if (selectedContainer)
                {
                    // The source is another container
                    selectedContainer.letter = null;
                    LetterQueue.selectNextLetter();
                    return;
                }

                // The source is the letter queue
                LetterQueue.letters.pop();
                LetterQueue.cycleLetters(function () {
                    LetterQueue.selectNextLetter();
                });
            });

            return;
        }

        if (selectedContainer)
        {
            // The source is another container, but we have a letter
            this.swapLetters(selectedContainer, this);
            return;
        }

        // The source is the letter queue, but we have a letter
        SelectionManager.selectLetter(this.letter);
    };

    LetterContainer.prototype.swapLetters = function (containerA, containerB)
    {
        var tempLetter = containerA.letter;

        this.swapCount = 0;

        containerA.placeLetter(containerB.letter, this.onSwapCompleted.bind(this));
        containerB.placeLetter(tempLetter, this.onSwapCompleted.bind(this));
    };

    LetterContainer.prototype.onSwapCompleted = function ()
    {
        this.swapCount++;
        
        if (this.swapCount === 2)
        {
            LetterQueue.selectNextLetter();
        }
    };

    LetterContainer.prototype.placeLetter = function (letter, callback)
    {
        InputBlocker.enable();

        this.letter = letter;
        this.letter.container = this;

        Animation.transition(letter,
        {
            x: this.x,
            y: this.y
        }, 200, this.onLetterPlaced.bind(this, callback));
    };

    LetterContainer.prototype.onLetterPlaced = function (callback)
    {
        if (callback)
        {
            callback();
        }

        InputBlocker.disable();
    };

    return LetterContainer;
});