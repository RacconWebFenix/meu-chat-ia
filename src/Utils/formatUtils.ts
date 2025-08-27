// Define um mapa de unidades conhecidas para sua formatação correta
const unitMap: Record<string, string> = {
  mm: '(mm)',
  cm: '(cm)',
  kg: '(kg)',
  unf: '(UNF)',
  // Adicione outras unidades conforme necessário
};

/**
 * Formata uma string camelCase para um formato legível por humanos.
 * Ex: 'compatibilidadeVeiculos' se torna 'Compatibilidade Veiculos'
 * Ex: 'alturaMm' se torna 'Altura (mm)'
 *
 * @param key A string em camelCase a ser formatada.
 * @returns A string formatada.
 */
export const formatTechnicalKey = (key: string): string => {
  if (!key) return '';

  // Verifica se a chave termina com uma unidade conhecida
  for (const unit in unitMap) {
    if (key.toLowerCase().endsWith(unit)) {
      const baseKey = key.slice(0, -unit.length);
      const formattedBase = baseKey
        .replace(/([A-Z])/g, ' $1') // Adiciona espaço antes de letras maiúsculas
        .replace(/^./, (str) => str.toUpperCase()); // Capitaliza o primeiro caractere

      return `${formattedBase.trim()} ${unitMap[unit]}`;
    }
  }

  // Se nenhuma unidade for encontrada, aplica a formatação padrão
  const formattedKey = key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());

  return formattedKey.trim();
};