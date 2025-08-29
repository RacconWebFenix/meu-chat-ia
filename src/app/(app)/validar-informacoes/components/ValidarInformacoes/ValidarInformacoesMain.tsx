"use client";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  Stack,
} from "@mui/material";
import InfoTable from "../InfoTable/InfoTable";
import ExplicacaoCard from "../ExplicacaoCard/ExplicacaoCard";
import { useValidarInformacoes } from "../../../../../features/validar-informacoes/hooks/useValidarInformacoes";
import { processContent } from "../../utils/validarInformacoesUtils";
import UserSearchTable from "@/components/shared/UserSearchTable/UserSearchTable";
import { ChatLoading, Citations } from "@/components/shared";
import ImageGrid, { Img } from "@/components/ImageGrid/ImageGrid";
// Citations espera: citations: { url: string; siteName: string }[]
import CustomGridTable from "@/components/shared/CustomGrid/CustomGridTable";
import { CustomButton } from "@/components";
import { useNavigationWithLoading } from "@/hooks/useNavigationWithLoading";
import { getSiteName } from "../../utils/getSiteName";
import { useChatBoot } from "@/features/chat";
import { useEffect, useMemo, useState } from "react";

export default function ValidarInformacoesMain({}) {
  const { navigateTo } = useNavigationWithLoading();

  const {
    selectedRows,
    inputHeaders,
    inputRows,
    loading,
    error,
    result,
    dataArr,
    pesquisadasRows,
    handleRowSelect,
    handleValidar,
  } = useValidarInformacoes();

  interface ResultType {
    choices?: { message?: { content?: string } }[];
    images?: Img[];
    citations?: { url: string; siteName: string }[];
  }
  const safeResult: ResultType[] = useMemo(
    () => (Array.isArray(result) ? result : []),
    [result]
  );
  const content = safeResult[0]?.choices?.[0]?.message?.content || "";
  const { explanation, columns, data } = processContent(content);
  const images = Array.isArray(safeResult[0]?.images)
    ? safeResult[0].images
    : [];

  const [citations, setCitations] = useState<
    { url: string; siteName: string }[]
  >([]);

  useEffect(() => {
    const processedCitations = Array.isArray(safeResult[0]?.citations)
      ? safeResult[0].citations.map((c) => (typeof c === "string" ? c : c.url))
      : [];
    const formattedCitations = processedCitations.map((citation: string) => ({
      url: citation,
      siteName: getSiteName(citation),
    }));
    setCitations(formattedCitations);
  }, [result, safeResult]);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box mb={3}>
        <UserSearchTable inputHeaders={inputHeaders} inputRows={inputRows} />
      </Box>

      <Box>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <ChatLoading />
          </Box>
        ) : (
          <Stack spacing={3}>
            <Card elevation={2}>
              <CardContent>
                <InfoTable
                  data={dataArr}
                  selectedRows={selectedRows}
                  onRowSelect={handleRowSelect}
                  disabledRows={pesquisadasRows}
                />
              </CardContent>
            </Card>

            {Array.isArray(images) && images.length > 0 && (
              <Card elevation={2}>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <ImageGrid images={images} />
                  </Box>
                </CardContent>
              </Card>
            )}

            {citations.length > 0 && (
              <Card elevation={2}>
                <CardContent>
                  <Citations citations={citations} />
                </CardContent>
              </Card>
            )}

            {explanation && (
              <Card elevation={2}>
                <CardContent>
                  <ExplicacaoCard
                    explanation={explanation}
                    title="Pesquisa Avançada"
                  />
                </CardContent>
              </Card>
            )}

            {data.length > 0 && (
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Resultados da Validação
                  </Typography>
                  <CustomGridTable
                    columns={columns}
                    data={data}
                    onSelectionChange={(selectedRows) =>
                      console.log(selectedRows)
                    }
                  />
                </CardContent>
              </Card>
            )}
          </Stack>
        )}

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={4}
          gap={2}
        >
          <CustomButton
            onClick={handleValidar}
            colorType="primary"
            variant="contained"
            disabled={
              loading ||
              selectedRows.length === 0 ||
              pesquisadasRows.length === dataArr.length
            }
            sx={{
              py: 1.5,
              px: 3,
              fontSize: 16,
              fontWeight: 700,
              background: (theme) => theme.palette.primary.main,
              color: (theme) => theme.palette.primary.contrastText,
              "&:hover": {
                background: (theme) => theme.palette.primary.dark,
              },
            }}
          >
            Pesquisa Avançada
          </CustomButton>

          <CustomButton
            onClick={() => {
              navigateTo("/");
            }}
            color="primary"
            sx={{
              py: 1.5,
              px: 3,
              fontSize: 16,
              fontWeight: 700,
              background: (theme) => theme.palette.error.main,
              color: (theme) => theme.palette.primary.contrastText,
              "&:hover": {
                background: (theme) => theme.palette.primary.light,
              },
            }}
          >
            Cancelar
          </CustomButton>
        </Box>

        {error && (
          <Box mt={2}>
            <Alert severity="error" variant="filled">
              {error}
            </Alert>
          </Box>
        )}
      </Box>
    </Container>
  );
}
