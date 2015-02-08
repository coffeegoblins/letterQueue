define(['js/animationManager', 'js/letterQueue', 'js/letterStorage', 'js/letterAssembly', 'js/letterStatistics', 'js/button'],
    function (AnimationManager, LetterQueue, LetterStorage, LetterAssembly, LetterStatistics, Button)
    {
        'use strict';

        return {
            initialize: function (canvas)
            {
                this.previousTimeStamp = 0;
                this.context = canvas.getContext("2d");
                this.canvas = canvas;

                this.restartButton = new Button("Restart Game", this.onRestartButtonClicked.bind(this));

                LetterStorage.initialize();
                LetterAssembly.initialize();

                this.onResize();

                LetterQueue.initialize();

                this.subscriptions = {};
            },

            onResize: function ()
            {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;

                var lengthModifier = (this.canvas.clientWidth > this.canvas.clientHeight) ? this.canvas.clientHeight : this.canvas.clientWidth;
                this.letterLength = lengthModifier / 10;

                LetterQueue.onResize(this.canvas);
                LetterStorage.onResize(this.canvas);
                LetterAssembly.onResize(this.canvas);

                AnimationManager.onResize(this.canvas);

                this.restartButton.onResize(this.letterLength);
                this.restartButton.width = this.letterLength * 4;
                this.restartButton.x = this.canvas.clientHeight / 100;
                this.restartButton.y = this.canvas.height - this.restartButton.height - this.canvas.clientHeight / 100;
                this.restartButton.setScale(1, 1);
            },

            onRestartButtonClicked: function ()
            {
                LetterStatistics.resetScore();
                location.reload();
                this.trigger('restart');
            },

            render: function (timeStamp)
            {
                var deltaTime = timeStamp - this.previousTimeStamp;

                AnimationManager.update(deltaTime);
                LetterStorage.render(this.context, deltaTime);
                LetterAssembly.render(this.context, deltaTime);
                LetterQueue.render(this.context, deltaTime);

                this.restartButton.render(this.context);

                this.previousTimeStamp = timeStamp;
            },

            on: function (event, callback, context)
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
            },

            trigger: function (event)
            {
                if (this.subscriptions[event])
                {
                    for (var i = 0; i < this.subscriptions[event].length; ++i)
                    {
                        var subscription = this.subscriptions[event][i];
                        subscription.callback.call(subscription.context);
                    }
                }
            }
        };
    });