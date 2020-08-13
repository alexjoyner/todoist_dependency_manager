export const getAllChildren = (deps, items) => {
  let children = [];
  if (items.length === 0) return [];
  items.map(item => {
    children = [
      ...children,
      ...deps[item].children,
      ...getAllChildren(deps, deps[item].children)
    ];
  })
  // Return children while also removing duplicates
  return [...new Set(children)];
}