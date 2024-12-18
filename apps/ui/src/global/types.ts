export interface Application {
	id: string;
	userId: string;
	state: ApplicationState;
	createdAt: Date;
	approvedAt: Date;
	expiresAt: Date;
}

export interface ServerError {
	message: string;
	errors?: string;
}

export enum ApplicationState {
	DRAFT = 'DRAFT',
	INSTITUTIONAL_REP_REVIEW = 'INSTITUTIONAL_REP_REVIEW',
	REP_REVISION = 'REP_REVISION',
	DAC_REVIEW = 'DAC_REVIEW',
	DAC_REVISIONS_REQUESTED = 'DAC_REVISIONS_REQUESTED',
	REJECTED = 'REJECTED',
	APPROVED = 'APPROVED',
	CLOSED = 'CLOSED',
	REVOKED = 'REVOKED',
}
