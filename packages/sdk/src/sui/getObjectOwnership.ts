import { SuiClient } from '@mysten/sui.js/dist/cjs/client';

// format for object ID will be PackageId::Module::StructName
export default async function getOwnedObjects(
  client: SuiClient,
  owner: string,
  objectType: string
) {
  const params = {
    owner: owner,
    filter: {
      StructType: objectType,
    },
    options: {
      showType: true,
    },
  };
  const result = await client.getOwnedObjects(params);
  return result.data;
}
