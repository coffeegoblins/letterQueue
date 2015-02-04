define([], function ()
{
    'use strict';

    function InputBlocker()
    {
        window.addEventListener('contextmenu', this.preventDefault.bind(this), false);
        window.addEventListener('MSHoldVisual', this.preventDefault.bind(this), false);
        window.addEventListener('selectstart', this.preventDefault.bind(this), false);
        window.addEventListener('wheel', this.preventDefault.bind(this), false);
        window.addEventListener('mousedown', this.preventDefault.bind(this), false);
        window.addEventListener('mousemove', this.preventDefault.bind(this), false);
        window.addEventListener('mouseup', this.preventDefault.bind(this), false);
        window.addEventListener('blur', this.preventDefault.bind(this), false);

        if (('ontouchstart' in window) || ('onmsgesturechange' in window))
        {
            window.addEventListener('touchstart', this.preventDefault.bind(this), false);
            window.addEventListener('touchmove', this.preventDefault.bind(this), false);
            window.addEventListener('touchend', this.preventDefault.bind(this), false);
            window.addEventListener('touchcancel', this.preventDefault.bind(this), false);
            document.body.style.msTouchAction = 'none';
        }
    }

    InputBlocker.prototype.disable = function ()
    {
        this.blockInput = false;
    };

    InputBlocker.prototype.enable = function ()
    {
        this.blockInput = true;
    };

    InputBlocker.prototype.preventDefault = function (e)
    {
        if (this.blockInput)
        {
            e.preventDefault();
        }
    };

    return new InputBlocker();
});