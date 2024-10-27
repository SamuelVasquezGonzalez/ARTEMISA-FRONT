import { useAuth } from "../../UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Fab } from "@mui/material";
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';

export default function SignOut() {
    const { setAuthState } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    console.log(location.pathname)

    const signOut = () => {
        localStorage.clear();
        setAuthState({
            _id: null,
            role: null,
        });
        navigate("/");
    };
    return (
        location.pathname !== "/" && (
            <Fab
            aria-label="add"
            sx={{ position: "fixed", bottom: 16, left: 16 }}
            onClick={signOut}
        >
            <ExitToAppOutlinedIcon />
        </Fab>
        )
    );
}
