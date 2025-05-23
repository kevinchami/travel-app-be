// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { Router } from 'express';
// import { importDynamicRoute, lowerFirst } from '../utils/helper.js';

// const router = Router();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const THIS_PATH = __dirname;

// // use express router with dynamic import
// const useRoute = async (prefix, importPath) => {
//   try {
//     const routeModule = await importDynamicRoute(importPath);
//     router.use(`/api/${prefix}`, routeModule);
//   } catch (error) {
//     console.error(`Error loading route module for prefix ${prefix}:`, error);
//   }
// };

// const getRoutePrefix = routeName => routeName.split('.').shift() || '';

// //maps all routes
// fs.readdirSync(THIS_PATH).map(async fileName => {
//   const routePrefix = lowerFirst(getRoutePrefix(fileName));
//   const importPath = path.join(THIS_PATH, `${routePrefix}.route.js`);

//   if (routePrefix !== 'index') {
//     const filePathUrl = `file:///${importPath.replace(/\\/g, '/')}`;
//     await useRoute(routePrefix, filePathUrl);
//   }
// });

// export default router;
import { Router } from 'express';
import countriesRoutes from './countries.route.js';
import citiesRoutes from './cities.route.js';
import accommodationRoutes from './accomodation.route.js';
import restaurantRoutes from './restaurants.route.js';
import templeRoutes from './temples.route.js';
import tourRoutes from './tours.route.js';
import reviewRoutes from './reviews.route.js';
import userRoutes from './users.route.js';
import wishlistRoutes from './wishlists.route.js';
import authRoutes from './auth.route.js';
import memorialRoutes from './memorial.route.js';
import partyRoutes from './party.route.js';
import activityRoutes from './activity.route.js';
import driverRoutes from './driver.route.js';
import cafeRoutes from './cafe.route.js';
import mustRoutes from './must.route.js';
import nearbyRoutes from './nearby.route.js';
import featureFlagRoutes from './featureFlag.route.js';
import searchRoutes from './search.route.js';
import translationRoutes from './translation.route.js';
import supermarketRoutes from './supermarket.route.js';
import kosherlisrRoutes from './kosherlist.route.js';
import categoryRoutes from './category.route.js';

const router = Router();

router.use('/api/countries', countriesRoutes);
router.use('/api/cities', citiesRoutes);
router.use('/api/accomodation', accommodationRoutes);
router.use('/api/restaurants', restaurantRoutes);
router.use('/api/temples', templeRoutes);
router.use('/api/tours', tourRoutes);
router.use('/api/reviews', reviewRoutes);
router.use('/api/users', userRoutes);
router.use('/api/wishlists', wishlistRoutes);
router.use('/api/auth', authRoutes);
router.use('/api/memorial', memorialRoutes);
router.use('/api/party', partyRoutes);
router.use('/api/activity', activityRoutes);
router.use('/api/driver', driverRoutes);
router.use('/api/cafe', cafeRoutes);
router.use('/api/must', mustRoutes);
router.use('/api/nearby', nearbyRoutes);
router.use('/api/featureFlag', featureFlagRoutes);
router.use('/api/search', searchRoutes);
router.use('/api/translation', translationRoutes);
router.use('/api/supermarket', supermarketRoutes);
router.use('/api/kosherlist', kosherlisrRoutes);
router.use('/api/category', categoryRoutes);

export default router;
