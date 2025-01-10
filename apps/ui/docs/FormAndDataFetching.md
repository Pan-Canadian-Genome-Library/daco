# Form and Data Fetching

Libraries and bindings:

- [Zod validation](https://zod.dev/)
- [React-Hook-Form](https://react-hook-form.com/)
  - [antd-zod](https://github.com/MrBr/antd-zod) (changes zod schema into antd rules)
- [react-query](https://tanstack.com/query/v5/docs/framework/react/overview)

## Usage of libraries with Antd

Since we are relying on antd to handle the UI, it is important that the libraries we use work well with antd
to avoid any custom UI specific solutions if possible. The libraries we use should work well with Antd.

Antd has their own custom solution for setting [rules](https://ant.design/components/form#rule)/validation parameters. Something to consider if RHF no longer required.

### React-Hook-Form

React-hook-form is an alternative lightweight library that allows developers to write forms in react with ease of use, no concerns with performance and flexibility

- Uses hooks to manage form inputs or elements
- Allows usage of third-party libraries form components using their `<Controller/>` element, which will be integral with Antd
- Easily integrated with third-party validators such as `Zod` but using `useForm` field passing in `zodResolver(schema)`
- allows more options for the developer to work with `formState`

### Zod (validation)

- production level validation with lots of community support
- integrates with react-hook-form extremely well allowing more custom validation rules
- having a package that shares the schemas between the frontend and the backend will sync validation solutions

### React-Query (data fetching)

React-query is a data fetching library that makes fetching, caching and handling api state much easier for the developer.
By passing the fetching function (using fetchApi or Axios), and passing it through react-query hooks, it gives
the developer a set of `state` variables such as `isLoading`,`isError` and `error` without writing any custom solution of `useEffect` and `useState`
hooks to acquire similar functionality. react-query generally doesn't force the developer to follow their patterns or paradigms and can still get custom when needed.

We can isolate our api fetching logic into hooks and generally keep the components api logic free, allow more room in the components to focus on UI solutions.
Heres an example of creating a hook:

```
    <!-- What we import into the page we want to fetch the data from -->
	const { data, isError, error, isLoading } = useGetApplication(params.id);

    <!-- This is the hook we can define in a API folder -->
    <!-- We can also apply translations here or toast alerts -->
    const useGetApplication = (id?: string | number) => {
	const { t: translate } = useTranslation();

	return useQuery({
		queryKey: [id],
		queryFn: async () => {
			const response = await fetch(`/applications/${id}`);

			if (!response.ok) {
				let errorText = translate('errors.generic.message');
				switch (response.status) {
					case 404:
						errorText = translate('errors.applicationNotFound.message');
						break;
					default:
						break;
				}
				const error = new Error(errorText);
				error.name = translate('errors.generic.title');
				throw error;
			}

			return response.json();
		},
	});
};

export default useGetApplication;

```

## Additional Notes

For more in-depth usage of react-hook-form, zod and potential validation concerns. Refer to [Forms](https://github.com/OHCRN/platform/blob/develop/docs/forms.md)
