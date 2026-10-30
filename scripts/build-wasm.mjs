import { buildFamily } from "@0sfs/engine-sound/family-artifact";
console.log(await buildFamily(new URL("../", import.meta.url)));
