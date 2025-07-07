import { z } from 'zod';

export const authZUserInfo = z.object({
	emails: z.array(
		z.object({
			address: z.string().email(),
			type: z.literal('official').or(z.literal('delivery').or(z.literal('forwarding').or(z.literal('personal')))),
		}),
	),
	pcgl_id: z.string(),
	study_authorizations: z.object({
		team_member: z.array(z.string()).optional(),
		study_curator: z.array(z.string()).optional(),
		dac_authorizations: z
			.array(
				z.object({
					study_id: z.string(),
					start_date: z.string(),
					end_date: z.string(),
				}),
			)
			.optional(),
	}),
	groups: z.array(
		z
			.object({
				description: z.string(),
				id: z.number().int(),
				name: z.string(),
			})
			.optional(),
	),
});
