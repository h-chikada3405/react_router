import { LoaderFunctionArgs, useLoaderData } from "react-router";
import useUserData from "~/hooks/useUserData";
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
  // const user = useUserData();
  // fetch('http://localhost:8000/hello', {
  //   method: 'GET',
  //   headers: {
  //     'Authorization': `Bearer ${user.accessToken}`,
  //   },
  // }).then((response) => console.log(response.json()));

	return (
    <div>{hello.hello}</div>
  );
}
