import { applications } from '@/db/schemas/applications.ts';
import { ApplicationStates } from '@pcgl-daco/data-model';

export const applicationArray: (typeof applications.$inferInsert)[] = [
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.DRAFT,
		created_at: new Date('2025-01-01T11:00:00Z'),
		updated_at: new Date('2025-01-01T11:30:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.INSTITUTIONAL_REP_REVIEW,
		created_at: new Date('2025-01-01T12:00:00Z'),
		updated_at: new Date('2025-01-01T12:15:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED,
		created_at: new Date('2025-01-01T13:00:00Z'),
		updated_at: new Date('2025-01-01T13:45:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.DAC_REVIEW,
		created_at: new Date('2025-01-01T14:00:00Z'),
		updated_at: new Date('2025-01-01T14:30:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.DAC_REVISIONS_REQUESTED,
		created_at: new Date('2025-01-01T15:00:00Z'),
		updated_at: new Date('2025-01-01T15:45:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.REJECTED,
		created_at: new Date('2025-01-01T16:00:00Z'),
		updated_at: new Date('2025-01-01T16:15:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.APPROVED,
		created_at: new Date('2025-01-01T17:00:00Z'),
		updated_at: new Date('2025-01-01T17:30:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.CLOSED,
		created_at: new Date('2025-01-01T18:00:00Z'),
		updated_at: new Date('2025-01-01T18:15:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.REVOKED,
		created_at: new Date('2025-01-01T19:00:00Z'),
		updated_at: new Date('2025-01-01T19:30:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.DRAFT,
		created_at: new Date('2025-01-02T10:00:00Z'),
		updated_at: new Date('2025-01-02T10:30:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.INSTITUTIONAL_REP_REVIEW,
		created_at: new Date('2025-01-02T11:00:00Z'),
		updated_at: new Date('2025-01-02T11:45:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.DAC_REVIEW,
		created_at: new Date('2025-01-02T12:00:00Z'),
		updated_at: new Date('2025-01-02T12:30:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.APPROVED,
		created_at: new Date('2025-01-02T13:00:00Z'),
		updated_at: new Date('2025-01-02T13:45:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.CLOSED,
		created_at: new Date('2025-01-02T14:00:00Z'),
		updated_at: new Date('2025-01-02T14:30:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.DRAFT,
		created_at: new Date('2025-01-02T15:00:00Z'),
		updated_at: new Date('2025-01-02T15:30:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.INSTITUTIONAL_REP_REVISION_REQUESTED,
		created_at: new Date('2025-01-02T16:00:00Z'),
		updated_at: new Date('2025-01-02T16:45:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.DAC_REVIEW,
		created_at: new Date('2025-01-02T17:00:00Z'),
		updated_at: new Date('2025-01-02T17:30:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.DAC_REVISIONS_REQUESTED,
		created_at: new Date('2025-01-02T18:00:00Z'),
		updated_at: new Date('2025-01-02T18:45:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.REJECTED,
		created_at: new Date('2025-01-02T19:00:00Z'),
		updated_at: new Date('2025-01-02T19:30:00Z'),
	},
	{
		user_id: 'testUser@oicr.on.ca',
		state: ApplicationStates.APPROVED,
		created_at: new Date('2025-01-02T20:00:00Z'),
		updated_at: new Date('2025-01-02T20:30:00Z'),
	},
];
