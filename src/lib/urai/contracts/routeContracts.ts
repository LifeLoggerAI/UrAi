export type UraiRouteId = 'home' | 'life-map' | 'life-map-star' | 'focus' | 'focus-session' | 'replay' | 'replay-detail' | 'ochat';

export type UraiRouteMode =
  | 'home'
  | 'home-entering'
  | 'life-map-entering'
  | 'life-map'
  | 'life-map-focus'
  | 'focus-entering'
  | 'focus'
  | 'replay-entering'
  | 'replay'
  | 'ochat-entering'
  | 'ochat'
  | 'returning-home';

export type UraiRouteRecoveryState = 'ok' | 'loading' | 'empty' | 'invalid-id' | 'locked' | 'deleted' | 'archived' | 'error';

export interface UraiDirectRouteContract {
  route: UraiRouteId;
  pathPattern: string;
  directLoad: boolean;
  refreshSafe: boolean;
  loadingState: boolean;
  errorState: boolean;
  emptyState: boolean;
  returnHome: boolean;
  invalidIdBehavior: string;
  lockedBehavior: string;
  deletedBehavior: string;
  archivedBehavior: string;
}

export const URAI_DIRECT_ROUTE_CONTRACTS: UraiDirectRouteContract[] = [
  {
    route: 'home',
    pathPattern: '/home',
    directLoad: true,
    refreshSafe: true,
    loadingState: true,
    errorState: true,
    emptyState: true,
    returnHome: false,
    invalidIdBehavior: 'not applicable',
    lockedBehavior: 'not applicable',
    deletedBehavior: 'not applicable',
    archivedBehavior: 'not applicable',
  },
  {
    route: 'life-map',
    pathPattern: '/life-map',
    directLoad: true,
    refreshSafe: true,
    loadingState: true,
    errorState: true,
    emptyState: true,
    returnHome: true,
    invalidIdBehavior: 'show life-map shell with visible notice',
    lockedBehavior: 'show locked shell instead of 404',
    deletedBehavior: 'show removed or unavailable notice',
    archivedBehavior: 'open only with permission',
  },
  {
    route: 'life-map-star',
    pathPattern: '/life-map/star/:starId',
    directLoad: true,
    refreshSafe: true,
    loadingState: true,
    errorState: true,
    emptyState: true,
    returnHome: true,
    invalidIdBehavior: 'show parent life-map with invalid-star notice',
    lockedBehavior: 'show locked star state instead of 404',
    deletedBehavior: 'show removed star notice',
    archivedBehavior: 'open only if user has permission',
  },
  {
    route: 'focus',
    pathPattern: '/focus',
    directLoad: true,
    refreshSafe: true,
    loadingState: true,
    errorState: true,
    emptyState: true,
    returnHome: true,
    invalidIdBehavior: 'show focus setup or return to life-map when no valid context exists',
    lockedBehavior: 'show locked focus context',
    deletedBehavior: 'show removed focus context notice',
    archivedBehavior: 'open only if user has permission',
  },
  {
    route: 'focus-session',
    pathPattern: '/focus/session/:sessionId',
    directLoad: true,
    refreshSafe: true,
    loadingState: true,
    errorState: true,
    emptyState: true,
    returnHome: true,
    invalidIdBehavior: 'show focus with missing-session notice',
    lockedBehavior: 'show locked session state',
    deletedBehavior: 'show removed session notice',
    archivedBehavior: 'open only if user has permission',
  },
  {
    route: 'replay',
    pathPattern: '/replay',
    directLoad: true,
    refreshSafe: true,
    loadingState: true,
    errorState: true,
    emptyState: true,
    returnHome: true,
    invalidIdBehavior: 'show replay library or return to life-map when no valid replay exists',
    lockedBehavior: 'show locked replay state',
    deletedBehavior: 'show removed replay notice',
    archivedBehavior: 'open only if user has permission',
  },
  {
    route: 'replay-detail',
    pathPattern: '/replay/:replayId',
    directLoad: true,
    refreshSafe: true,
    loadingState: true,
    errorState: true,
    emptyState: true,
    returnHome: true,
    invalidIdBehavior: 'show replay parent with invalid-replay notice',
    lockedBehavior: 'show locked replay state',
    deletedBehavior: 'show removed replay notice',
    archivedBehavior: 'open only if user has permission',
  },
];

export interface UraiTransitionContract {
  id: 'home-to-life-map' | 'life-map-to-focus' | 'focus-to-replay' | 'replay-to-focus' | 'focus-to-life-map' | 'life-map-to-home';
  from: UraiRouteMode;
  to: UraiRouteMode;
  inputLockedMs: number;
  reducedMotionFallback: 'snap-fade' | 'short-crossfade';
  escapeBehavior: string;
  mobileBackBehavior: string;
}

export const URAI_TRANSITION_CONTRACTS: UraiTransitionContract[] = [
  { id: 'home-to-life-map', from: 'home', to: 'life-map', inputLockedMs: 1200, reducedMotionFallback: 'short-crossfade', escapeBehavior: 'cancel before route commit, otherwise unwind to home', mobileBackBehavior: 'unwind to home' },
  { id: 'life-map-to-focus', from: 'life-map', to: 'focus', inputLockedMs: 900, reducedMotionFallback: 'short-crossfade', escapeBehavior: 'return to life-map', mobileBackBehavior: 'return to life-map' },
  { id: 'focus-to-replay', from: 'focus', to: 'replay', inputLockedMs: 800, reducedMotionFallback: 'short-crossfade', escapeBehavior: 'return to focus', mobileBackBehavior: 'return to focus' },
  { id: 'replay-to-focus', from: 'replay', to: 'focus', inputLockedMs: 650, reducedMotionFallback: 'snap-fade', escapeBehavior: 'settle focus before accepting next escape', mobileBackBehavior: 'settle focus before accepting next back' },
  { id: 'focus-to-life-map', from: 'focus', to: 'life-map', inputLockedMs: 850, reducedMotionFallback: 'snap-fade', escapeBehavior: 'settle life-map before accepting next escape', mobileBackBehavior: 'settle life-map before accepting next back' },
  { id: 'life-map-to-home', from: 'life-map', to: 'home', inputLockedMs: 1000, reducedMotionFallback: 'short-crossfade', escapeBehavior: 'continue home unwind', mobileBackBehavior: 'continue home unwind' },
];
