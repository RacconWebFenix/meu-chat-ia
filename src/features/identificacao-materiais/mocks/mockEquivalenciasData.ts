/**
 * Mock data for Equivalencias Table
 * Following Single Responsibility Principle: Provides test data for equivalencias
 */

export interface CaracteristicaItem extends Record<string, string> {}

export interface ImagemItem {
  image_url: string;
  origin_url: string;
  height: number;
  width: number;
}

export interface CitacaoItem {
  title: string;
  url: string;
  date: string | null;
  last_updated: string | null;
  snippet: string;
}

export interface EquivalenciaItem {
  nome: string;
  fabricante: string;
  NCM: string;
  referencia: string;
  tipo_de_unidade: string;
  caracteristicas: CaracteristicaItem[];
  imagens: ImagemItem[];
  citacoes: CitacaoItem[];
}

export interface EquivalenciasData {
  equivalencias: EquivalenciaItem[];
}

export const mockEquivalenciasData: EquivalenciasData[] = [
  {
    equivalencias: [
      {
        nome: "Rolamento Rígido de Esferas 6205 ZZ",
        fabricante: "NSK",
        NCM: "84821010",
        referencia: "Não informado",
        tipo_de_unidade: "Não informado",
        caracteristicas: [
          {
            diametroInterno_mm: "25",
            diametroExterno_mm: "52",
            largura_mm: "15",
            materialBlindagem: "Aço metálico (ZZ)",
          },
        ],
        imagens: [
          {
            image_url:
              "https://mundoeletric.cdn.magazord.com.br/img/2025/03/produto/5011/5.jpg?ims=fit-in/630x865/filters:fill(white)",
            origin_url:
              "https://www.mundoeletric.com.br/rolamento-rigido-de-esferas-6205zz-c3-nsk-medida-25mm-x-52mm-x-15mm",
            height: 865,
            width: 630,
          },
        ],
        citacoes: [
          {
            title:
              "Rolamento Rígido de Esferas 6205 ZZ - NSK | Cofermeta Ferramentas",
            url: "https://www.cofermeta.com.br/rolam-rig-esf-6205-zz-nsk",
            date: "2025-01-01",
            last_updated: "2025-02-25",
            snippet:
              "Marca: NSK · Código do Produto:6205 ZZ · Subgrupo: Rolamento Rígido de Esferas · NCM:84821010 · Diâmetro Interno:25mm · Diâmetro Externo:52mm · Largura:15mm · Peso:0, ...",
          },
        ],
      },
      {
        nome: "Rolamento Rígido de Esferas 6205-2Z/C4",
        fabricante: "SKF",
        NCM: "84821010",
        referencia: "Não informado",
        tipo_de_unidade: "Não informado",
        caracteristicas: [
          {
            diametroInterno_mm: "25",
            diametroExterno_mm: "52",
            largura_mm: "15",
            materialBlindagem: "Aço metálico (2Z)",
          },
        ],
        imagens: [
          {
            image_url:
              "https://retensul.cdn.magazord.com.br/img/2022/03/produto/127/zz-nsk.jpg?ims=fit-in/600x600/filters:fill(white)",
            origin_url:
              "https://www.retensul.com.br/rolamento-1-carreira-de-esfera-rigido-6205-zz-normal-15-unidades",
            height: 600,
            width: 600,
          },
        ],
        citacoes: [
          {
            title: "Rolamento 6205 ZZ SKF | Cone e Capa Comercial",
            url: "https://www.coneecaparolamentos.com.br/rolamentos/rolamentos-rigidos-de-esfera/rolamento-6205-zz-skf",
            date: "2025-01-01",
            last_updated: "2025-08-27",
            snippet: "Missing: equivalentes Brasil",
          },
        ],
      },
      {
        nome: "Rolamento Rígido de Esferas 6205 ZZ",
        fabricante: "FAG",
        NCM: "84821010",
        referencia: "Não informado",
        tipo_de_unidade: "Não informado",
        caracteristicas: [
          {
            diametroInterno_mm: "25",
            diametroExterno_mm: "52",
            largura_mm: "15",
            materialBlindagem: "Aço metálico (ZZ)",
          },
        ],
        imagens: [
          {
            image_url:
              "https://mundoeletric.cdn.magazord.com.br/img/2024/06/produto/2171/imagem-1.png?ims=fit-in/630x865/filters:fill(white)",
            origin_url:
              "https://www.mundoeletric.com.br/rolamento-rigido-de-esferas-6205zz-nsk-medida-25mm-x-52mm-x-15mm",
            height: 865,
            width: 630,
          },
        ],
        citacoes: [
          {
            title: "6205-2Z/C4 - Rolamentos Rígidos de Esferas - SKF",
            url: "https://www.irsa.com.br/6205-2z-c4-rolamentos-rigidos-de-esfera-skf",
            date: "2025-02-14",
            last_updated: "2025-06-16",
            snippet: "Missing: 6205zz equivalentes",
          },
        ],
      },
      {
        nome: "Rolamento Rígido de Esferas 6205 ZZ",
        fabricante: "Timken",
        NCM: "84821010",
        referencia: "Não informado",
        tipo_de_unidade: "Não informado",
        caracteristicas: [
          {
            diametroInterno_mm: "25",
            diametroExterno_mm: "52",
            largura_mm: "15",
            materialBlindagem: "Aço metálico (ZZ)",
          },
        ],
        imagens: [
          {
            image_url:
              "https://cdn.iset.io/assets/58238/produtos/3026/112aaf8dce6226f5ffe6e50f0b5fb104686d72a59bd82.png",
            origin_url:
              "https://www.rolautorolamentos.com.br/rolamento-6205-zz-nsk-p3026",
            height: 1000,
            width: 1000,
          },
        ],
        citacoes: [
          {
            title:
              "Rolamento Inferior 6205-ZZ NSK/SKF Para Lava e Seca 10 a 12kg ...",
            url: "http://www.multifrioshop.com/produtos-novos/rolamento-inferior-6205-zz-nskskf-para-lava-e-seca-lg-10-a-12kg-e-brastemp-7-5kg-bws24as",
            date: null,
            last_updated: null,
            snippet:
              "Rolamento Inferior 6205-ZZ NSK/SKF Para Lava e Seca 10 a 12kg E Brastemp 7,5kg BWS24AS para LG. Por: R$ 21,07. R$ 18,96 à vista com desconto",
          },
        ],
      },
      {
        nome: "Rolamento Rígido de Esferas 6205 ZZ",
        fabricante: "C&U",
        NCM: "84821010",
        referencia: "Não informado",
        tipo_de_unidade: "Não informado",
        caracteristicas: [
          {
            diametroInterno_mm: "25",
            diametroExterno_mm: "52",
            largura_mm: "15",
            materialBlindagem: "Aço metálico (ZZ)",
          },
        ],
        imagens: [
          {
            image_url:
              "https://images.tcdn.com.br/img/img_prod/469103/rolamento_rigido_de_esferas_6205_zz_nsk_139551_1_4746f01c0d77c2e2f885d8a6b24b2f6c.png",
            origin_url:
              "https://www.cofermeta.com.br/rolam-rig-esf-6205-zz-nsk",
            height: 650,
            width: 1000,
          },
        ],
        citacoes: [
          {
            title: "Rolamento Rigido de esferas SKF 6205-Z - Loja ABECOM",
            url: "http://www.loja.abecom.com.br/rolamento-rigido-de-esferas-skf-6205-z",
            date: null,
            last_updated: null,
            snippet: "Missing: 6205zz equivalentes",
          },
        ],
      },
    ],
  },
];
