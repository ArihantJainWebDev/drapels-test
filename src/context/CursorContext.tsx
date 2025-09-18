"use client";
import { createContext, useContext, useState, ReactNode, useMemo } from "react";

type CursorType = 'elastic' | 'fire' | 'spotlight' | 'default';

interface CursorContextType {
    cursorType: CursorType;
    setCursorType: (type: CursorType) => void;
    spotlightEnabled: boolean;
    toggleSpotlight: () => void;
    spotlightSize: number;
    setSpotlightSize: (size: number) => void;
    elasticEnabled: boolean;
    toggleElastic: () => void;
    fireEnabled: boolean;
    toggleFire: () => void;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export function CursorProvider({ children }: { children: ReactNode }) {
    const [cursorType, setCursorType] = useState<CursorType>('default');
    const [spotlightEnabled, setSpotlightEnabled] = useState(false);
    const [spotlightSize, setSpotlightSize] = useState(180);
    const [elasticEnabled, setElasticEnabled] = useState(false);
    const [fireEnabled, setFireEnabled] = useState(false);

    const toggleSpotlight = () => {
        setSpotlightEnabled(!spotlightEnabled);
        if (!spotlightEnabled) {
            setElasticEnabled(false);
            setFireEnabled(false);
        }
    };

    const toggleElastic = () => {
        setElasticEnabled(!elasticEnabled);
        if (!elasticEnabled) {
            setSpotlightEnabled(false);
            setFireEnabled(false);
        }
    };

    const toggleFire = () => {
        setFireEnabled(!fireEnabled);
        if (!fireEnabled) {
            setSpotlightEnabled(false);
            setElasticEnabled(false);
        }
    };

    const value = useMemo(() => ({
        cursorType,
        setCursorType,
        spotlightEnabled,
        toggleSpotlight,
        spotlightSize,
        setSpotlightSize,
        elasticEnabled,
        toggleElastic,
        fireEnabled,
        toggleFire
    }), [cursorType, spotlightEnabled, spotlightSize, elasticEnabled, fireEnabled]);

    return (
        <CursorContext.Provider value={value}>
            {children}
        </CursorContext.Provider>
    );
}

export function useCursor() {
    const context = useContext(CursorContext);
    if (context === undefined) {
        throw new Error("useCursor must be used within a CursorProvider");
    }
    return context;
}
