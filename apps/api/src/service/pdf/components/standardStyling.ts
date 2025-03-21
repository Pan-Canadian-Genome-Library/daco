const colours = {
	primary: '#C41D7F',
	secondary: '#520339',
	tertiary: '#FFF0F6',
	grey: '#D9D9D9',
	lightGrey: '#FAFAFA',
};

const textStyles = {
	fonts: {
		openSansLight: './src/service/pdf/components/fonts/OpenSans-Light.ttf',
		openSansRegular: './src/service/pdf/components/fonts/OpenSans-Regular.ttf',
		openSansBold: './src/service/pdf/components/fonts/OpenSans-Bold.ttf',
		leagueSpartanLight: './src/service/pdf/components/fonts/LeagueSpartan-Light.ttf',
		leagueSpartanRegular: './src/service/pdf/components/fonts/LeagueSpartan-Regular.ttf',
		leagueSpartanBold: './src/service/pdf/components/fonts/LeagueSpartan-Bold.ttf',
	},
	sizes: {
		sm: '8.75pt',
		md: '10.5pt',
		lg: '15.12pt',
		xl: '18.14pt',
		xxl: '21.77pt',
	},
};

const standardStyles = {
	textStyles,
	colours,
};

export { standardStyles };
