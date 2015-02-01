define([], function ()
{
    function SelectionManager()
    {
        this.clickBoundaries = [];

        this.canvas = document.body.firstElementChild;
        this.canvas.addEventListener('click', this.onClick.bind(this), true);
        this.selectedLetter = null;
        this.sourceContainer = null;
        this.subscriptions = {};
    }

    SelectionManager.prototype.addClickEventListener = function (element, callback, capture)
    {
        this.clickBoundaries.push(
        {
            element: element,
            callback: callback,
            capture: capture
        });
    };

    SelectionManager.prototype.selectLetter = function (letter)
    {
        this.releaseSelection();
        this.selectedLetter = letter;

        this.trigger("letterSelected", letter);
    };

    SelectionManager.prototype.selectContainer = function (container)
    {
        this.selectLetter(container.letter);
        this.sourceContainer = container;
    };

    SelectionManager.prototype.onClick = function (e)
    {
        var selectionFound = false;

        for (var i = 0; i < this.clickBoundaries.length; ++i)
        {
            var boundary = this.clickBoundaries[i];

            if (e.pageX >= boundary.element.x && e.pageX <= boundary.element.x + boundary.element.width &&
                e.pageY >= boundary.element.y && e.pageY <= boundary.element.y + boundary.element.height)
            {
                selectionFound = true;
                if (boundary.callback)
                {
                    boundary.callback();
                }

                if (boundary.capture)
                {
                    return;
                }
            }
        }

        if (!selectionFound)
        {
            this.trigger('bodySelected');
        }
    };

    SelectionManager.prototype.releaseSelection = function ()
    {
        var tempLetter = this.selectedLetter;
        this.selectedLetter = null;
        this.sourceContainer = null;

        this.trigger('selectionReleased', tempLetter);
    };

    SelectionManager.prototype.on = function (event, callback, context)
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
    };

    SelectionManager.prototype.trigger = function (event, data)
    {
        if (this.subscriptions[event])
        {
            for (var i = 0; i < this.subscriptions[event].length; ++i)
            {
                var subscription = this.subscriptions[event][i];
                subscription.callback.call(subscription.context, data);
            }
        }
    };

    return new SelectionManager();
});