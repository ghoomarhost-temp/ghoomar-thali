// Splits text into span-wrapped words
export function splitWords(el) {
  const text = el.innerText;
  el.innerHTML = text
    .split(' ')
    .map(w => `<span class="word-wrap"><span class="word">${w}</span></span>`)
    .join(' ');
  return el.querySelectorAll('.word');
}
