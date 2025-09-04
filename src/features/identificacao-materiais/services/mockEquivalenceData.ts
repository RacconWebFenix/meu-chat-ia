/**
 * Mock Data for Equivalence Search
 * Following Single Responsibility Principle
 */

import { EquivalenceSearchResult, EquivalenceResult } from "../types";

export const mockEquivalenceSearchData: EquivalenceSearchResult = {
  equivalencias: [
    {
      nome: "Filtro de Óleo WIX WL7504",
      fabricante: "WIX",
      NCM: "84212300",
      referencia: "WL7504",
      tipo_de_unidade: "unidade",
      caracteristicas: [
        {
          "Altura (mm)": "149",
          "Diâmetro Externo (mm)": "80-83",
          "Diâmetro Interno (mm)": "28/39",
          Material: "Sintético",
          Compatibilidade: "Mercedes Vario",
        },
      ],
      imagens: [
        {
          image_url: "https://example.com/wix-wl7504-1.jpg",
          origin_url: "https://www.wixfilters.com/wl7504",
          height: 600,
          width: 600,
        },
        {
          image_url: "https://example.com/wix-wl7504-2.jpg",
          origin_url: "https://www.wixfilters.com/wl7504-details",
          height: 800,
          width: 600,
        },
      ],
      citacoes: [
        {
          title: "Filtro de Óleo WIX WL7504 - Especificações Técnicas",
          url: "https://www.wixfilters.com/products/wl7504",
          date: "2024-01-15",
          last_updated: "2024-01-15",
          snippet:
            "Filtro de óleo automotivo WIX WL7504 compatível com Mercedes Vario. Dimensões: 149mm altura, 80-83mm diâmetro externo.",
        },
        {
          title: "Catálogo WIX - Filtros Industriais",
          url: "https://www.wixfilters.com/catalog/industrial",
          date: "2024-02-01",
          last_updated: "2024-02-01",
          snippet:
            "WL7504 é um filtro de óleo de alta eficiência para motores diesel comerciais Mercedes.",
        },
      ],
    },
    {
      nome: "Filtro de Óleo BOSCH F026407001",
      fabricante: "BOSCH",
      NCM: "84212300",
      referencia: "F026407001",
      tipo_de_unidade: "unidade",
      caracteristicas: [
        {
          "Altura (mm)": "150",
          "Diâmetro Externo (mm)": "82",
          "Diâmetro Interno (mm)": "28/39",
          Material: "Sintético de alta performance",
          Compatibilidade: "Mercedes Vario, MAN, Volvo",
        },
      ],
      imagens: [
        {
          image_url: "https://example.com/bosch-f026407001-1.jpg",
          origin_url: "https://www.bosch-automotive.com/f026407001",
          height: 500,
          width: 500,
        },
      ],
      citacoes: [
        {
          title: "Filtro de Óleo BOSCH F026407001",
          url: "https://www.bosch-automotive.com/products/f026407001",
          date: "2024-01-20",
          last_updated: "2024-01-20",
          snippet:
            "Filtro de óleo BOSCH para veículos comerciais Mercedes Vario. Eficiência de filtração superior a 99%.",
        },
      ],
    },
    {
      nome: "Filtro de Óleo MAHLE OC1001",
      fabricante: "MAHLE",
      NCM: "84212300",
      referencia: "OC1001",
      tipo_de_unidade: "unidade",
      caracteristicas: [
        {
          "Altura (mm)": "148",
          "Diâmetro Externo (mm)": "81",
          "Diâmetro Interno (mm)": "28/39",
          Material: "Celulose e sintético",
          Compatibilidade: "Mercedes Vario, Scania",
        },
      ],
      imagens: [
        {
          image_url: "https://example.com/mahle-oc1001-1.jpg",
          origin_url: "https://www.mahle.com/oc1001",
          height: 700,
          width: 700,
        },
      ],
      citacoes: [
        {
          title: "Filtro de Óleo MAHLE OC1001 - Dados Técnicos",
          url: "https://www.mahle.com/products/oc1001",
          date: "2024-01-10",
          last_updated: "2024-01-10",
          snippet:
            "OC1001 filtro de óleo MAHLE para motores diesel comerciais. Capacidade de retenção de contaminantes excepcional.",
        },
      ],
    },
  ],
};

/**
 * Factory function to get mock equivalence data
 * Following Dependency Inversion Principle
 */
export const getMockEquivalenceSearchData = (): EquivalenceSearchResult => {
  return JSON.parse(JSON.stringify(mockEquivalenceSearchData));
};
