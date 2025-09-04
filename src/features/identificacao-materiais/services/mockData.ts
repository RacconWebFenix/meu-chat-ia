/**
 * Mock Data for Material Identification
 * Following Single Responsibility Principle
 */

import { MaterialIdentificationResult } from "../types";

export const mockMaterialIdentificationData: MaterialIdentificationResult = {
  response: {
    original: {
      informacoes: "FILTRO MANN HU 931/5X",
    },
    enriched: {
      categoria: "Filtro de Óleo",
      subcategoria: "Cartucho Filtrante",
      marcaFabricante: "MANN-FILTER",
      nomeProdutoEncontrado: "Filtro de Óleo MANN-FILTER HU 931/5 X",
      especificacoesTecnicas: {
        resumoPDM: `Modelo de PDM para Filtro de Óleo Automotivo
1. Identificação e Classificação do Produto
   - Nome do Produto: Filtro de Óleo MANN-FILTER HU 931/5 X
   - Código/SKU do Fabricante: HU 931/5 X
   - Tipo: Cartucho filtrante
2. Dados Técnicos Principais
   - Altura: 149 mm
   - Diâmetro exterior: 80-83 mm
   - Diâmetro interior: 28 mm e 39 mm (duas medidas internas)
3. Dados de Desempenho e Operação
   - Compatibilidade: Veículos comerciais Mercedes Vario (caminhão, van, minibus, basculante)
   - Motores compatíveis: 815 D, 815 DA, 816 DA 4x4, 813 DA, 814 DA 4x4, entre outros
   - Potência do motor: 102-177 cv (75-130 kW)
   - Ano de fabricação dos veículos compatíveis: 1996-2025
4. Materiais e Componentes
   - Elemento filtrante: Material específico para filtragem de óleo (não detalhado no catálogo público)
5. Outros Aspectos
   - Pressão máxima de operação: Informação não explicitada, mas adequada para motores diesel comerciais
   - Vida útil estimada: Conforme recomendação do fabricante do veículo e condições de uso
6. Dados Adicionais e Documentação
   - Data Sheet (Folha de Dados): Disponível no site oficial MANN-FILTER com especificações detalhadas
   - Modelos 3D e 2D: Disponíveis para integração em sistemas CAD para manutenção e engenharia`,
        especificacoesTecnicas: {
          nomeProduto: "Filtro de Óleo MANN-FILTER HU 931/5 X",
          fabricante: "MANN-FILTER",
          referenciaEncontrada: "HU 931/5 X",
          ncm: "84212300",
          unidadeMedida: "unidade",
          tipoDeFiltro: "Filtro de óleo do tipo cartucho filtrante",
          materialDoElementoFiltrante:
            "Material filtrante sintético especial para óleo de motor",
          compatibilidadeComVeiculos:
            "Mercedes Vario (caminhão, van, minibus, basculante) com motores 815 D, 815 DA, 816 DA 4x4, 813 DA, 814 DA 4x4 e similares, anos 1996-2025",
          capacidadeDeFiltragemMicra: "~10-20 micra",
          pressaoMaximaDeOperacao:
            "Compatível com motores diesel comerciais padrão",
          diametroExternoMm: "80-83 mm",
          alturaMm: "149 mm",
          diametroInterno1Mm: "28 mm",
          diametroInterno2Mm: "39 mm",
          vidaUtilEstimadaKm: "15.000 a 30.000 km",
        },
      },
      imagens: [
        {
          image_url: "https://i.zst.com.br/thumbs/12/31/32/1953475410.jpg",
          origin_url:
            "https://www.buscape.com.br/outros-acessorios-e-pecas-para-automoveis/filtro-de-oleo-mann-filter-hu-931-5-x",
          height: 590,
          width: 810,
        },
        {
          image_url:
            "https://yge.pe/wp-content/uploads/2024/09/HU-931-5-X_1200x1200.jpg",
          origin_url:
            "https://yge.pe/product/hu-931-5-filtro-de-aceite-mann-filter/",
          height: 1200,
          width: 1200,
        },
        {
          image_url:
            "https://cdn.shopify.com/s/files/1/0767/8246/9395/files/253998-filtro-de-oleo-1744908285073.jpg?v=1753349533",
          origin_url:
            "https://www.karhub.com.br/p/filtro-de-oleo-mann-filter-hu931-5x-13351297",
          height: 1586,
          width: 1586,
        },
        {
          image_url:
            "https://admm.s2.cdn-upgates.com/_cache/7/9/79d5ae1a41b35069a8b7402716cca137-hu-931-5x-000-180-16-09-9041800009-906-180-01-09-906-184-02-25-a0001801609-a9041800009-a9061800109-a.png",
          origin_url:
            "https://www.admm.cz/en/p/mann-filter-oil-filter-hu-931-5x-000-180-16-09-9041800009-906-180-01-09-906-184-02-25-a0001801609-a9041800009-a9061800109-a9061840225-8-312-089-054-0",
          height: 1000,
          width: 981,
        },
        {
          image_url:
            "https://cdn.awsli.com.br/600x450/1040/1040621/produto/136616696/fcebbeec18.jpg",
          origin_url:
            "https://www.showlub.com.br/c58465n69-wega-woe440-filtro-de-oleo-lubrificante",
          height: 431,
          width: 400,
        },
      ],
    },
    metrics: {
      confidence: 0.95,
      source: "MOCK_DATA",
    },
    suggestions: [
      "Verificar compatibilidade com o veículo específico",
      "Consultar manual do fabricante para instalação correta",
      "Realizar troca preventiva conforme quilometragem recomendada",
    ],
    warnings: [
      "Produto para uso automotivo - verificar especificações do veículo",
      "Instalação deve ser realizada por profissional qualificado",
    ],
  },
};

/**
 * Factory function to get mock data
 * Following Dependency Inversion Principle
 */
export const getMockMaterialIdentificationData =
  (): MaterialIdentificationResult => {
    return JSON.parse(JSON.stringify(mockMaterialIdentificationData));
  };
