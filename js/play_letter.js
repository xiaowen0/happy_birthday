/**
 * Created by wen on 2016/12/30.
 */

/**
 * play letter
 * @param   letter_wrapper  HTMLElement     letter wrapper
 * @param   delay           Number          display delay
 */
function playLetter(letter_wrapper, delay)
{
    showLetterSentence(letter_wrapper, 0, delay)
}

/**
 * show letter sentence one by one
 * @param letter_wrapper    HTMLElement     letter wrapper
 * @param sentence_index    Number          index with the sentence to show
 * @param delay             Number          display delay
 */
function showLetterSentence(letter_wrapper, sentence_index, delay)
{
    // get sentence count
    var sentence_count = $(letter_wrapper).children().length;

    // show sentence
    $(letter_wrapper).children().eq(sentence_index).fadeIn();

    // show next sentence
    if (sentence_index+1 < sentence_count)
    {
        window.setTimeout(function(){
            showLetterSentence(letter_wrapper, sentence_index+1, delay)
        }, delay);
    }
}
