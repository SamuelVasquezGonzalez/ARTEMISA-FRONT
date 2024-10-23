import dayjs from "dayjs";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

interface PrivateRouteProps {
    children: JSX.Element;
    requiredRole: string[];
}

const PrivateRoutes = ({ children, requiredRole }: PrivateRouteProps) => {
    const navigate = useNavigate();

    useEffect(() => {
        
        const token = localStorage.getItem("token");
        const actualDate = dayjs().unix()

        if (token) {
            try {
                const decodedPayload = JSON.parse(atob(token.split(".")[1]));
                const { role, exp } = decodedPayload;

                if (!requiredRole.includes(role)) {
                    navigate(-1);
                }

                if(actualDate >= exp){
                    navigate(`/login?type=exp`);
                }
            } catch (error) {
                console.error("Error decoding token:", error);
                navigate(-1);
            }
        } else {
            navigate("/login");
        }
    }, [navigate, requiredRole]);

    return children ? children : <Outlet />;
};

export default PrivateRoutes;
