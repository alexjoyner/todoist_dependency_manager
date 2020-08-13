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

export const getDeepestWaitingLevel = (deps, itemID) => {
  let deepestWaitingLevel = -1;
  deps[itemID].waitingIDs.map(itemWaitingId => {
    if(deps[itemWaitingId].level > deepestWaitingLevel){
      deepestWaitingLevel = deps[itemWaitingId].level
    }
    if(deepestWaitingLevel === -1){
      deepestWaitingLevel = 0
    }
  });
  return deepestWaitingLevel;
}