import Dashboard from "./dashboard";

export const metadata = {
  title: 'Dashboard',
};

export default function Page({ searchParams }: { searchParams: { page?: string } }) {
  const page = searchParams.page ? Number(searchParams.page) : 1;

  return <Dashboard initialPage={page} />;
}

