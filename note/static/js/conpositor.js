//插入排序
function sort7(array) {
  var len = array.length,
    i, j, k, tmp, result;

  result = array.slice(0);
  for (i = 0; i < len; i++) {
    k = i;
    for (j = i + 1; j < len; j++) {
      if (result[j] < result[k]) k = j;
    }
    if (k != i) {
      tmp = result[k];
      result[k] = result[i];
      result[i] = tmp;
    }
  }
  return result;
}
//快速排序
function quickSort(array, left, right) {
  if (Object.prototype.toString.call(array).slice(8, -1) === 'Array' && typeof left === 'number' && typeof right === 'number') {
    if (left < right) {
      var x = array[right],
        i = left - 1,
        temp;
      for (var j = left; j <= right; j++) {
        if (array[j] <= x) {
          i++;
          temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }
      }
      quickSort(array, left, i - 1);
      quickSort(array, i + 1, right);
    };
  } else {
    return 'array is not an Array or left or right is not a number!';
  }
}
var aaa = [3, 5, 2, 9, 1];
quickSort(aaa, 0, aaa.length - 1);
console.log(aaa);