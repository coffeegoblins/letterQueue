define(['./inputBlocker'], function (InputBlocker)
{
    'use strict';

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

    return {
        moveLetter: function (sourceContainer, targetContainer, milliseconds, callback)
        {
            InputBlocker.enable();
            
            var sourcePosition = getPosition(sourceContainer);
            var targetPosition = getPosition(targetContainer);

            var div = document.createElement('div');
            div.innerHTML = sourceContainer.innerHTML;
            div.classList.add('letterContainer');
            div.classList.add('letterCarrier');
            div.style.opacity = sourceContainer.style.opacity;
            div.style.top = sourcePosition.y;
            div.style.left = sourcePosition.x;
            div.style.width = sourceContainer.offsetWidth + "px";
            div.style.minHeight = sourceContainer.offsetHeight + "px";
            div.style.fontSize = sourceContainer.style.fontSize;
            div.style.display = 'table';

            sourceContainer.innerHTML = '';

            document.body.appendChild(div);

            var intervalAmount = milliseconds / 10;
            var intervalX = (targetPosition.x - parseFloat(div.style.left, 10)) / intervalAmount;
            var intervalY = (targetPosition.y - parseFloat(div.style.top, 10)) / intervalAmount;
            var intervalHeight = (targetContainer.offsetHeight - sourceContainer.offsetHeight) / intervalAmount;
            var intervalOpacity = (targetContainer.style.opacity - sourceContainer.style.opacity) / intervalAmount;
            var intervalFont = (targetContainer.style.fontSize - sourceContainer.style.fontSize) / intervalAmount;

            var i = 0;

            var moveInterval = setInterval(function ()
            {
                var floatTop = parseFloat(div.style.top, 10);
                floatTop += intervalY;
                div.style.top = floatTop + "px";

                var floatLeft = parseFloat(div.style.left, 10);
                floatLeft += intervalX;
                div.style.left = floatLeft + "px";

                div.style.minHeight = parseFloat(div.style.minHeight, 10) + intervalHeight;
                div.style.opacity = parseFloat(div.style.opacity, 10) + intervalOpacity;
                div.style.fontSize = parseFloat(div.style.fontSize, 10) + intervalFont;

                if (i === intervalAmount)
                {
                    clearInterval(moveInterval);

                    targetContainer.innerHTML = div.innerHTML;
                    div.innerHTML = '';
                    document.body.removeChild(div);
                    
                    InputBlocker.disable();
                    
                    if (callback)
                    {
                        callback();
                    }
                }

                ++i;
            }, 10);
        }
    };
});
