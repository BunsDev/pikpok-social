import useAuth from "@hooks/useAuth";

type Props = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const { loading } = useAuth();

  if (loading) {
    return <div className="" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
