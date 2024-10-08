import LinearLoading from "@/components/LinearLoading";
import GradientBackground from "@/layouts/GradientBackground";
import { memo } from "react";
import logo from "@/assets/images/logo/logo-hyracap.jpg";
const RouteLoading = (): JSX.Element => {
    return (
        <div className="fixed inset-0 flex justify-center items-center">
            <GradientBackground />
            <div className="h-fit w-fit relative">
                <img src={logo} />
                <LinearLoading />
            </div>
        </div>
    );
};

export default memo(RouteLoading);
