"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, VolumeX, Send, Loader2, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface VoiceCommand {
  id: string;
  transcript: string;
  processedAction: any;
  confidence: number;
  status: 'processed' | 'pending-review' | 'approved' | 'rejected';
  timestamp: Date;
  type: 'prescription' | 'diagnosis' | 'schedule' | 'emergency' | 'note';
}

interface BobAssistantProps {
  patientContext?: any;
  doctorId: string;
  onCommandProcessed?: (command: VoiceCommand) => void;
}

export default function BobAssistant({ patientContext, doctorId, onCommandProcessed }: BobAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recentCommands, setRecentCommands] = useState<VoiceCommand[]>([]);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [volume, setVolume] = useState(true);
  const [manualInput, setManualInput] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<any>(null);

  useEffect(() => {
    // Check for speech recognition support
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const SpeechSynthesis = window.speechSynthesis;
      
      if (SpeechRecognition) {
        setIsSpeechSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            setTranscript(finalTranscript);
            processVoiceCommand(finalTranscript);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }

      if (SpeechSynthesis) {
        synthRef.current = SpeechSynthesis;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setIsListening(true);
      recognitionRef.current.start();
      speak("I'm listening. How can I help you?");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speak = (text: string) => {
    if (synthRef.current && volume) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      synthRef.current.speak(utterance);
    }
  };

  const processVoiceCommand = async (commandText: string) => {
    setIsProcessing(true);
    stopListening();

    try {
      const response = await fetch('/api/voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript: commandText,
          patientContext,
          doctorId
        }),
      });

      const result = await response.json();

      if (result.success) {
        const newCommand: VoiceCommand = {
          id: `cmd_${Date.now()}`,
          transcript: commandText,
          processedAction: result.data,
          confidence: result.data.confidence || 0.8,
          status: 'pending-review',
          timestamp: new Date(),
          type: result.data.action || 'note'
        };

        setRecentCommands(prev => [newCommand, ...prev.slice(0, 4)]);
        
        if (onCommandProcessed) {
          onCommandProcessed(newCommand);
        }

        // Provide voice feedback
        speak(`I've processed your request to ${result.data.summary}. Please review and approve the changes.`);
      } else {
        speak("I'm sorry, I couldn't process that command. Could you please try again?");
      }
    } catch (error) {
      console.error('Voice command processing error:', error);
      speak("There was an error processing your command. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const processManualCommand = () => {
    if (manualInput.trim()) {
      processVoiceCommand(manualInput.trim());
      setManualInput('');
      setShowManualInput(false);
    }
  };

  const approveCommand = async (commandId: string) => {
    setRecentCommands(prev => 
      prev.map(cmd => 
        cmd.id === commandId 
          ? { ...cmd, status: 'approved' }
          : cmd
      )
    );
    speak("Command approved and executed.");
  };

  const rejectCommand = async (commandId: string) => {
    setRecentCommands(prev => 
      prev.map(cmd => 
        cmd.id === commandId 
          ? { ...cmd, status: 'rejected' }
          : cmd
      )
    );
    speak("Command rejected.");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'pending-review':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionTypeColor = (type: string) => {
    switch (type) {
      case 'prescription':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'diagnosis':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'schedule':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'emergency':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-2 border-blue-200">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-lg font-bold">🤖</span>
          </div>
          <div>
            <div className="text-xl font-semibold">Bob AI Assistant</div>
            <div className="text-sm text-blue-100">Your voice-activated medical assistant</div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVolume(!volume)}
              className="text-white hover:bg-white/20"
            >
              {volume ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Voice Control Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            {isSpeechSupported ? (
              <Button
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing}
                size="lg"
                className={`px-8 py-4 text-lg font-semibold transition-all duration-300 ${
                  isListening 
                    ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                }`}
              >
                {isProcessing ? (
                  <Loader2 className="h-6 w-6 mr-2 animate-spin" />
                ) : isListening ? (
                  <MicOff className="h-6 w-6 mr-2" />
                ) : (
                  <Mic className="h-6 w-6 mr-2" />
                )}
                {isProcessing ? 'Processing...' : isListening ? 'Stop Listening' : 'Talk to Bob'}
              </Button>
            ) : (
              <div className="text-gray-500">
                Speech recognition not supported in this browser
              </div>
            )}
            
            <Button
              variant="outline"
              onClick={() => setShowManualInput(!showManualInput)}
              className="px-4 py-2"
            >
              Type Command
            </Button>
          </div>

          {/* Manual Input */}
          {showManualInput && (
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Type your command here..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && processManualCommand()}
              />
              <Button onClick={processManualCommand} disabled={!manualInput.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Current Transcript */}
          {(transcript || isListening) && (
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
              <div className="text-sm text-gray-600 mb-1">
                {isListening ? 'Listening...' : 'Last Command:'}
              </div>
              <div className="text-lg font-medium text-gray-900">
                {transcript || 'Waiting for your voice...'}
              </div>
            </div>
          )}
        </div>

        {/* Recent Commands */}
        {recentCommands.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Recent Commands</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {recentCommands.map((command) => (
                <div key={command.id} className="bg-gray-50 rounded-lg p-4 border">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(command.status)}
                      <Badge className={getActionTypeColor(command.type)}>
                        {command.type.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {command.confidence > 0 && `${Math.round(command.confidence * 100)}% confidence`}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {command.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-700 mb-2">
                    "{command.transcript}"
                  </div>
                  
                  {command.processedAction?.summary && (
                    <div className="text-sm text-blue-700 bg-blue-50 rounded p-2 mb-3">
                      <strong>Processed:</strong> {command.processedAction.summary}
                    </div>
                  )}

                  {command.status === 'pending-review' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => approveCommand(command.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => rejectCommand(command.id)}
                        className="border-red-300 text-red-700 hover:bg-red-50"
                      >
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Commands */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Quick Commands:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
            <div>"Add paracetamol for [patient name]"</div>
            <div>"Schedule follow-up for [patient]"</div>
            <div>"Call anesthetics to OR-3"</div>
            <div>"Create insurance claim for [patient]"</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
