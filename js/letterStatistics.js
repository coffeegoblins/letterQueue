define(['js/label', 'js/renderer'], function (Label, Renderer)
{
    return {
        currentScore: localStorage.getItem('currentScore') || 0,
        highScore: localStorage.getItem('highScore') || 0,
        highestScoringWord: localStorage.getItem('highestScoringWord') || '',
        highestScoringWordScore: localStorage.getItem('highestScoringWordScore') || 0,
        longestWord: localStorage.getItem('longestWord') || '',

        initialize: function ()
        {
            this.scoreLabel = new Label("Score");
            this.scoreValueLabel = new Label(this.currentScore.toString());
            this.highScoreLabel = new Label("High Score");
            this.highScoreValueLabel = new Label(this.highScore.toString());
            this.highestScoringWordLabel = new Label("Highest Scoring Word");
            this.highestScoringWordValueLabel = new Label(this.highestScoringWord.toString());
            this.longestWordLabel = new Label("Longest Word");
            this.longestWordValueLabel = new Label(this.longestWord.toString());

            Renderer.addRenderable(this.scoreLabel);
            Renderer.addRenderable(this.scoreValueLabel);
            Renderer.addRenderable(this.highScoreLabel);
            Renderer.addRenderable(this.highScoreValueLabel);
            Renderer.addRenderable(this.highestScoringWordLabel);
            Renderer.addRenderable(this.highestScoringWordValueLabel);
            Renderer.addRenderable(this.longestWordLabel);
            Renderer.addRenderable(this.longestWordValueLabel);
        },

        onResize: function (canvas, letterLength, margin, x, y)
        {
            this.context = canvas.getContext('2d');
            this.scoreLabel.fontSize = letterLength / 3;
            this.highScoreLabel.fontSize = letterLength / 3;
            this.highestScoringWordLabel.fontSize = letterLength / 3;
            this.longestWordLabel.fontSize = letterLength / 3;

            this.scoreValueLabel.fontSize = letterLength / 3;
            this.highScoreValueLabel.fontSize = letterLength / 3;
            this.highestScoringWordValueLabel.fontSize = letterLength / 3;
            this.longestWordValueLabel.fontSize = letterLength / 3;

            this.context.font = this.highestScoringWordLabel.fontSize + "px Arial";
            var marginRight = this.context.measureText(this.highestScoringWordLabel.text).width * 1.5;

            this.scoreLabel.x = x;
            this.scoreLabel.y = y + this.scoreLabel.fontSize;
            this.scoreValueLabel.x = x + marginRight;
            this.scoreValueLabel.y = y + this.scoreValueLabel.fontSize;

            y += this.scoreLabel.fontSize + margin;

            this.highScoreLabel.x = x;
            this.highScoreLabel.y = y + this.highScoreLabel.fontSize;
            this.highScoreValueLabel.x = x + marginRight;
            this.highScoreValueLabel.y = y + this.highScoreValueLabel.fontSize;

            y += this.scoreLabel.fontSize + margin;

            this.highestScoringWordLabel.x = x;
            this.highestScoringWordLabel.y = y + this.highestScoringWordLabel.fontSize;
            this.highestScoringWordValueLabel.x = x + marginRight;
            this.highestScoringWordValueLabel.y = y + this.highestScoringWordValueLabel.fontSize;

            y += this.scoreLabel.fontSize + margin;

            this.longestWordLabel.x = x;
            this.longestWordLabel.y = y + this.longestWordLabel.fontSize;
            this.longestWordValueLabel.x = x + marginRight;
            this.longestWordValueLabel.y = y + this.longestWordValueLabel.fontSize;
        },

        addScore: function (score, word)
        {
            this.currentScore = parseInt(this.currentScore) + score;
            localStorage.setItem('currentScore', this.currentScore);
            this.scoreValueLabel.text = this.currentScore.toString();

            if (this.currentScore > this.highScore)
            {
                this.highScore = this.currentScore;
                this.highScoreValueLabel.text = this.highScore.toString();
                localStorage.setItem('highScore', this.highScore);
            }

            if (score > this.highestScoringWordScore)
            {
                this.highestScoringWordScore = score;
                this.highestScoringWordValueLabel.text = word;
                localStorage.setItem('highestScoringWord', word);
                localStorage.setItem('highestScoringWordScore', score);
            }

            if (word.length > this.longestWord.length)
            {
                this.longestWord = word;
                this.longestWordValueLabel.text = word;
                localStorage.setItem('longestWord', word);
            }
        },

        resetScore: function ()
        {
            this.currentScore = 0;
            localStorage.setItem('currentScore', 0);
        }
    };
});