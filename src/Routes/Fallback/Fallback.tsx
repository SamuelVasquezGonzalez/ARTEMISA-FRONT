import React from "react";
import AppIcon from "../../assets/general-assets/fallback-logo.png";
import "./Fallback.css";

export const LoadingFallback: React.FC = () => {
    return (
        <div className="loading-container">
            <img src={AppIcon} alt="Apps for the world" className="logo" />
            <h2 className="text">Artemisa - Inventario</h2>
            <div className="spinner"></div>
        </div>
    );
};
