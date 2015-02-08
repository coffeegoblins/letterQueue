define(['js/letterContainer'], function (LetterContainer)
{
    return {
        letterContainers: [],
        margin: 10,

        initialize: function ()
        {
            this.letterContainers.push(new LetterContainer());
            this.letterContainers.push(new LetterContainer());
            this.letterContainers.push(new LetterContainer());
            this.letterContainers.push(new LetterContainer());
        },

        onResize: function (canvas)
        {
            var lengthModifier = (canvas.clientWidth > canvas.clientHeight) ? canvas.clientHeight : canvas.clientWidth;
            var letterLength = lengthModifier / 10;
            this.margin = letterLength / 10;

            var totalMargin = this.letterContainers.length * this.margin;
            var currentPosition = window.innerWidth - this.letterContainers.length * letterLength - totalMargin;

            for (var i = 0; i < this.letterContainers.length; ++i)
            {
                var letterContainer = this.letterContainers[i];

                letterContainer.x = currentPosition;
                letterContainer.y = this.margin;
                letterContainer.onResize(letterLength);

                currentPosition += letterLength + this.margin;
            }
        },

        render: function (context, deltaTime)
        {
            for (var i = 0; i < this.letterContainers.length; ++i)
            {
                this.letterContainers[i].render(context, deltaTime);
            }
        }
    };
});