// src/mocks/material-identification/mockData.ts

export interface MaterialIdentificationResponse {
  response: {
    original: {
      informacoes: string;
    };
    enriched: {
      categoria: string;
      subcategoria: string;
      marcaFabricante: string;
      especificacoesTecnicas: {
        resumoPDM: string;
        especificacoesTecnicas: {
          nomeProduto: string;
          fabricante: string;
          referenciaEncontrada: string;
          ncm: string;
          unidadeMedida: string;
          diametroInternoMm: number;
          diametroExternoMm: number;
          larguraMm: number;
          materialGaiola: string;
          tipoVedacao: string;
          capacidadeCargaDinamicaKn: number;
          velocidadeMaximaRpm: number;
        };
      };
      imagens: Array<{
        image_url: string;
        origin_url: string;
        height: number;
        width: number;
      }>;
    };
    metrics: {
      confidence: number;
      source: string;
    };
    suggestions: string[];
    warnings: string[];
  };
}

export const mockMaterialIdentificationData: MaterialIdentificationResponse = {
  response: {
    original: {
      informacoes: "Rolamento Esferas SKF 6205z",
    },
    enriched: {
      categoria: "",
      subcategoria: "",
      marcaFabricante: "SKF",
      especificacoesTecnicas: {
        resumoPDM:
          "Modelo de PDM para Rolamento de Esferas\n1. Identificação e Classificação do Produto\n   - Nome do Produto: Rolamento de Esferas, Rolamento de Esferas de Contato Angular, Rolamento de Esferas de Alta Precisão\n   - Código/SKU do Fabricante: 6205, 6204, 6305\n   - Tipo: Radial de Esferas, Vedação Simples (ZZ), Vedação Dupla (2RS)\n2. Dados Geométricos e de Dimensão\n   - Diâmetro Interno (d): 25 mm, 30 mm, 35 mm\n   - Diâmetro Externo (D): 52 mm, 62 mm, 72 mm\n   - Largura (B): 15 mm, 16 mm, 17 mm\n3. Dados de Desempenho e Operação\n   - Capacidade de Carga Dinâmica (C): 14 kN, 20 kN, 35 kN\n   - Velocidade Limite (rpm): 13000 rpm (graxa), 18000 rpm (óleo), 15000 rpm (graxa especial)\n   - Folga Interna: C3, CN (Normal), C4\n4. Materiais e Componentes\n   - Anéis: Aço cromo, Aço inoxidável, Aço cementado\n   - Esferas/Rolos: Aço cromo, Cerâmica (Si3N4), Aço Inoxidável\n   - Gaiola: Aço estampado, Latão usinado, Poliamida\n   - Vedação/Proteção: 2RS (borracha), ZZ (metal), Aberto (sem vedação)\n5. Lubrificação\n   - Tipo de Lubrificante Padrão: Graxa à base de Lítio, Graxa de Poliureia, Lubrificação a Óleo\n6. Dados Adicionais e Documentação\n   - Data Sheet (Folha de Dados): Documento técnico com especificações detalhadas\n   - Modelos 3D e 2D: Arquivos CAD para integração em projetos",
        especificacoesTecnicas: {
          nomeProduto: "Rolamento de Esferas",
          fabricante: "SKF",
          referenciaEncontrada: "6205 ZZ",
          ncm: "84821000",
          unidadeMedida: "mm",
          diametroInternoMm: 25,
          diametroExternoMm: 52,
          larguraMm: 15,
          materialGaiola: "Aço estampado",
          tipoVedacao: "ZZ",
          capacidadeCargaDinamicaKn: 14200,
          velocidadeMaximaRpm: 15500,
        },
      },
      imagens: [
        {
          image_url:
            "https://elastobor.vtexassets.com/arquivos/ids/230972-400-400/ROLAMENTO-ESFERA-ELASTOBOR-6205-ZZ.jpg?v=637687772915070000",
          origin_url:
            "https://www.elastobor.com.br/rolamento-esfera-elastobor-6205-zz/p",
          height: 400,
          width: 400,
        },
        {
          image_url:
            "https://images.tcdn.com.br/img/img_prod/835310/90_rolamento_rigido_de_esferas_timken_6205_zz_12039_1_4746d41fa955baf90a5882d17fdad8d7.jpg",
          origin_url:
            "https://www.loja.abecom.com.br/rolamento-rigido-de-esferas-timken-6205-zz",
          height: 300,
          width: 300,
        },
        {
          image_url:
            "https://www.oliveirarolamentos.com.br/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/r/i/rigido_de_esfera_zz_nsk.png",
          origin_url:
            "https://www.oliveirarolamentos.com.br/rolamento-rigido-de-esferas-6205-zz-nr-25x52x15mm.html",
          height: 500,
          width: 500,
        },
        {
          image_url:
            "https://www.vonder.com.br/estatico/vonder/produto/6672620500.jpg",
          origin_url:
            "https://www.vonder.com.br/produto/rolamento_rgido_de_esfera_6205zz_vonder/11101",
          height: 766,
          width: 760,
        },
        {
          image_url:
            "https://cdn.awsli.com.br/800x800/1711/1711975/produto/363284406/2f863b3e69b3c5ffc1f3de6a21a53718-6waroiz4y3.jpg",
          origin_url:
            "https://www.industrialmotores.com.br/rolamento-de-esfera-6205-zz-nsk",
          height: 515,
          width: 591,
        },
      ],
    },
    metrics: {
      confidence: 0.95,
      source: "AI_ENRICHMENT",
    },
    suggestions: [],
    warnings: [],
  },
};
