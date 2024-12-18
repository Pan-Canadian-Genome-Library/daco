// TODO: test data, subject to change

import { Application, ApplicationState } from '@/global/types';

export const mockUserID = 'testUser@oicr.on.ca';

export const applications: Application[] = [
	{
		id: '123',
		userId: 'user-123',
		state: ApplicationState.DRAFT,
		createdAt: new Date(),
		approvedAt: new Date(),
		expiresAt: new Date(),
	},
	{
		id: '436',
		userId: 'user-151',
		state: ApplicationState.DAC_REVIEW,
		createdAt: new Date(),
		approvedAt: new Date(),
		expiresAt: new Date(),
	},
	{
		id: '7685',
		userId: 'user-111',
		state: ApplicationState.APPROVED,
		createdAt: new Date(),
		approvedAt: new Date(),
		expiresAt: new Date(),
	},
	{
		id: '143',
		userId: 'user-231',
		state: ApplicationState.REJECTED,
		createdAt: new Date(),
		approvedAt: new Date(),
		expiresAt: new Date(),
	},
	{
		id: '543453',
		userId: 'user-554',
		state: ApplicationState.CLOSED,
		createdAt: new Date(),
		approvedAt: new Date(),
		expiresAt: new Date(),
	},
];
