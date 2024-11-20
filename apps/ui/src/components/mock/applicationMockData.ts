// TODO: test data, subject to change

interface ApplicationtType {
	applicationName: string;
	applicationStatus: ApplicationStatus;
	createdAt: Date;
	updatedAt: Date;
}

enum ApplicationStatus {
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
		applicationName: 'PCGL-123',
		applicationStatus: ApplicationStatus.Draft,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		applicationName: 'PCGL-151',
		applicationStatus: ApplicationStatus.DACRevision,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		applicationName: 'PCGL-111',
		applicationStatus: ApplicationStatus.Approved,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		applicationName: 'PCGL-231',
		applicationStatus: ApplicationStatus.Rejected,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		applicationName: 'PCGL-554',
		applicationStatus: ApplicationStatus.Closed,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];
