define(['js/inputBlocker', 'js/animationManager', 'js/bobbingAnimation', 'js/transitionAnimation'], function (InputBlocker, AnimationManager, BobbingAnimation, TransitionAnimation)
{
    function getEventObj(e)
    {
        return {
            identifier: e.identifier,
            pageX: e.pageX,
            pageY: e.pageY,
            target: e.target
        };
    }

    function SelectionManager()
    {
        this.boundaries = [];
        this.startTouches = {};

        this.canvas = document.body.firstElementChild;

        if (('ontouchstart' in window) || ('onmsgesturechange' in window))
        {
            window.addEventListener('touchstart', this.onTouchStart.bind(this), false);
            window.addEventListener('touchmove', this.onTouchMove.bind(this), false);
            window.addEventListener('touchend', this.onTouchEnd.bind(this), false);
            document.body.style.msTouchAction = 'none';
        }

        this.selectedLetter = null;
        this.sourceContainer = null;
        this.subscriptions = {};
    }

    SelectionManager.prototype.addBoundary = function (element, callback, preventDefault)
    {
        this.boundaries.push(
        {
            element: element,
            callback: callback,
            preventDefault: preventDefault
        });
    };

    SelectionManager.prototype.removeBoundary = function (element)
    {
        for (var i = 0; i < this.boundaries.length; ++i)
        {
            if (this.boundaries[i].element === element)
            {
                this.boundaries.splice(i, 1);
                return;
            }
        }
    };

    SelectionManager.prototype.onTouchStart = function (e)
    {
        if (!InputBlocker.enabled && e.changedTouches)
        {
            for (var i = 0; i < e.changedTouches.length; i++)
            {
                var touch = getEventObj(e.changedTouches[i]);

                var boundary = this.getSelectedBoundary(
                {
                    x: touch.pageX,
                    y: touch.pageY,
                    width: 0,
                    height: 0
                });

                if (!boundary)
                {
                    continue;
                }

                if (boundary.element.onTouchStart)
                {
                    boundary.element.onTouchStart(touch);
                }

                if (touch.element)
                {
                    this.startTouches[touch.identifier] = touch;
                }
            }

            e.preventDefault();
        }
    };

    SelectionManager.prototype.onTouchMove = function (e)
    {
        if (!InputBlocker.enabled && e.changedTouches)
        {
            for (var i = 0; i < e.changedTouches.length; i++)
            {
                var moveTouch = getEventObj(e.changedTouches[i]);

                var startTouch = this.startTouches[moveTouch.identifier];
                if (!startTouch)
                {
                    continue;
                }

                if (startTouch.element.onTouchMove)
                {
                    startTouch.element.onTouchMove(moveTouch.pageX - startTouch.offsetX, moveTouch.pageY - startTouch.offsetY);
                }

                var targetBoundary = this.getSelectedBoundary(startTouch.element);

                if (startTouch.targetBoundary === targetBoundary)
                {
                    continue;
                }

                if (startTouch.targetBoundary)
                {
                    startTouch.targetBoundary.element.onTouchExit();
                }

                startTouch.targetBoundary = targetBoundary;

                if (startTouch.targetBoundary)
                {
                    startTouch.targetBoundary.element.onTouchEnter();
                }
            }

            e.preventDefault();
        }
    };

    SelectionManager.prototype.onTouchEnd = function (e)
    {
        if (!InputBlocker.enabled && e.changedTouches)
        {
            for (var i = 0; i < e.changedTouches.length; i++)
            {
                var endTouch = getEventObj(e.changedTouches[i]);

                var startTouch = this.startTouches[endTouch.identifier];
                if (!startTouch)
                {
                    continue;
                }

                delete this.startTouches[endTouch.identifier];

                var targetBoundary = this.getSelectedBoundary(startTouch.element);
                if (targetBoundary)
                {
                    targetBoundary.element.onTouchEnd(startTouch);
                }

                startTouch.targetBoundary = targetBoundary;
                startTouch.element.onTouchEnd(startTouch);
            }
        }

        if (this.selectedTarget)
        {
            this.selectedTarget.element.onClick();
        }

        this.selectedTarget = null;
    };

    SelectionManager.prototype.getSelectedBoundary = function (selectedElement)
    {
        var selectedBoundaries = [];

        var selectedTop = selectedElement.y;
        var selectedBottom = selectedElement.y + selectedElement.height;
        var selectedLeft = selectedElement.x;
        var selectedRight = selectedElement.x + selectedElement.width;
        var targetTop;
        var targetBottom;
        var targetLeft;
        var targetRight;

        for (var i = 0; i < this.boundaries.length; ++i)
        {
            var element = this.boundaries[i].element;
            if (element === selectedElement)
            {
                continue;
            }

            targetTop = element.y;
            targetBottom = element.y + element.height;
            targetLeft = element.x;
            targetRight = element.x + element.width;

            // These can't be true if it's an actual collision
            if (selectedBottom <= targetTop || selectedTop >= targetBottom ||
                selectedRight <= targetLeft || selectedLeft >= targetRight)
            {
                continue;
            }

            selectedBoundaries.push(this.boundaries[i]);
        }

        var collisionArea = 0;
        var selectedBoundary = null;

        for (i = 0; i < selectedBoundaries.length; ++i)
        {
            var boundary = selectedBoundaries[i];
            var targetElement = boundary.element;

            targetTop = targetElement.y;
            targetBottom = targetElement.y + targetElement.scaledHeight;
            targetLeft = targetElement.x;
            targetRight = targetElement.x + targetElement.scaledWidth;

            var xOverlap = Math.min(targetRight, selectedRight) - Math.max(targetLeft, selectedLeft);
            var yOverlap = Math.min(targetBottom, selectedBottom) - Math.max(targetTop, selectedTop);
            var area = xOverlap * yOverlap;

            if (area >= collisionArea)
            {
                collisionArea = area;
                selectedBoundary = boundary;
            }
        }

        return selectedBoundary;
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