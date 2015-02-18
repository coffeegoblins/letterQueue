define(['js/letter', 'js/configuration', 'js/animationManager', 'js/selectionManager', 'js/transitionAnimation', 'js/batchAnimation', 'js/inputBlocker', 'js/renderer'], function (Letter, Configuration, AnimationManager, SelectionManager, TransitionAnimation, BatchAnimation, InputBlocker, Renderer)
{
    return {
        transitionTime: 200,
        totalTime: 0,
        letters: [],
        maxLetters: 8,
        animationReferenceCount: 0,
        cycleLettersQueue: [],

        initialize: function ()
        {
            InputBlocker.enable();

            SelectionManager.on('letterPlaced', this.onLetterPlaced, this);

            var letterValues = localStorage.getItem('letterQueue');
            if (letterValues && letterValues.length > 0)
            {
                this.existingLetters = JSON.parse(letterValues);

                if (this.existingLetters)
                {
                    for (var i = 0; i < this.existingLetters.length; ++i)
                    {
                        var letter = new Letter(0, this.existingLetters[i]);
                        this.letters.push(letter);
                        Renderer.addRenderable(letter, i);
                    }

                    this.onResize(null, this.letterLength);
                    this.onLettersCycled();
                    return;
                }
            }

            this.cycleLetters();
        },

        onRestart: function ()
        {
            localStorage.setItem('letterQueue', null);
        },

        onLetterPlaced: function (letter)
        {
            if (this.nextLetter === letter)
            {
                this.letters.splice(this.letters.indexOf(letter), 1);

                if (this.letters.length < this.maxLetters)
                {
                    InputBlocker.enable();
                    this.cycleLetters();
                    return;
                }
            }
        },

        cycleLetters: function ()
        {
            var startPosition = this.targetValues[0];

            var letterValue = this.getRandomLetter();

            var letter = new Letter(this.letterLength);
            letter.x = startPosition.x;
            letter.y = startPosition.y;
            letter.color.r = startPosition.color.r;
            letter.color.g = startPosition.color.g;
            letter.color.b = startPosition.color.b;
            letter.color.a = 0;
            letter.setScale(0, 0);
            letter.letterOpacity = 0;
            letter.letterValue = letterValue;
            letter.score = Configuration.letterChoices[letterValue].score;

            this.letters.unshift(letter);

            Renderer.addRenderable(letter, 0);

            var animations = [];

            for (var i = 0; i < this.letters.length; ++i)
            {
                animations.push(new TransitionAnimation(this.letters[i], this.targetValues[i]));
            }

            AnimationManager.addAnimation(new BatchAnimation(animations, 200, this.onLettersCycled.bind(this)));
        },

        onLettersCycled: function ()
        {
            var letterValues = [];
            for (var i = 0; i < this.letters.length; ++i)
            {
                var letter = this.letters[i];
                Renderer.removeRenderable(letter);

                this.letters[i].zIndex++;

                Renderer.addRenderable(letter, this.letters[i].zIndex);

                letterValues.push(this.letters[i].getSaveValues());
            }

            if (this.letters.length < this.maxLetters)
            {
                this.cycleLetters();
                return;
            }

            localStorage.setItem('letterQueue', JSON.stringify(letterValues));

            InputBlocker.disable();
        },

        onResize: function (canvas, letterLength)
        {
            this.margin = letterLength / 2;
            this.letterLength = letterLength;

            this.targetValues = [
                {
                    x: this.letterLength / 10,
                    y: this.margin + letterLength / 1.5,
                    scaleX: 0.2,
                    scaleY: 0.2,
                    color:
                    {
                        r: 149,
                        g: 30,
                        b: 25,
                        a: 1
                    },
                    letterOpacity: 0.3
                },
                {
                    y: this.margin + letterLength / 2,
                    scaleX: 0.3,
                    scaleY: 0.3,
                    color:
                    {
                        r: 162,
                        g: 60,
                        b: 50,
                        a: 1
                    },
                    letterOpacity: 0.4
                },
                {
                    y: this.margin + letterLength / 4,
                    scaleX: 0.4,
                    scaleY: 0.4,
                    color:
                    {
                        r: 175,
                        g: 90,
                        b: 75,
                        a: 1
                    },
                    letterOpacity: 0.5
                },
                {
                    y: this.margin,
                    scaleX: 0.5,
                    scaleY: 0.5,
                    color:
                    {
                        r: 188,
                        g: 120,
                        b: 100,
                        a: 1
                    },
                    letterOpacity: 0.6
                },
                {
                    y: this.margin + letterLength / 4,
                    scaleX: 0.6,
                    scaleY: 0.6,
                    color:
                    {
                        r: 202,
                        g: 150,
                        b: 125,
                        a: 1
                    },
                    letterOpacity: 0.7
                },
                {
                    y: this.margin + letterLength / 2,
                    scaleX: 0.7,
                    scaleY: 0.7,
                    color:
                    {
                        r: 215,
                        g: 180,
                        b: 150,
                        a: 1
                    },
                    letterOpacity: 0.8
                },
                {
                    y: this.margin + letterLength,
                    scaleX: 0.8,
                    scaleY: 0.8,
                    color:
                    {
                        r: 218,
                        g: 210,
                        b: 175,
                        a: 1
                    },
                    letterOpacity: 0.9
                },
                {
                    y: this.margin + letterLength + letterLength / 2,
                    scaleX: 1,
                    scaleY: 1,
                    color:
                    {
                        r: 245,
                        g: 245,
                        b: 200,
                        a: 1
                    },
                    letterOpacity: 1
                }];

            for (var i = 1; i < this.targetValues.length; ++i)
            {
                var targetValue = this.targetValues[i];
                var previousValue = this.targetValues[i - 1];

                targetValue.x = previousValue.x + previousValue.scaleX * (letterLength / 2) + letterLength / 10;
            }

            this.x = this.targetValues[this.targetValues.length - 1].x - letterLength;
            this.y = this.targetValues[this.targetValues.length - 1].y - letterLength;
            this.width = this.targetValues[this.targetValues.length - 1].x + letterLength / 10;
            this.height = this.targetValues[this.targetValues.length - 1].y + letterLength / 10;

            SelectionManager.addBoundary(this);

            for (i = 0; i < this.letters.length; ++i)
            {
                var letter = this.letters[i];

                letter.x = this.targetValues[i].x;
                letter.y = this.targetValues[i].y;
                letter.width = letterLength;
                letter.height = letterLength;
                letter.letterOpacity = this.targetValues[i].letterOpacity;
                letter.color.r = this.targetValues[i].color.r;
                letter.color.g = this.targetValues[i].color.g;
                letter.color.b = this.targetValues[i].color.b;
                letter.color.a = this.targetValues[i].color.a;
                letter.setScale(this.targetValues[i].scaleX, this.targetValues[i].scaleY);
            }
        },

        onTouchStart: function (touch)
        {
            this.letters[this.letters.length - 1].onTouchStart(touch);
        },

        onTouchEnter: function () {

        },

        onTouchExit: function () {

        },

        onTouchEnd: function (touch)
        {
            if (touch.targetBoundary.element === this)
            {
                touch.element.cancelTouch(touch);
            }
        },

        letterTransitionComplete: function (callback)
        {
            this.animationReferenceCount--;

            if (this.animationReferenceCount === 0)
            {
                if (this.cycleLettersQueue.length > 0)
                {
                    this.cycleLettersQueue.shift();
                    this.cycleLetters();
                    return;
                }

                if (callback)
                {
                    callback();
                }
            }
        },

        getRandomLetter: function ()
        {
            var randomNumber = Math.floor(Math.random() * Configuration.weightedTotal);

            for (var letterChoice in Configuration.letterChoices)
            {
                randomNumber -= Configuration.letterChoices[letterChoice].count;
                if (randomNumber <= 0)
                {
                    return letterChoice;
                }
            }
        }
    };
});