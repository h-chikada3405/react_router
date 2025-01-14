import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { getUserSession } from '~/service/auth/auth.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const user = await getUserSession(request);
    const response = await fetch('http://localhost:8000/hello', {
			method: 'GET',
			headers: {
        'Authorization': `Bearer ${user.accessToken}`,
      },
		});

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    const hello = await response.json();
    return { hello };
  } catch (error) {
    console.error('Loader error:', error);
    return { hello: {} };
  }
};

export default function Index() {
	const { hello } = useLoaderData<typeof loader>();

	return (
    <div>{hello.hello}</div>
  );
}
