define([], function ()
{
    var renderables = [];

    return {
        addRenderable: function (renderable, zIndex)
        {
            renderable.zIndex = zIndex || 0;

            var index = 0;
            for (var i = renderables.length - 1; i >= 0; --i)
            {
                if (renderables[i].zIndex <= renderable.zIndex)
                {
                    index = i;
                    break;
                }
            }

            renderables.splice(index + 1, 0, renderable);
        },

        removeRenderable: function (renderable)
        {
            var index = renderables.indexOf(renderable);

            if (index !== -1)
            {
                renderables.splice(index, 1);
            }
        },

        render: function (context, deltaTime)
        {
            for (var i = 0; i < renderables.length; ++i)
            {
                renderables[i].render(context, deltaTime);
            }
        }
    };
});