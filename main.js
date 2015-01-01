require.nodeRequire = window.requireNode;

require.config(
{
    baseUrl: '',
    shim:
    {},
    paths:
    {
        text: 'lib/text',
        jsonLoader: 'core/src/functions/loadRemoteJSON'
    }
});

require(['./configuration', './inputBlocker', './wordLogic', './animation'],
    function (Configuration, InputBlocker, WordLogic, Animation)
    {
        'use strict';
    
        var totalScore = 0;
        var highScoreContainer;
        var scoreContainer;
        var nextLetterContainer;
        var letterContainers;
        var selectableItems;

        window.addEventListener('error', function (e)
        {
            if (e.error)
            {
                console.log(e.error.message);
                console.log(e.error.stack);
            }
        });

        function onDocumentReady()
        {
            selectableItems = document.getElementsByClassName('selectableItem');
            nextLetterContainer = document.getElementById('nextletterContainer');

            letterContainers = document.getElementsByClassName('letterContainer');
            for (i = 0; i < letterContainers.length; ++i)
            {
                var letterContainer = letterContainers[i];
                setCalculatedLetterSize(letterContainer);
                letterContainer.addEventListener('click', onLetterContainerClicked);

                var style = window.getComputedStyle(letterContainer);
                letterContainer.style.opacity = style.opacity;
            }

            var letterPreviews = document.getElementsByClassName('previewContainer');
            for (var i = 0; i < letterPreviews.length; ++i)
            {
                var letterPreview = letterPreviews[i];
                insertLetter(letterPreview);
            }

            //nextLetter = document.getElementById('nextLetter');
            //nextLetter.parentElement.classList.add('selected');

            // document.body.onresize = onResize;

            var submitButton = document.getElementById('submitButton');
            submitButton.addEventListener('click', onSubmitButtonClicked);

            onResize();
            selectContainer(nextLetterContainer);

            document.body.addEventListener('click', onBodyClicked);

            scoreContainer = document.getElementById('scoreContainer');
            highScoreContainer = document.getElementById('highScoreContainer');
            highScoreContainer.innerHTML = localStorage.getItem('highScore') || 0;
        }

        function onBodyClicked()
        {
            selectContainer(nextLetterContainer);
        }

        function onSubmitButtonClicked()
        {
            var word = '';
            var score = 0;
            var letterContainers = document.getElementsByClassName('assembly');
            var containersWithLetters = [];
            var letters = "";

            for (var i = letterContainers.length - 1; i >= 0; --i)
            {
                var letterContainer = letterContainers[i].firstChild;
                if (letterContainer)
                {
                    var letter = letterContainer.innerHTML[0];
                    letters += letter.toLowerCase();

                    containersWithLetters.push(letterContainers[i]);
                    word += letterContainer.innerHTML[0];
                }
            }

            if (WordLogic.isValidWord(word))
            {
                for (i = 0; i < containersWithLetters.length; ++i)
                {
                    var letter2 = containersWithLetters[i].firstChild.innerHTML[0];

                    score += Configuration.letterChoices[letter2].score;

                    fadeElement(containersWithLetters[i], 1000);
                }

                totalScore += score;
                scoreContainer.innerHTML = totalScore;

                if (totalScore > highScoreContainer.innerHTML)
                {
                    highScoreContainer.innerHTML = totalScore;
                    localStorage.setItem('highScore', totalScore);
                }

                fadeText(document.getElementById('displayText'), score + ' Points!', 1000);
                //detectGameOver(letters);
                return;
            }

            fadeText(document.getElementById('displayText'), 'Invalid word!', 1000);
        }

        function onLetterContainerClicked(e)
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

                if (selectedContainer === nextLetterContainer || container === nextLetterContainer)
                {
                    selectContainer(container);
                    e.stopPropagation();
                    return;
                }

                swapLetters(selectedContainer, container);
                return;
            }

            Animation.moveLetter(selectedContainer, container, 250);
            
            selectContainer(nextLetterContainer);

            if (nextLetterContainer.innerHTML === '')
            {
                cycleLetters();
            }
        }

        function swapLetters(container1, container2)
        {
            Animation.moveLetter(container1, container2, 250);
            Animation.moveLetter(container2, container1, 250);
        }

        function fadeText(div, text, milliseconds)
        {
            div.innerHTML = text;

            fadeElement(div, milliseconds);
        }

        function fadeElement(div, milliseconds)
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
        }

        function whichTransitionEvent()
        {
            var t;
            var el = document.createElement('fakeelement');
            var transitions = {
                'transition': 'transitionend',
                'OTransition': 'oTransitionEnd',
                'MozTransition': 'transitionend',
                'WebkitTransition': 'webkitTransitionEnd'
            };

            for (t in transitions)
            {
                if (el.style[t] !== undefined)
                {
                    return transitions[t];
                }
            }
        }

        function getPosition(element)
        {
            var xPosition = 0;
            var yPosition = 0;

            while (element)
            {
                xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
                yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
                element = element.offsetParent;
            }

            return {
                x: xPosition,
                y: yPosition
            };
        }

        function selectContainer(container)
        {
            for (var i = 0; i < letterContainers.length; ++i)
            {
                letterContainers[i].classList.remove('selected');
            }

            container.classList.add('selected');
        }

        function cycleLetters()
        {
            var letterPreviews = document.getElementsByClassName('previewContainer');
            for (var i = 0; i < letterPreviews.length - 1; ++i)
            {
                Animation.moveLetter(letterPreviews[i + 1], letterPreviews[i], 200);
            }

            insertLetter(letterPreviews[letterPreviews.length - 1]);
            //onResize();
        }

        function onResize()
        {
            var letterQueue = document.getElementById('letterQueue');

            for (var i = 0; i < letterContainers.length; ++i)
            {
                var letterContainer = letterContainers[i];
                if (letterContainer)
                {
                    setCalculatedLetterSize(letterContainer);
                }
            }

            var displayText = document.getElementById('displayText');
            setCalculatedLetterSize(displayText);

            //             var letterContainers = document.getElementsByClassName('letterContainer');
            //             for (var i = 0; i < letterContainers.length; ++i)
            //             {
            //                 var letterContainer = letterContainers[i];
            //                 letterContainer.style.height = letterContainer.offsetWidth;
            //                 setCalculatedLetterSize(letterContainer);
            //             }
            //            var letters = document.getElementsByClassName('letterPreview');
            //            for (i = 0; i < letters.length; ++i)
            //            {
            //                setCalculatedLetterSize(letters[i]);
            //            }
            //
            //            var letterPreviews = document.getElementsByClassName('small');
            //            for (i = 0; i < letterPreviews.length; ++i)
            //            {
            //                var letterPreview = letterPreviews[i].firstElementChild;
            //                //setCalculatedLetterSize(letterPreview);
            //            }
        }

        function setCalculatedLetterSize(element)
        {
            element.style.fontSize = element.offsetHeight / 2 + 'px';
        }

        function insertLetter(div)
        {
            var letter = getRandomLetter();

            var letterDiv = document.createElement('div');
            letterDiv.innerHTML = letter + '<sub>' + Configuration.letterChoices[letter].score + '</sub>';
            letterDiv.classList.add('letterPreview');
            letterDiv.classList.add('letter');

            div.appendChild(letterDiv);
        }

        function getRandomLetter()
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

        if (document.readyState === 'complete')
            onDocumentReady();
        else
            window.addEventListener('load', onDocumentReady, false);
    });