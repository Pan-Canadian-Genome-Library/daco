import { ApplicationStatus } from '@/components/mock/applicationMockData';
import { pcglColors } from '@/components/providers/ThemeProvider';
import { ApplicationCardProps } from '@/global/types';

export const formatDate = (date: Date): string => {
	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	const day = date.getDate().toString().padStart(2, '0');
	const month = monthNames[date.getMonth()].substring(0, 3);
	const year = date.getFullYear();

	return `${month} ${day}, ${year}`;
};

export const getApplicationStatusProperties = (applicationStatus: ApplicationStatus): ApplicationCardProps => {
	let showEdit = false;
	let showActionRequired = false;
	let color = pcglColors.white;

	switch (applicationStatus) {
		case ApplicationStatus.Draft:
			showEdit = true;
			color = pcglColors.warningPrimary;
			showActionRequired = false;
			break;
		case ApplicationStatus.RepReview:
			showEdit = true;
			color = pcglColors.warningPrimary;
			showActionRequired = false;
			break;
		case ApplicationStatus.DACReview:
			showEdit = true;
			color = pcglColors.warningPrimary;
			showActionRequired = false;
			break;
		case ApplicationStatus.RepRevision:
			showEdit = true;
			color = pcglColors.warningPrimary;
			showActionRequired = true;
			break;
		case ApplicationStatus.DACRevision:
			showEdit = true;
			color = pcglColors.warningPrimary;
			showActionRequired = true;
			break;
		case ApplicationStatus.Rejected:
			showEdit = false;
			color = pcglColors.errorSecondary;
			showActionRequired = false;
			break;
		case ApplicationStatus.Revoked:
			showEdit = false;
			color = pcglColors.errorSecondary;
			showActionRequired = false;
			break;
		case ApplicationStatus.Approved:
			showEdit = false;
			color = pcglColors.successSecondary;
			showActionRequired = false;
			break;
		case ApplicationStatus.Closed:
			showEdit = false;
			color = pcglColors.grey;
			showActionRequired = false;
			break;
		default:
			break;
	}

	return { showEdit, showActionRequired, color };
};
