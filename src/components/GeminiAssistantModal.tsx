import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Mic, 
  Camera, 
  Bot, 
  User, 
  MapPin, 
  Key, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';
import { SpatialNode } from '../types';
import { GeminiService, GeminiQueryResolution } from '../services/geminiService';
import { VoiceService } from '../services/voiceService';

interface GeminiAssistantModalProps {
  nodes: SpatialNode[];
  onSelectTargetNode: (node: SpatialNode, spokenMessage?: string) => void;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  matchedNodeName?: string;
  matchedNodeId?: string;
  timestamp: Date;
}

export const GeminiAssistantModal: React.FC<GeminiAssistantModalProps> = ({
  nodes,
  onSelectTargetNode,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'gemini',
      text: 'Hello! I am your Gemini Spatial Assistant. How can I help you navigate? Try asking: "Take me to pay my fee", "My head hurts", or "Where is the elevator?".',
      timestamp: new Date()
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleSendQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: queryText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    const resolution: GeminiQueryResolution = await GeminiService.resolveUserQueryToDestination(
      queryText,
      nodes,
      apiKey
    );

    setIsLoading(false);

    const matchedNode = nodes.find(n => n.id === resolution.targetNodeId);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'gemini',
      text: resolution.suggestedVoiceResponse || resolution.explanation,
      matchedNodeName: matchedNode?.name,
      matchedNodeId: matchedNode?.id,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMsg]);

    if (matchedNode) {
      VoiceService.speak(botMsg.text);
      onSelectTargetNode(matchedNode, botMsg.text);
    }
  };

  const handleVoiceInput = () => {
    setIsListening(true);
    VoiceService.startListening(
      (transcript) => {
        setIsListening(false);
        handleSendQuery(transcript);
      },
      () => setIsListening(false)
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setIsLoading(true);

      const result = await GeminiService.identifyLandmarkFromImage(base64, nodes, apiKey);
      setIsLoading(false);

      const matchedNode = nodes.find(n => n.id === result.matchedNodeId);

      const botMsg: ChatMessage = {
        id: Date.now().toString(),
        sender: 'gemini',
        text: `Gemini Vision identified landmark: ${result.landmarkName}. ${result.explanation}`,
        matchedNodeName: matchedNode?.name,
        matchedNodeId: matchedNode?.id,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);

      if (matchedNode) {
        VoiceService.speak(botMsg.text);
        onSelectTargetNode(matchedNode, botMsg.text);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg h-[600px] flex flex-col relative shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-amber-300">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 flex items-center gap-2">
                Gemini Spatial Intelligence
              </h3>
              <p className="text-xs text-slate-400">Natural language & camera sign reasoning</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* API Key Config Input */}
        <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-2 text-xs">
          <Key className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <input
            type="password"
            placeholder="Google Gemini API Key (optional - built-in fallback active)"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="bg-transparent text-slate-300 w-full focus:outline-none placeholder-slate-500"
          />
        </div>

        {/* Chat History Container */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${
                msg.sender === 'user' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-purple-600 text-white'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`p-3 rounded-2xl max-w-[80%] text-sm space-y-2 ${
                msg.sender === 'user'
                  ? 'bg-cyan-500/20 border border-cyan-500/40 text-slate-100 rounded-tr-none'
                  : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none'
              }`}>
                <p>{msg.text}</p>

                {msg.matchedNodeName && (
                  <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs text-cyan-300">
                    <span className="flex items-center gap-1 font-semibold">
                      <MapPin className="w-3.5 h-3.5" /> {msg.matchedNodeName}
                    </span>
                    <span className="text-[10px] bg-cyan-500/20 px-2 py-0.5 rounded-full font-bold">
                      Route Triggered
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-cyan-400 p-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Gemini is parsing spatial intent...</span>
            </div>
          )}
        </div>

        {/* Chat Input & Camera Attach Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90 flex items-center gap-2">
          <label className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-cyan-400 cursor-pointer" title="Identify Room Sign Image">
            <Camera className="w-5 h-5" />
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>

          <button
            onClick={handleVoiceInput}
            className={`p-2 rounded-xl border transition-all ${
              isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-cyan-400 border-slate-700'
            }`}
            title="Voice Command"
          >
            <Mic className="w-5 h-5" />
          </button>

          <input
            type="text"
            placeholder="Type query: 'Pay my fees', 'Where is ICU?'..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendQuery(inputQuery)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
          />

          <button
            onClick={() => handleSendQuery(inputQuery)}
            className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-md shadow-cyan-500/20"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
