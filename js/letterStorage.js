define(['js/letterContainer', 'js/label', 'js/renderer'], function (LetterContainer, Label, Renderer)
{
    return {
        letterContainers: [],
        label: "Storage",

        initialize: function ()
        {
            this.letterContainers.push(new LetterContainer('s1'));
            this.letterContainers.push(new LetterContainer('s2'));
            this.letterContainers.push(new LetterContainer('s3'));
            this.letterContainers.push(new LetterContainer('s4'));
            this.letterContainers.push(new LetterContainer('s5'));

            this.storageLabel = new Label(this.label);
            this.storageLabel.textAlign = "center";

            Renderer.addRenderable(this.storageLabel);

            for (var i = 0; i < this.letterContainers.length; ++i)
            {
                Renderer.addRenderable(this.letterContainers[i]);
            }
        },

        onResize: function (canvas, letterLength)
        {
            this.margin = letterLength;
            this.letterMargin = letterLength / 10;

            var currentPositionX = window.innerWidth - letterLength - this.letterMargin;

            for (var i = 0; i < this.letterContainers.length; ++i)
            {
                var letterContainer = this.letterContainers[i];

                letterContainer.x = currentPositionX;
                letterContainer.y = this.margin;
                letterContainer.onResize(letterLength);

                currentPositionX -= letterLength + this.letterMargin;
            }

            // Undo the last loop
            currentPositionX += letterLength + this.letterMargin;

            this.storageLabel.x = currentPositionX + (window.innerWidth - currentPositionX) / 2;
            this.storageLabel.y = this.margin - this.letterMargin;
            this.storageLabel.fontSize = letterLength / 3;

            this.textPosition = 0;
        },

        onRestart: function ()
        {
            for (var i = 0; i < this.letterContainers.length; ++i)
            {
                this.letterContainers[i].clearLetter();
            }
        }
    };
});