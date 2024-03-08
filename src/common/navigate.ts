export const NAVIGATE_EVENT = 'navigate';
export const navigateTo = (path: string) => {
  const event = new CustomEvent(NAVIGATE_EVENT, { detail: path });
  document.dispatchEvent(event);
};
