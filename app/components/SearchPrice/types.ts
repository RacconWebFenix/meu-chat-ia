export interface SearchPriceResultData {
  citations?: string[];
  images?: {
    image_url: string;
    origin_url: string;
    height?: number;
    width?: number;
  }[];
  text: {
    role: string;
    content: string;
  };
  userValue: string | number
}

export interface SearchPriceResultProps {
  result: SearchPriceResultData | null;
  loading: boolean;
  error: string | null;
}

// Tipagem dos dados de entrada do formulário de pesquisa de preço
export interface SearchPricePayload {
  descricao: string;
  marca: string;
  referencia: string;
  preco: number; // já convertido para número/double
  ddd: string;
}

export interface SearchPriceJsonInterface {
  descricao: string;
  marca: string;
  referencia: string;
  fonte_de_pesquisa: string;
  valor: string;
}