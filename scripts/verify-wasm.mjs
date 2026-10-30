import { verifyFamily } from "@0sfs/engine-sound/family-artifact";
console.log(await verifyFamily(new URL("../", import.meta.url)));
