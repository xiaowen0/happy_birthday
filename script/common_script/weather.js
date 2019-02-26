/**
 * Created by wen on 2017-4-17.
 */

/**
 * get class name of weather icon by text
 * @param text  String
 * @return String
 */
function getWeatherIconClassByText(text)
{
    var classMap = {
        d0 : '晴',
        d1 : '多云',
        d2 : '阴',
        d3 : '阵雨',
        d4 : '雷阵雨',
        d5 : '雷阵雨并伴有冰雹',
        d6 : '雨夹雪',
        d7 : '小雨',
        d8 : '中雨',
        d9 : '大雨',
        d10 : '暴雨',
        d11 : '大暴雨',
        d12 : '特大暴雨',
        d13 : '阵雪',
        d14 : '小雪',
        d15 : '中雪',
        d16 : '大雪',
        d17 : '暴雪',
        d18 : '雾',
        d19 : '台风',
        d20 : '沙尘暴',
        d29 : '浮沉',
        d30 : '扬尘'
    };

    // complete match (priority)
    for (var key in classMap)
    {
        if (classMap[key] === text)
        {
            return key;
        }
    }

    // part match
    for (var key in classMap)
    {
        if (text.indexOf(classMap[key]) >= 0)
        {
            return key;
        }
    }

    return '';
}