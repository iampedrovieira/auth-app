/**
 * Converts an array of permissions from one format to another.
 * @param permissions - The array of permissions to convert.
    * ["Object: Document1; Permissions: delete","Object: Document1 Permissions: edit_project"...]
 * @returns The converted array of permissions.
    * ["Document1-delete-edit_project",...]
 */
export function convertPermissionsToJson(permissions: string[]): string[] {
    const convertedPermissions: string[] = [];
    const permissionsMap: { [key: string]: string[] } = {};
  
    permissions.forEach(permission => {
      const [object, ...flags] = permission.split(';');
      const objectName = object.trim().split(':')[1].trim();
      const flagsString = flags.map(flag => flag.trim().split(':')[1].trim()).join('-');
      const convertedPermission = `${objectName}-${flagsString}`;
  
      if (permissionsMap.hasOwnProperty(objectName)) {
          permissionsMap[objectName].push(flagsString);
      } else {
          permissionsMap[objectName] = [flagsString];
      }
    });
  
    for (const objectName in permissionsMap) {
      const flags = permissionsMap[objectName];
      const concatenatedPermission = `${objectName}-${flags.join('-')}`;
      convertedPermissions.push(concatenatedPermission);
    }
  
    return convertedPermissions;
  }