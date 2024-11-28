// TODO: test data, subject to change

export interface ApplicationtType {
	id: string;
	userId: string;
	status: ApplicationStatus;
	createdAt: Date;
	approvedAt: Date;
	expiresAt: Date;
}

export enum ApplicationStatus {
	Draft = 'Draft',
	RepReview = 'Rep Review',
	DACReview = 'DAC Review',
	RepRevision = 'Rep Revision',
	DACRevision = 'DAC Revision',
	Approved = 'Approved',
	Rejected = 'Rejected',
	Closed = 'Closed',
	Sign = 'Sign & Submit',
	Revoked = 'Revoked',
}

export const applications: ApplicationtType[] = [
	{
		id: '23124',
		userId: 'PCGL-123',
		status: ApplicationStatus.Draft,
		createdAt: new Date(),
		approvedAt: new Date(),
		expiresAt: new Date(),
	},
	{
		id: '543451',
		userId: 'PCGL-151',
		status: ApplicationStatus.DACRevision,
		createdAt: new Date(),
		approvedAt: new Date(),
		expiresAt: new Date(),
	},
	{
		id: '986412',
		userId: 'PCGL-111',
		status: ApplicationStatus.Approved,
		createdAt: new Date(),
		approvedAt: new Date(),
		expiresAt: new Date(),
	},
	{
		id: '821312',
		userId: 'PCGL-231',
		status: ApplicationStatus.Rejected,
		createdAt: new Date(),
		approvedAt: new Date(),
		expiresAt: new Date(),
	},
	{
		id: '543453',
		userId: 'PCGL-554',
		status: ApplicationStatus.Closed,
		createdAt: new Date(),
		approvedAt: new Date(),
		expiresAt: new Date(),
	},
];
