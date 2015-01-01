define([], function ()
{
    'use strict';

    function InputBlocker()
    {
        window.addEventListener('contextmenu', this.preventDefault, false);
        window.addEventListener('MSHoldVisual', this.preventDefault, false);
        window.addEventListener('selectstart', this.preventDefault, false);
        window.addEventListener('wheel', this.preventDefault, false);
        window.addEventListener('mousedown', this.preventDefault, false);
        window.addEventListener('mousemove', this.preventDefault, false);
        window.addEventListener('mouseup', this.preventDefault, false);
        window.addEventListener('blur', this.preventDefault, false);

        if (('ontouchstart' in window) || ('onmsgesturechange' in window))
        {
            window.addEventListener('touchstart', this.preventDefault, false);
            window.addEventListener('touchmove', this.preventDefault, false);
            window.addEventListener('touchend', this.preventDefault, false);
            window.addEventListener('touchcancel', this.preventDefault, false);
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