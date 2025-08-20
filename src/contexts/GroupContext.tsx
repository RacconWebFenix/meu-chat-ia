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
    // Dados mockados dos grupos
    const mockGroups: Group[] = [
      {
        id: 476,
        nome_do_grupo: "BRANCO PERES AGRO S/A",
      },
      {
        id: 50,
        nome_do_grupo: "COMÉRCIO INTEGRADO",
      },
      {
        id: 99,
        nome_do_grupo: "DIANA BIOENERGIA",
      },
      {
        id: 110,
        nome_do_grupo: "GRUPO FARIAS",
      },
      {
        id: 489,
        nome_do_grupo: "NIDEC MOBILIDADE BRASIL IND AUT LTDA",
      },
      {
        id: 720,
        nome_do_grupo: "PRIME RIBEIRÃO SOLUÇÕES EMPRESARIAIS",
      },
      {
        id: 719,
        nome_do_grupo: "UMOE BIOENERGY S.A",
      },
      {
        id: 114,
        nome_do_grupo: "VITERRA BIOENERGIA",
      },
    ];

    // Simula um pequeno delay para parecer mais realista
    setTimeout(() => {
      try {
        // Adiciona a opção "Todos os Grupos" no início da lista
        const allGroupsOption: Group = {
          id: 0,
          nome_do_grupo: "Visão Geral (Todos os Grupos)",
        };
        setGroups([allGroupsOption, ...mockGroups]);

        // Define a Viterra (ID 114) como padrão, conforme solicitado
        setSelectedGroupId(114);
      } catch (error) {
        console.error("Erro ao carregar grupos:", error);
        setGroups([{ id: 0, nome_do_grupo: "Erro ao carregar grupos" }]);
      } finally {
        setIsLoading(false);
      }
    }, 500); // 500ms de delay para simular carregamento
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
