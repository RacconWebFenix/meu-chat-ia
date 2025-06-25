// ...existing code...
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
// ...existing code...
