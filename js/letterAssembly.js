define(['js/wordLogic', 'js/configuration', 'js/letterQueue', 'js/letterContainer', 'js/button',
        'js/letterStatistics', 'js/label', 'js/animationManager', 'js/transitionAnimation',
        'js/batchAnimation', 'js/inputBlocker'],
    function (WordLogic, Configuration, LetterQueue, LetterContainer, Button, LetterStatistics, Label,
        AnimationManager, TransitionAnimation, BatchAnimation, InputBlocker)
    {
        return {
            letterContainers: [],
            currentScore: 0,
            highScore: 0,
            bestWord: '',
            multiplier: 1,

            initialize: function ()
            {
                this.letterContainers.push(new LetterContainer('a1'));
                this.letterContainers.push(new LetterContainer('a2'));
                this.letterContainers.push(new LetterContainer('a3'));
                this.letterContainers.push(new LetterContainer('a4'));
                this.letterContainers.push(new LetterContainer('a5'));
                this.letterContainers.push(new LetterContainer('a6'));
                this.letterContainers.push(new LetterContainer('a7'));
                this.letterContainers.push(new LetterContainer('a8'));

                LetterStatistics.initialize();

                this.failLabel = new Label("Invalid Word!");
                this.failLabel.textAlign = "center";
                this.failLabel.color.a = 0;

                this.multiplierLabel = new Label("Multiplier:");
                this.multiplierValueLabel = new Label("1x");

                this.submitButton = new Button("Submit", this.onSubmitButtonClicked.bind(this));
            },

            onResize: function (canvas, letterLength)
            {
                this.letterLength = letterLength;
                this.margin = this.letterLength / 10;

                var totalMargin = this.letterContainers.length * this.margin;
                var sideMargin = window.innerWidth - (this.letterContainers.length * this.letterLength + totalMargin);
                var currentPositionX = sideMargin / 2;
                var currentPositionY = window.innerHeight / 2;

                this.failLabel.x = window.innerWidth / 2;
                this.failLabel.y = currentPositionY - letterLength;
                this.failLabel.fontSize = letterLength / 3;

                this.multiplierLabel.x = currentPositionX;
                this.multiplierLabel.y = currentPositionY - this.margin * 2;
                this.multiplierLabel.fontSize = letterLength / 3;

                var context = canvas.getContext('2d');
                context.font = this.multiplierLabel.fontSize + "px Arial";
                var textWidth = context.measureText(this.multiplierLabel.text).width;

                this.multiplierValueLabel.x = currentPositionX + textWidth + this.margin;
                this.multiplierValueLabel.y = currentPositionY - this.margin * 2;
                this.multiplierValueLabel.fontSize = letterLength / 3;

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
                this.submitButton.y = window.innerHeight / 2 + this.letterLength + this.margin * 10;
                this.submitButton.onResize(this.letterLength);
            },

            onRestart: function ()
            {
                LetterStatistics.resetScore();

                for (var i = 0; i < this.letterContainers.length; ++i)
                {
                    this.letterContainers[i].clearLetter();
                }
            },

            render: function (context, deltaTime)
            {
                for (var i = 0; i < this.letterContainers.length; ++i)
                {
                    this.letterContainers[i].render(context, deltaTime);
                }

                this.submitButton.render(context, deltaTime);
                this.failLabel.render(context);
                this.multiplierLabel.render(context);
                this.multiplierValueLabel.render(context);

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
                    this.startSuccessAnimation(letters);
                    LetterStatistics.addScore(score * this.multiplier, word);

                    switch (word.length)
                    {
                    case 4:
                        this.multiplier = 2;
                        break;
                    case 5:
                        this.multiplier = 4;
                        break;
                    case 6:
                        this.multiplier = 8;
                        break;
                    case 7:
                        this.multiplier = 16;
                        break;
                    case 8:
                        this.multiplier = 32;
                        break;
                    default:
                        this.multiplier = 1;
                    }

                    this.multiplierValueLabel.text = this.multiplier + "x";

                    return;
                }

                this.startFailAnimation();
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
                    }.bind(this));

                    fadeBatch.isInputBlocking = true;
                    AnimationManager.addAnimation(fadeBatch);
                }.bind(this));

                batchAnimation.isInputBlocking = true;
                AnimationManager.addAnimation(batchAnimation);
            },

            startFailAnimation: function ()
            {
                this.failLabel.color.a = 1;

                var targetValues = {
                    color:
                    {
                        r: this.failLabel.color.r,
                        g: this.failLabel.color.g,
                        b: this.failLabel.color.b,
                        a: 0
                    }
                };

                var transitionAnimation = new TransitionAnimation(this.failLabel, targetValues, 1000, function ()
                {
                    InputBlocker.disable();
                });

                InputBlocker.enable();
                AnimationManager.addAnimation(transitionAnimation);
            },

            clearAssembly: function ()
            {
                for (var i = 0; i < this.letterContainers.length; ++i)
                {
                    this.letterContainers[i].clearLetter();
                }
            }
        };
    });