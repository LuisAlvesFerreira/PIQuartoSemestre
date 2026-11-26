package projetointegrador.bd.dto;

import java.time.LocalDate;

public record PatrimonioCadastroRequest(
        String nome,
        LocalDate dataTombamento,
        String contexto,
        String endereco,
        String tipo,
        String tipoManifestacao,
        String localidade) {
}
