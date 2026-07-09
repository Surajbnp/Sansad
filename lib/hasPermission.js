import { ROLES } from "@/constants/roles";

export function hasPermission(user, permission) {
  if (!user) return false;

  // Admin ko sab access
  if (user.role === ROLES.ADMIN) {
    return true;
  }

  return user.permissions?.includes(permission);
}