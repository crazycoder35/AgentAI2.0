import React, { createContext, useState, useContext, useEffect } from 'react';
import { Agent, AgentContextType } from '../types';

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const AgentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [agents, setAgents] = useState<Agent[]>(() => {
    const savedAgents = localStorage.getItem('agents');
    return savedAgents ? JSON.parse(savedAgents) : [
      { id: '1', name: 'Developer', role: 'Developer', status: 'idle', currentTask: '', ollamaInstance: '' },
      { id: '2', name: 'Researcher', role: 'Researcher', status: 'idle', currentTask: '', ollamaInstance: '' },
      { id: '3', name: 'Tester', role: 'Tester', status: 'idle', currentTask: '', ollamaInstance: '' },
      { id: '4', name: 'Bug Fixer', role: 'Bug Fixer', status: 'idle', currentTask: '', ollamaInstance: '' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('agents', JSON.stringify(agents));
  }, [agents]);

  const updateAgentStatus = (agentId: string, status: Agent['status'], currentTask: string) => {
    setAgents(prevAgents =>
      prevAgents.map(agent =>
        agent.id === agentId ? { ...agent, status, currentTask } : agent
      )
    );
  };

  const connectAgentToOllama = async (agentId: string, ollamaInstance: string) => {
    try {
      // In a real-world scenario, you would make an API call to connect to Ollama
      // For this example, we'll simulate the connection
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      setAgents(prevAgents =>
        prevAgents.map(agent =>
          agent.id === agentId ? { ...agent, ollamaInstance } : agent
        )
      );
    } catch (error) {
      console.error('Error connecting agent to Ollama:', error);
      throw error;
    }
  };

  return (
    <AgentContext.Provider value={{ agents, updateAgentStatus, connectAgentToOllama }}>
      {children}
    </AgentContext.Provider>
  );
};

export const useAgents = () => {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error('useAgents must be used within an AgentProvider');
  }
  return context;
};