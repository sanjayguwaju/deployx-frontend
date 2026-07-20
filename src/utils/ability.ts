import { AbilityBuilder, MongoAbility, createMongoAbility } from '@casl/ability';
import { User } from '../context/AuthContext';

export type AppAbility = MongoAbility;

// Utility to replace template strings (like "{userId}") with actual user data from the client
function parseConditions(conditions: Record<string, any>, user: User): Record<string, any> {
  const parsed = { ...conditions };
  for (const key in parsed) {
    if (typeof parsed[key] === 'string' && parsed[key] === '{userId}') {
      parsed[key] = user.id;
    }
  }
  return parsed;
}

export function buildAbilityFor(user: User | null): AppAbility {
  const { can, build } = new AbilityBuilder(createMongoAbility);

  if (!user) {
    return build(); // No permissions
  }

  // Global baseline access (allows basic UI routing for any logged-in user)
  can('read', 'dashboard');
  can('read', 'notifications');

  // 100% Dynamic Permissions from Backend (No hardcoded roles!)
  if (user.permissions && Array.isArray(user.permissions)) {
    user.permissions.forEach((perm) => {
      if (perm.conditions) {
        can(perm.action, perm.module, parseConditions(perm.conditions, user));
      } else {
        can(perm.action, perm.module);
      }
    });
  }

  return build();
}
