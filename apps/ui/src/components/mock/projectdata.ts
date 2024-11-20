// TODO: test data, subject to change

interface ProjectType {
	projectName: string;
	projectStatus: ApplicationStatus;
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

export const projects: ProjectType[] = [
	{
		projectName: 'PCGL-123',
		projectStatus: ApplicationStatus.Draft,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		projectName: 'PCGL-151',
		projectStatus: ApplicationStatus.DACRevision,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		projectName: 'PCGL-111',
		projectStatus: ApplicationStatus.Approved,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		projectName: 'PCGL-231',
		projectStatus: ApplicationStatus.Rejected,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		projectName: 'PCGL-554',
		projectStatus: ApplicationStatus.Closed,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];
