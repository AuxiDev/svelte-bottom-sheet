import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({ GITHUB_TOKEN: { static: true } });
