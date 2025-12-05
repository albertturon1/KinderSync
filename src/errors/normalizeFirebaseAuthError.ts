import { createErrorExtractorNormalizer, defaultErrorExtractor } from './createErrorNormalizer';

export const normalizeFirebaseAuthError = createErrorExtractorNormalizer(defaultErrorExtractor);
