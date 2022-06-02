import { createRequire } from "https://deno.land/std@0.141.0/node/module.ts";

const require = createRequire(import.meta.url);
const TokenGenerator = require('uuid-token-generator');
const token = new TokenGenerator(256, TokenGenerator.BASE62);

export default token;
