export const getAllBlocking = (deps, items) => {
  let blockingIDs = [];
  if (items.length === 0) return [];
  items.map(item => {
    blockingIDs = [
      ...blockingIDs,
      ...deps[item].blockingIDs,
      ...getAllBlocking(deps, deps[item].blockingIDs)
    ];
  })
  // Return blockingIDs while also removing duplicates
  return [...new Set(blockingIDs)];
}