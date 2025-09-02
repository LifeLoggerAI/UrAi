export const ROLES = {
  ADMIN: "admin",
  INVESTOR: "investor",
  CONTRIBUTOR: "contributor",
};

export function canViewDashboard(role) {
  return [ROLES.ADMIN, ROLES.INVESTOR, ROLES.CONTRIBUTOR].includes(role);
}

export function canEditRoadmap(role) {
  return role === ROLES.ADMIN || role === ROLES.CONTRIBUTOR;
}

export function canExportAudit(role) {
  return role === ROLES.ADMIN;
}