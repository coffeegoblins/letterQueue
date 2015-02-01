define(['js/adMob', 'js/configuration', 'js/inputBlocker', 'js/wordLogic', 'js/animation', 'js/letterQueue', 'js/letterStorage'],
    function (AdMob, Configuration, InputBlocker, WordLogic, Animation, LetterQueue, LetterStorage)
    {
        'use strict';

        return {
            initialize: function (canvas)
            {
                this.previousTimeStamp = 0;
                this.context = canvas.getContext("2d");
                this.canvas = canvas;
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;

                var letterLength = canvas.clientWidth / 10;

                //                LetterAssembly.initialize(canvas, letterLength);
                //                LetterStash.initialize(canvas, letterLength);
                LetterQueue.initialize(letterLength);
                LetterStorage.initialize(letterLength);

                this.subscriptions = {};

                this.selectableItems = document.getElementsByClassName('selectableItem');
                this.nextLetterContainer = document.getElementById('nextletterContainer');
                this.letterContainers = document.getElementsByClassName('letterContainer');
                this.letterPreviews = document.getElementsByClassName('previewContainer');
                this.restartButton = document.getElementById('restartButton');
                this.submitButton = document.getElementById('submitButton');
                this.scoreContainer = document.getElementById('scoreContainer');
                this.highScoreContainer = document.getElementById('highScoreContainer');
                this.totalScore = 0;

                // this.highScoreContainer.innerHTML = localStorage.getItem('highScore') || 0;

                //                for (var i = 0; i < this.letterContainers.length; ++i)
                //                {
                //                    var letterContainer = this.letterContainers[i];
                //                    this.setCalculatedLetterSize(letterContainer);
                //                    letterContainer.addEventListener('click', this.onLetterContainerClicked.bind(this));
                //
                //                    var style = window.getComputedStyle(letterContainer);
                //                    letterContainer.style.opacity = style.opacity;
                //                }
                //
                //                for (i = this.letterPreviews.length - 1; i >= 0; --i)
                //                {
                //                    var letterPreview = this.letterPreviews[i];
                //                    this.insertLetter(letterPreview);
                //                }
                //
                //                this.restartButton.addEventListener('click', this.onRestartButtonClicked.bind(this));
                //                this.submitButton.addEventListener('click', this.onSubmitButtonClicked.bind(this));
                //
                //                document.body.addEventListener('click', this.onBodyClicked.bind(this));
                //                this.onBodyClicked();
                //
                //                document.body.onresize = this.onResize.bind(this);
                //                this.onResize();
            },

            render: function (timeStamp)
            {
                var deltaTime = timeStamp - this.previousTimeStamp;

                Animation.update(deltaTime);
                LetterStorage.render(this.context, deltaTime);
                LetterQueue.render(this.context, deltaTime);

                this.previousTimeStamp = timeStamp;
            },

            onResize: function ()
            {
                //                 LetterQueue.onResize();
            },

            on: function (event, callback, context)
            {
                if (!this.subscriptions[event])
                {
                    this.subscriptions[event] = [];
                }

                this.subscriptions[event].push(
                {
                    callback: callback,
                    context: context
                });
            },

            trigger: function (event)
            {
                if (this.subscriptions[event])
                {
                    for (var i = 0; i < this.subscriptions[event].length; ++i)
                    {
                        var subscription = this.subscriptions[event][i];
                        subscription.callback.call(subscription.context);
                    }
                }
            },

            onBodyClicked: function ()
            {
                this.selectContainer(this.nextLetterContainer);
            },

            onRestartButtonClicked: function ()
            {
                location.reload();
                this.trigger('restart');
            },

            onSubmitButtonClicked: function ()
            {
                var word = '';
                var score = 0;
                var assemblyContainers = document.getElementsByClassName('assembly');
                var containersWithLetters = [];
                var letters = "";

                for (var i = assemblyContainers.length - 1; i >= 0; --i)
                {
                    var letterContainer = assemblyContainers[i].firstChild;
                    if (letterContainer)
                    {
                        var letter = letterContainer.innerHTML[0];
                        letters += letter.toLowerCase();

                        containersWithLetters.push(assemblyContainers[i]);
                        word += letterContainer.innerHTML[0];
                    }
                }

                if (WordLogic.isValidWord(word))
                {
                    for (i = 0; i < containersWithLetters.length; ++i)
                    {
                        var letter2 = containersWithLetters[i].firstChild.innerHTML[0];

                        score += Configuration.letterChoices[letter2].score;

                        this.fadeElement(containersWithLetters[i], 1000);
                    }

                    this.totalScore += score;
                    this.scoreContainer.innerHTML = this.totalScore;

                    if (this.totalScore > this.highScoreContainer.innerHTML)
                    {
                        this.highScoreContainer.innerHTML = this.totalScore;
                        localStorage.setItem('highScore', this.totalScore);
                    }

                    this.fadeText(document.getElementById('displayText'), score + 'Points!', 1000);
                    return;
                }

                this.fadeText(document.getElementById('displayText'), 'Invalid word!', 1000);
            },

            onLetterContainerClicked: function (e)
            {
                var selectedContainer = document.querySelector('.selected');

                var container = e.currentTarget;
                if (!container.classList.contains('selectableItem') || container === selectedContainer)
                {
                    return;
                }

                if (container.children.length > 0)
                {
                    // Target is not empty

                    if (selectedContainer === this.nextLetterContainer || container === this.nextLetterContainer)
                    {
                        this.selectContainer(container);
                        e.stopPropagation();
                        return;
                    }

                    this.swapLetters(selectedContainer, container);
                    return;
                }

                Animation.moveLetter(selectedContainer, container, 250);

                this.selectContainer(this.nextLetterContainer);

                if (this.nextLetterContainer.innerHTML === '')
                {
                    this.cycleLetters();
                }
            },

            swapLetters: function (container1, container2)
            {
                Animation.moveLetter(container1, container2, 250);
                Animation.moveLetter(container2, container1, 250);
            },

            fadeText: function (div, text, milliseconds)
            {
                div.innerHTML = text;
                this.fadeElement(div, milliseconds);
            },

            fadeElement: function (div, milliseconds)
            {
                div.style.opacity = 1;

                var intervalAmount = milliseconds / 10;
                var intervalOpacity = -1 / intervalAmount;

                var i = 0;

                var fadeInterval = setInterval(function ()
                {
                    div.style.opacity = parseFloat(div.style.opacity, 10) + intervalOpacity;

                    if (i === intervalAmount)
                    {
                        clearInterval(fadeInterval);

                        div.innerHTML = '';
                        div.style.opacity = 1;
                    }

                    ++i;
                }, 10);
            },

            selectContainer: function (container)
            {
                for (var i = 0; i < this.letterContainers.length; ++i)
                {
                    this.letterContainers[i].classList.remove('selected');
                }

                container.classList.add('selected');
            },

            cycleLetters: function ()
            {
                var letterPreviews = document.getElementsByClassName('previewContainer');

                for (var i = 0; i < letterPreviews.length - 1; ++i)
                {
                    Animation.moveLetter(letterPreviews[i + 1], letterPreviews[i], 200);
                }

                this.insertLetter(letterPreviews[letterPreviews.length - 1]);
            },

            setCalculatedLetterSize: function (element)
            {
                //                element.style.fontSize = element.offsetHeight / 2 + 'px';
            },

            insertLetter: function (div)
            {
                var letter = this.getRandomLetter();

                var letterDiv = document.createElement('div');
                letterDiv.innerHTML = letter + '<sub>' + Configuration.letterChoices[letter].score + '</sub>';
                letterDiv.classList.add('letterPreview');
                letterDiv.classList.add('letter');

                div.appendChild(letterDiv);
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