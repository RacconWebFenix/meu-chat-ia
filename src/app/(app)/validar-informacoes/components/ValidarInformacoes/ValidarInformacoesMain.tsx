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
import ImageGrid from "@/components/ImageGrid/ImageGrid";
import CustomGridTable from "@/components/shared/CustomGrid/CustomGridTable";
import { CustomButton } from "@/components";
import { useNavigationWithLoading } from "@/hooks/useNavigationWithLoading";

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

  const safeResult = (result as any[]) || [];
  const content = safeResult[0]?.choices?.[0]?.message?.content || "";
  const { explanation, columns, data } = processContent(content);
  const images = Array.isArray(safeResult[0]?.images)
    ? safeResult[0].images
    : [];

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
                    <ImageGrid images={images as any[]} />
                  </Box>
                </CardContent>
              </Card>
            )}

            {Array.isArray(safeResult[0]?.citations) && (
              <Card elevation={2}>
                <CardContent>
                  <Citations citations={safeResult[0].citations as any[]} />
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
              navigateTo("/search");
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
