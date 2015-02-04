define(['js/letterContainer'], function (LetterContainer)
{
    return {
        letterContainers: [],
        margin: 10,

        initialize: function (letterLength)
        {
            this.letterContainers.push(new LetterContainer(letterLength));
            this.letterContainers.push(new LetterContainer(letterLength));
            this.letterContainers.push(new LetterContainer(letterLength));
            this.letterContainers.push(new LetterContainer(letterLength));

            this.onResize(letterLength);
        },

        onResize: function (letterLength)
        {
            this.letterLength = letterLength;

            var totalMargin = this.letterContainers.length * this.margin;
            var currentPosition = window.innerWidth - this.letterContainers.length * letterLength - totalMargin;

            for (var i = 0; i < this.letterContainers.length; ++i)
            {
                this.letterContainers[i].x = currentPosition;
                this.letterContainers[i].y = this.margin;

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