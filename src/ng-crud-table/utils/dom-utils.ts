export function getHeight(el): number {
  let height = el.offsetHeight;
  const style = getComputedStyle(el);
  height -= parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
  height -= parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
  return height;
}
