define(['text!./optimizedTrie.txt', ], function (WordTrie)
{
    'use strict';
    WordTrie = JSON.parse(WordTrie);

    function findInNode(node, value)
    {
        for (var i = value.length; i > 0; --i)
        {
            var key = value.substring(0, i);
            if (node[key])
            {
                value = value.substring(i);
                if (value.length === 0)
                {
                    return node[key].$;
                }

                return findInNode(node[key], value);
            }
        }

        return null;
    }

    return {
        isValidWord: function (word)
        {
            return findInNode(WordTrie, word.toLowerCase());
        }
    };
});
