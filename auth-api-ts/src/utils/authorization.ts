/**
 * Checks if a user is authorized to perform a specific action on an object.
 * @param permissions - The array of permissions.
 * @param action - The action to check for authorization.
 * @param object - The object to check for authorization.
 * @returns A boolean indicating whether the user is authorized or not.
 */

export function isAuthorized(permissions: string[], action: string, object: string): boolean {
    const permissionKey = `${object}-${action}`;
    return permissions.some(permission => {
      const [objectName, ...flags] = permission.split('-');
      const permissionObject = objectName.trim();
      const permissionActions = flags.map(flag => flag.trim());
      return permissionObject === object && permissionActions.includes(action);
    });
  }