import { Outlet, useNavigation } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";

export default function RootLayout() {
  const navigation = useNavigation();

  return (
    <>
      <ProgressBar isAnimating={navigation.state === "loading"} />
      <Outlet />
    </>
  );
}
