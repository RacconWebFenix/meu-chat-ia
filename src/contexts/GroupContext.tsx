// src/contexts/GroupContext.tsx
"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Tipagem para um único grupo
interface Group {
  id: number;
  nome_do_grupo: string;
}

// Tipagem para o valor do nosso Contexto
interface GroupContextType {
  groups: Group[];
  selectedGroupId: number | null;
  setSelectedGroupId: (id: number | null) => void;
  isLoading: boolean;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

// O Provider que irá buscar os dados e gerenciar o estado
export function GroupProvider({ children }: { children: ReactNode }) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Função auto-executável para buscar os grupos da nossa API
    (async () => {
      try {
        const response = await fetch("/api/get-groups");
        if (!response.ok) {
          throw new Error("Falha ao buscar a lista de grupos.");
        }
        const data: Group[] = await response.json();

        // Adiciona a opção "Todos os Grupos" no início da lista
        const allGroupsOption: Group = {
          id: 0,
          nome_do_grupo: "Visão Geral (Todos os Grupos)",
        };
        setGroups([allGroupsOption, ...data]);

        // Define a Viterra (ID 114) como padrão, se existir na lista
        const viterraGroup = data.find((group) => group.id === 114);
        if (viterraGroup) {
          setSelectedGroupId(114);
        } else if (data.length > 0) {
          setSelectedGroupId(data[0].id);
        } else {
          setSelectedGroupId(0); // Fallback para "Todos" se não houver grupos
        }
      } catch (error) {
        console.error("Erro ao carregar grupos:", error);
        setGroups([{ id: 0, nome_do_grupo: "Erro ao carregar grupos" }]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const value = { groups, selectedGroupId, setSelectedGroupId, isLoading };

  return (
    <GroupContext.Provider value={value}>{children}</GroupContext.Provider>
  );
}

// Hook customizado para facilitar o uso do contexto
export function useGroup(): GroupContextType {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error("useGroup deve ser usado dentro de um GroupProvider");
  }
  return context;
}
