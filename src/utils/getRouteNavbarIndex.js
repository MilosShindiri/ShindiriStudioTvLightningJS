import ROUTES_INDEX from "../constants/routesIndex";

export function getRouteNavbarIndex(route) {
  if (route) {
    return ROUTES_INDEX[route] ?? 0;
  }
  return 0;
}
