import { z } from 'zod';

// Mostly taken from https://github.com/openraddata/OpenRadDataModel.ts/blob/zod_schema/packages/observation/src/index.ts
export const systemCodeSchema = z.object({
  system: z.string().url(),
  code: z.string(),
  display: z.string().optional(),
});

export type SystemCodeData = z.infer<typeof systemCodeSchema>;

export const systemCodeListSchema = z.object({
    coding: z.array(systemCodeSchema).min(1), // Should the max be 1 as well?
})

export const codeableConceptValueSchema = z.object({
  code: systemCodeListSchema,
  valueCodeableConcept: systemCodeListSchema,
});

export const stringValueSchema = z.object({
  code: systemCodeListSchema,
  valueString: z.string(),
});

export const integerValueSchema = z.object({
  code: systemCodeListSchema,
  valueInteger: z.number().int(),
});

export const floatValueSchema = z.object({
  code: systemCodeListSchema,
  valueFloat: z.number(),
});

export const componentSchema = z.union([
  codeableConceptValueSchema,
  stringValueSchema,
  integerValueSchema,
  floatValueSchema,
]);

export type ComponentData = z.infer<typeof componentSchema>;

export const observationSchema = z.object({
  resourceType: z.literal('Observation'),
  id: z.string(),
  code: systemCodeSchema,
  bodySite: z.object({ code: systemCodeListSchema }).optional(),
  component: z.array(componentSchema).min(1), // Should the max be 1 as well?
});

export type ObservationData = z.infer<typeof observationSchema>;