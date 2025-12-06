import { createContext, useContext, useState, ReactNode } from "react";

interface VideoMuteContextType {
    isMuted: boolean;
    setIsMuted: (muted: boolean) => void;
}

const VideoMuteContext = createContext<VideoMuteContextType | undefined>(undefined);

export const VideoMuteProvider = ({ children }: { children: ReactNode }) => {
    const [isMuted, setIsMuted] = useState(true);

    return (
        <VideoMuteContext.Provider value={{ isMuted, setIsMuted }}>
            {children}
        </VideoMuteContext.Provider>
    );
};

export const useVideoMute = () => {
    const context = useContext(VideoMuteContext);
    if (context === undefined) {
        throw new Error("useVideoMute must be used within a VideoMuteProvider");
    }
    return context;
};
