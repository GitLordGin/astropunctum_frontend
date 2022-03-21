export const toAllowedRange = (number, min, max, factor) => {
    number = (min < number) ? number : min;
    number = (max > number) ? number : max;
    number = Math.round(number * factor) / factor;
    return(number);
}