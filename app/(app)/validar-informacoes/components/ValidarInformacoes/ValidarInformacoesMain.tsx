"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import InfoTable from "../InfoTable/InfoTable";
import ExplicacaoCard from "../ExplicacaoCard/ExplicacaoCard";
import styles from "./ValidarInformacoesMain.module.scss";
import ChatLoading from "@/app/components/shared/ChatLoading/ChatLoading";
import CustomGridTable from "@/app/components/shared/CustomGrid/CustomGridTable";
import { useValidarInformacoes } from "../../hooks/useValidarInformacoes";
import { processContent } from "../../utils/validarInformacoesUtils";
import UserSearchTable from "@/app/components/shared/UserSearchTable/UserSearchTable";
import Citations from "@/app/components/shared/Citations/Citations";
import ImageGrid from "@/app/components/ImageGrid/ImageGrid";

export default function ValidarInformacoesMain({}) {
  const router = useRouter();
  const [rowsPesquisadas, setRowsPesquisadas] = useState<number[]>([]); // NOVO ESTADO

  const {
    selectedRows,
    inputHeaders,
    inputRows,
    loading,
    error,
    result,
    dataArr,
    handleRowSelect,
    handleValidar: handleValidarOrig,
  } = useValidarInformacoes();

  const content = result?.[0]?.choices?.[0]?.message?.content || "";
  const { explanation, columns, data } = processContent(content);
  const images = result?.[0]?.images || [];

  // Função para validar e marcar linha como pesquisada
  const handleValidar = () => {
    if (selectedRows.length > 0) {
      setRowsPesquisadas((prev) => [
        ...prev,
        ...selectedRows.filter((idx) => !prev.includes(idx)),
      ]);
    }
    handleValidarOrig();
    // Limpa seleção após pesquisar (chama com null para limpar tudo)
    setTimeout(() => {
      handleRowSelect(null);
    }, 0);
  };

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
              disabledRows={rowsPesquisadas} // NOVA PROP
            />

            {images.length > 0 && (
              <div className={styles.imagesWrapper}>
                <ImageGrid images={images} />
              </div>
            )}

            {result?.[0]?.citations && (
              <Citations citations={result[0].citations} />
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
        <div className={styles.buttonContainer}>
          <div>
            <button
              onClick={handleValidar}
              className={styles.dpButton1}
              disabled={
                loading ||
                selectedRows.length === 0 ||
                rowsPesquisadas.length === dataArr.length // desabilita se todas já foram pesquisadas
              }
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
