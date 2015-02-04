define(['js/wordLogic', 'js/configuration', 'js/letterContainer', 'js/button', 'js/animationManager', 'js/transitionAnimation', 'js/batchAnimation'], function (WordLogic, Configuration, LetterContainer, Button, AnimationManager, TransitionAnimation, BatchAnimation)
{
    return {
        margin: 10,
        letterContainers: [],

        initialize: function (letterLength)
        {
            this.letterContainers.push(new LetterContainer(letterLength));
            this.letterContainers.push(new LetterContainer(letterLength));
            this.letterContainers.push(new LetterContainer(letterLength));
            this.letterContainers.push(new LetterContainer(letterLength));
            this.letterContainers.push(new LetterContainer(letterLength));
            this.letterContainers.push(new LetterContainer(letterLength));
            this.letterContainers.push(new LetterContainer(letterLength));
            this.letterContainers.push(new LetterContainer(letterLength));

            this.submitButton = new Button("Submit", 0, 0, letterLength * 2, letterLength, this.onSubmitButtonClicked.bind(this));

            this.onResize(letterLength);
        },

        onResize: function (letterLength)
        {
            this.letterLength = letterLength;

            var totalMargin = this.letterContainers.length * this.margin;
            var sideMargin = window.innerWidth - (this.letterContainers.length * letterLength + totalMargin);
            var currentPositionX = sideMargin / 2;
            var currentPositionY = window.innerHeight / 2;

            for (var i = 0; i < this.letterContainers.length; ++i)
            {
                this.letterContainers[i].x = currentPositionX;
                this.letterContainers[i].y = currentPositionY;

                currentPositionX += letterLength + this.margin;
            }

            this.submitButton.x = currentPositionX - letterLength * 2 - this.margin;
            this.submitButton.y = currentPositionY + letterLength + this.margin * 2;
        },

        render: function (context, deltaTime)
        {
            for (var i = 0; i < this.letterContainers.length; ++i)
            {
                this.letterContainers[i].render(context, deltaTime);
            }

            this.submitButton.render(context, deltaTime);
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
                this.startSuccessAnimation(letters);
                //                // TODO Animation word and fade
                //                this.totalScore += score;
                //
                //                if (this.totalScore > this.highScoreContainer)
                //                {
                //                    this.highScoreContainer.innerHTML = this.totalScore;
                //                    localStorage.setItem('highScore', this.totalScore);
                //                }
                //
                //                this.fadeText(document.getElementById('displayText'), score + 'Points!', 1000);
                //                return;
            }


            // this.fadeText(document.getElementById('displayText'), 'Invalid word!', 1000);
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

                var fadeBatch = new BatchAnimation(fadeAnimations, 200, function ()
                {
                    this.clearAssembly();
                }.bind(this));

                AnimationManager.addAnimation(fadeBatch);
            }.bind(this));

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