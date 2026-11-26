package projetointegrador.bd.dto;

public record LivroCadastroRequest(
        String titulo,
        String autor,
        String editora,
        int ano,
        Integer numPaginas,
        String localizacao,
        String formato,
        Float tamanhoArquivo) {
}
