import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Router } from 'express';
import { importDynamicRoute, lowerFirst } from '../utils/helper.js';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const THIS_PATH = __dirname;

// use express router with dynamic import
const useRoute = async (prefix, importPath) => {
  try {
    const routeModule = await importDynamicRoute(importPath);
    router.use(`/api/${prefix}`, routeModule);
  } catch (error) {
    console.error(`Error loading route module for prefix ${prefix}:`, error);
  }
};

const getRoutePrefix = routeName => routeName.split('.').shift() || '';

//maps all routes
fs.readdirSync(THIS_PATH).map(async fileName => {
  const routePrefix = lowerFirst(getRoutePrefix(fileName));
  const importPath = path.join(THIS_PATH, `${routePrefix}.route.js`);

  if (routePrefix !== 'index') {
    const filePathUrl = `file:///${importPath.replace(/\\/g, '/')}`;
    await useRoute(routePrefix, filePathUrl);
  }
});

export default router;
