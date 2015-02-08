define(['js/wordLogic', 'js/configuration', 'js/letterQueue', 'js/letterContainer', 'js/button', 'js/letterStatistics', 'js/animationManager', 'js/transitionAnimation', 'js/batchAnimation', 'js/selectionManager'], function (WordLogic, Configuration, LetterQueue, LetterContainer, Button, LetterStatistics, AnimationManager, TransitionAnimation, BatchAnimation, SelectionManager)
{
    return {
        letterContainers: [],
        currentScore: 0,
        highScore: 0,
        bestWord: '',
        wordsPerMinute: 0,

        initialize: function ()
        {
            this.letterContainers.push(new LetterContainer());
            this.letterContainers.push(new LetterContainer());
            this.letterContainers.push(new LetterContainer());
            this.letterContainers.push(new LetterContainer());
            this.letterContainers.push(new LetterContainer());
            this.letterContainers.push(new LetterContainer());
            this.letterContainers.push(new LetterContainer());
            this.letterContainers.push(new LetterContainer());

            LetterStatistics.initialize();

            this.submitButton = new Button("Submit", this.onSubmitButtonClicked.bind(this));
        },

        onResize: function (canvas)
        {
            var lengthModifier = (canvas.clientWidth > canvas.clientHeight) ? canvas.clientHeight : canvas.clientWidth;
            this.letterLength = lengthModifier / 10;
            this.margin = this.letterLength / 10;

            var totalMargin = this.letterContainers.length * this.margin;
            var sideMargin = window.innerWidth - (this.letterContainers.length * this.letterLength + totalMargin);
            var currentPositionX = sideMargin / 2;
            var currentPositionY = window.innerHeight / 2;

            LetterStatistics.onResize(canvas, this.letterLength, this.margin, currentPositionX, currentPositionY + this.letterLength + this.margin * 2);

            for (var i = 0; i < this.letterContainers.length; ++i)
            {
                var letterContainer = this.letterContainers[i];
                letterContainer.x = currentPositionX;
                letterContainer.y = currentPositionY;
                letterContainer.onResize(this.letterLength);

                currentPositionX += this.letterLength + this.margin;
            }

            this.submitButton.x = currentPositionX - this.letterLength * 2 - this.margin;
            this.submitButton.y = window.innerHeight / 2 + this.letterLength + this.margin * 2;
            this.submitButton.onResize(this.letterLength);
        },

        render: function (context, deltaTime)
        {
            for (var i = 0; i < this.letterContainers.length; ++i)
            {
                this.letterContainers[i].render(context, deltaTime);
            }

            this.submitButton.render(context, deltaTime);

            LetterStatistics.render(context);
        },

        onSubmitButtonClicked: function ()
        {
            var word = '';
            var score = 0;
            var letters = [];

            for (var i = 0; i < this.letterContainers.length; ++i)
            {
                var letterContainer = this.letterContainers[i];

                var letter = letterContainer.letter;
                if (letter)
                {
                    letters.push(letter);
                    var letterValue = letter.letterValue;
                    score += Configuration.letterChoices[letterValue].score;
                    word += letterValue;
                }
            }

            if (WordLogic.isValidWord(word))
            {
                SelectionManager.releaseSelection();
                this.startSuccessAnimation(letters);

                LetterStatistics.addScore(score, word);
            }
        },

        startSuccessAnimation: function (letters)
        {
            var transitions = [];
            var totalMargin = letters.length * this.margin;
            var sideMargin = window.innerWidth - (letters.length * this.letterLength + totalMargin);
            var currentPositionX = sideMargin / 2;

            for (var i = 0; i < letters.length; ++i)
            {
                var targetValues = {
                    x: currentPositionX,
                    y: window.innerHeight / 2 - this.letterLength * 1.5
                };

                transitions.push(new TransitionAnimation(letters[i], targetValues));

                currentPositionX += this.letterLength + this.margin;
            }

            var batchAnimation = new BatchAnimation(transitions, 200, function ()
            {
                var fadeAnimations = [];

                for (i = 0; i < letters.length; ++i)
                {
                    var letter = letters[i];

                    var fadeTargetValues = {
                        color:
                        {
                            r: letter.color.r,
                            g: letter.color.g,
                            b: letter.color.b,
                            a: 0
                        },
                        letterOpacity: 0
                    };

                    fadeAnimations.push(new TransitionAnimation(letters[i], fadeTargetValues));
                }

                var fadeBatch = new BatchAnimation(fadeAnimations, 1000, function ()
                {
                    this.clearAssembly();
                    LetterQueue.selectNextLetter();
                }.bind(this));

                fadeBatch.isInputBlocking = true;
                AnimationManager.addAnimation(fadeBatch);
            }.bind(this));

            batchAnimation.isInputBlocking = true;
            AnimationManager.addAnimation(batchAnimation);
        },

        clearAssembly: function ()
        {
            for (var i = 0; i < this.letterContainers.length; ++i)
            {
                this.letterContainers[i].letter = null;
            }
        }
    };
});