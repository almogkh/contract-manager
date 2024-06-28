import { db } from '$lib/db/db.server.js';;
import { contracts } from '$lib/db/schema.js';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

