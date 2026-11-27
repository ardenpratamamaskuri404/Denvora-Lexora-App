/**
 * @module validators/common
 * @description Skema validasi umum untuk parameter URL.
 */

import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive('ID harus berupa bilangan bulat positif'),
});
