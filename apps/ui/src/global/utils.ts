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
