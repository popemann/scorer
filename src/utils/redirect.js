export const onClickLink = (path) => {
  window.history.pushState(undefined, undefined, path);
  const navEvent = new PopStateEvent('popstate');
  window.dispatchEvent(navEvent);
}