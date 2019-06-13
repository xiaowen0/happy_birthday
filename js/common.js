/**
 * Created by wen on 2016/12/22.
 */

if (typeof(ImagePreloadHelper) === 'undefined')
{
    var ImagePreloadHelper = new Object();
    (function(helper)
    {
        helper.count = 0;
        helper.loaded = 0;
        helper.list = [];
        helper.image_list = [];
        helper.callback = (function(){;});

        helper.preload = (function(list, callback)
        {
            for (var i=0; i<list.length; i++)
            {
                // save image url to list
                this.list.push(list[i]);
                this.count++;

                // create a image object to load url
                var image_item = new Image();
                image_item.onload = (function(){
                    ImagePreloadHelper.imageLoadedCallback(this);
                });
                image_item.src = list[i];

                // save image to list
                this.image_list.push(image_item);
            }

            // set callback function
            if (typeof(callback) == "function")
            {
                this.callback = callback;
            }
        });

        helper.imageLoadedCallback = (function(image)
        {
            this.loaded++;
            if (this.loaded == this.count)
            {
                this.callback();
            }
        });

    })(ImagePreloadHelper);
}

