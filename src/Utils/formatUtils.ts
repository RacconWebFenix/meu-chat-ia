// Define um mapa de unidades conhecidas para sua formatação correta
const unitMap: Record<string, string> = {
  mm: "(mm)",
  cm: "(cm)",
  kg: "(kg)",
  g: "(g)",
  m: "(m)",
  km: "(km)",
  l: "(L)",
  ml: "(mL)",
  rpm: "(RPM)",
  hz: "(Hz)",
  khz: "(kHz)",
  mhz: "(MHz)",
  v: "(V)",
  kv: "(kV)",
  mv: "(mV)",
  a: "(A)",
  ma: "(mA)",
  w: "(W)",
  kw: "(kW)",
  mw: "(mW)",
  hp: "(HP)",
  c: "(°C)",
  f: "(°F)",
  k: "(K)",
  pa: "(Pa)",
  kpa: "(kPa)",
  mpa: "(MPa)",
  bar: "(bar)",
  psi: "(PSI)",
  nm: "(N·m)",
  kn: "(kN)",
  n: "(N)",
  j: "(J)",
  kj: "(kJ)",
  db: "(dB)",
  "%": "(%)",
  unm: "(UNM)",
  unf: "(UNF)",
  unc: "(UNC)",
  // Adicione outras unidades conforme necessário
};

/**
 * Formata uma string técnica para um formato legível por humanos.
 * Suporta diferentes formatos de entrada:
 * - camelCase: 'diametroInternoMm' -> 'Diametro Interno (mm)'
 * - UPPER_CASE: 'DIAMETRO_INTERNO_MM' -> 'Diametro Interno (mm)'
 * - PascalCase: 'DiametroInternoMm' -> 'Diametro Interno (mm)'
 * - Espaçado: 'DIAMETRO INTERNO MM' -> 'Diametro Interno (mm)'
 *
 * @param key A string a ser formatada.
 * @returns A string formatada.
 */
export const formatTechnicalKey = (key: string): string => {
  if (!key) return "";

  let processedKey = key;

  // Primeiro, verifica se a chave termina com uma unidade conhecida
  for (const unit in unitMap) {
    if (
      processedKey.toLowerCase().endsWith(` ${unit}`) ||
      processedKey.toLowerCase().endsWith(`_${unit}`) ||
      processedKey.toLowerCase().endsWith(unit)
    ) {
      let baseKey = processedKey;

      // Remove a unidade do final
      if (processedKey.toLowerCase().endsWith(` ${unit}`)) {
        baseKey = processedKey.slice(0, -unit.length - 1);
      } else if (processedKey.toLowerCase().endsWith(`_${unit}`)) {
        baseKey = processedKey.slice(0, -unit.length - 1);
      } else if (processedKey.toLowerCase().endsWith(unit)) {
        baseKey = processedKey.slice(0, -unit.length);
      }

      // Formata a parte base
      const formattedBase = formatKeyBase(baseKey);
      return `${formattedBase} ${unitMap[unit]}`;
    }
  }

  // Se nenhuma unidade for encontrada, aplica a formatação padrão
  return formatKeyBase(processedKey);
};

/**
 * Função auxiliar para formatar a parte base da chave
 */
const formatKeyBase = (key: string): string => {
  if (!key) return "";

  // Converte underscores para espaços
  let formatted = key.replace(/_/g, " ");

  // Adiciona espaços antes de letras maiúsculas (para camelCase e PascalCase)
  formatted = formatted.replace(/([A-Z])/g, " $1");

  // Remove espaços extras e capitaliza a primeira letra
  formatted = formatted.trim().replace(/\s+/g, " ");
  formatted = formatted.replace(/^./, (str) => str.toUpperCase());

  return formatted;
};
