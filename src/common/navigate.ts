export const NAVIGATE_EVENT = 'navigate';
export const navigateTo = (path: string) => {
  const event = new CustomEvent(NAVIGATE_EVENT, { detail: path });
  document.dispatchEvent(event);
};

export enum SourceTab {
  SignedOff = 1,
  Approved = 2,
  Processed = 3,
  Draft = 4,
}
