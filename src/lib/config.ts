import rawConfig from '../../config.json';
import type { AppConfig } from './types';

// Single source of organisation-specific configuration. Logic reads only
// from here, so a fork is configured in one place (see specs/03).
export const config = rawConfig as AppConfig;

export default config;
