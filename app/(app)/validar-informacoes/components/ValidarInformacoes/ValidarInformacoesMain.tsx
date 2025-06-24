"use client";
import { useRouter } from "next/navigation";

import InfoTable from "../InfoTable/InfoTable";
import ExplicacaoCard from "../ExplicacaoCard/ExplicacaoCard";
import styles from "./ValidarInformacoesMain.module.scss";

import { CitationList } from "../CitationList/CitationList";
import { ImagesBlock } from "../ImagesBlock/ImagesBlock";
import ChatLoading from "@/app/components/shared/ChatLoading/ChatLoading";
import CustomGridTable from "@/app/components/shared/CustomGrid/CustomGridTable";
import { useValidarInformacoes } from "../../hooks/useValidarInformacoes";
import { processContent } from "../../utils/validarInformacoesUtils";
import UserSearchTable from "@/app/components/ChatBoot/UserSearchTable/UserSearchTable";

export default function ValidarInformacoesMain({}) {
  const router = useRouter();

  const {
    selectedRows,
    inputHeaders,
    inputRows,
    loading,
    error,
    result,
    dataArr,
    handleRowSelect,
    handleValidar,
  } = useValidarInformacoes();

  const content = result?.[0]?.choices?.[0]?.message?.content || "";
  const { explanation, columns, data } = processContent(content);

  const images = result?.[0]?.images || [];

  return (
    <div>
      <h1 className={styles.title}>Validação das Informações</h1>
        <UserSearchTable
          inputHeaders={inputHeaders}
          inputRows={inputRows}
        />
      <div className={styles.mainContainer}>
        {loading ? (
          <ChatLoading />
        ) : (
          <>

            <InfoTable
              data={dataArr}
              selectedRows={selectedRows}
              onRowSelect={handleRowSelect}
            />
            {images.length > 0 && <ImagesBlock images={images} />}
            {result?.[0]?.citations && (
              <CitationList citations={result[0].citations} />
            )}

            {explanation && (
              <ExplicacaoCard
                explanation={explanation}
                title="Pesquisa Técnica."
              />
            )}

            <CustomGridTable
              columns={columns}
              data={data}
              onSelectionChange={(selectedRows) => console.log(selectedRows)}
            />
          </>
        )}
        <button
          onClick={handleValidar}
          className={styles.dpButton}
          disabled={loading || selectedRows.length === 0}
          style={{ marginRight: 12 }}
        >
          Validar
        </button>
        <button
          onClick={() => {
            router.push("/");
          }}
          className={styles.dpButton}
        >
          Voltar
        </button>
        {error && <div className={styles.errorMsg}>{error}</div>}
      </div>
    </div>
  );
}
