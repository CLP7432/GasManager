package com.gasmanager.inventarios.enums;

public enum TipoCombustible {
    MAGNA,
    PREMIUM,
    DIESEL,
    GASOLINA_MAGNA,
    GASOLINA_PREMIUM;

    // Método para convertir desde String de manera flexible
    public static TipoCombustible fromString(String tipo) {
        if (tipo == null) return null;

        switch (tipo.toUpperCase()) {
            case "MAGNA":
            case "GASOLINA_MAGNA":
                return MAGNA;
            case "PREMIUM":
            case "GASOLINA_PREMIUM":
                return PREMIUM;
            case "DIESEL":
                return DIESEL;
            default:
                return null;
        }
    }
}