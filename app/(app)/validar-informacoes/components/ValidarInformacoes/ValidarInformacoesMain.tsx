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
import UserSearchTable from "@/app/components/shared/UserSearchTable/UserSearchTable";

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
    <>
      <h1 className={styles.title}>Pesquisa Avançada</h1>

      <UserSearchTable inputHeaders={inputHeaders} inputRows={inputRows} />

      <div className={styles.innerContainer}>
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
                title="Pesquisa Avançada"
              />
            )}

            <CustomGridTable
              columns={columns}
              data={data}
              onSelectionChange={(selectedRows) => console.log(selectedRows)}
            />
          </>
        )}
        <div className="buttonContainer">
          <div>
            <button
              onClick={handleValidar}
              className={styles.dpButton1}
              disabled={loading || selectedRows.length === 0}
              style={{ marginRight: 12 }}
            >
              Pesquisa Avançada
            </button>
          </div>
          <div>
            <button
              onClick={() => {
                router.push("/");
              }}
              className={styles.dpButton2}
            >
              Cancelar
            </button>
          </div>
        </div>
        {error && <div className={styles.errorMsg}>{error}</div>}
      </div>
    </>
  );
}
