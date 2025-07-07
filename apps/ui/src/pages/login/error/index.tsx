import ErrorPage from '@/components/pages/global/ErrorPage';

const LoginError = () => {
	return <ErrorPage error={{ message: 'Skill Issue', error: "Can't log you in." }} loading={false}></ErrorPage>;
};

export default LoginError;
