import React, { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Container,
    Paper,
    InputAdornment,
} from "@mui/material";
import { Email, Lock } from "@mui/icons-material";
import { sendData } from "../../Service/Api";
import { useAuth } from "../../UserContext";
import { useNavigate } from "react-router-dom";

export type ConfigT = {
    role?: string;
    _id?: string;
};

export type LoginData = {
    ok: boolean
    data: {
        accessToken: string,
        _id: string,
        role: string
    }
}

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const {setAuthState} = useAuth()
    const navigate = useNavigate()


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault() 
        const response = await sendData({path: "/v1/login", body: {email, password}})  as LoginData
        console.log(response)

        if(response.ok){
            if("data" in response){
                setAuthState({
                    role: response.data.role,
                    _id: response.data._id,
                })
                localStorage.setItem("token", response.data.accessToken)
                localStorage.setItem("s", JSON.stringify({_id: response.data._id, role: response.data.role}))
            }
        }

        navigate("/home")

    };

    return (
        <Container
            sx={{
                height: "100vh",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
            }}
            maxWidth="xs"
        >
            <Paper
                elevation={6}
                sx={{
                    padding: 4,
                    borderRadius: 2,
                    backgroundColor: "#ffffff",
                    boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
                    },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Typography
                        variant="h5"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 600,
                            color: "#042A39",
                        }}
                    >
                        Bienvenido
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        gutterBottom
                        sx={{ color: "#616161", mb: 3 }}
                    >
                        Inicia sesión en tu cuenta
                    </Typography>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ width: "100%" }}
                    >
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Correo Electrónico"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            aria-label="Correo Electrónico"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email sx={{ color: "#757575" }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Contraseña"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            aria-label="Contraseña"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock sx={{ color: "#757575" }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                padding: "10px 0",
                                backgroundColor: "#9BD7C2",
                                color: "#fff",
                                fontWeight: "bold",
                                "&:hover": {
                                    backgroundColor: "#03506F",
                                },
                            }}
                        >
                            Iniciar Sesión
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;
