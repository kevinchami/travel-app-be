export const lowerFirst = (s) => s.charAt(0).toLowerCase() + s.slice(1);
export const importDynamicRoute = async (path) => (await import(path)).default;
