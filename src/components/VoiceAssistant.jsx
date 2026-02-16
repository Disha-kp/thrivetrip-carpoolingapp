import { useState, useEffect } from 'react';
import useVoiceAssistant from '../hooks/useVoiceAssistant';
import { Mic, MicOff, Volume2 } from 'lucide-react';

export default function VoiceAssistant({ onCommand }) {
    const { isListening, transcript, speak, listen, stopListening, isSpeaking } = useVoiceAssistant();
    const [isActive, setIsActive] = useState(false);

    // Initial Greeting
    const handleStart = () => {
        setIsActive(true);
        speak("Voice Assistant Active. Where do you want to go?");
        // Wait for greeting to finish (approx) before listening
        setTimeout(() => {
            listen();
        }, 3000);
    };

    // Handle Transcript
    useEffect(() => {
        if (transcript) {
            console.log("User said:", transcript);
            onCommand(transcript.toLowerCase(), speak);
            // Don't auto-close, let parent handle flow or timeout
        }
    }, [transcript, onCommand, speak]);

    if (!isActive) {
        return (
            <button
                onClick={handleStart}
                className="fixed bottom-24 right-4 bg-yellow-400 hover:bg-yellow-500 text-black p-4 rounded-full shadow-2xl z-[1000] border-4 border-black transition-transform hover:scale-110 flex items-center justify-center group"
                aria-label="Activate Voice Assistant"
            >
                <div className="absolute -top-12 right-0 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Blind Mode / Voice Assist
                </div>
                <Mic className="w-8 h-8" />
            </button>
        );
    }

    return (
        <div className="fixed bottom-24 right-4 z-[1000] flex flex-col items-end space-y-2">

            {/* Live Transcript / Status Bubble */}
            <div className="bg-black text-yellow-400 p-4 rounded-2xl rounded-br-none shadow-xl max-w-xs border-2 border-yellow-400 animate-in slide-in-from-bottom-5">
                <p className="font-bold text-lg mb-1">
                    {isSpeaking ? "Speaking..." : isListening ? "Listening..." : "Processing"}
                </p>
                <p className="text-white text-sm">
                    {transcript || (isListening ? "Say a destination..." : "...")}
                </p>
            </div>

            {/* Controls */}
            <div className="flex space-x-2">
                <button
                    onClick={() => setIsActive(false)}
                    className="bg-gray-800 text-white p-3 rounded-full shadow-lg border border-gray-600"
                >
                    <MicOff className="w-6 h-6" />
                </button>
                <button
                    onClick={isListening ? stopListening : listen}
                    className={`p-4 rounded-full shadow-xl border-4 border-black transition-all ${isListening
                            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                            : 'bg-yellow-400 hover:bg-yellow-500'
                        }`}
                >
                    {isListening ? <Volume2 className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-black" />}
                </button>
            </div>
        </div>
    );
}
