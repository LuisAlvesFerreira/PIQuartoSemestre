package projetointegrador.bd.factory;

import projetointegrador.bd.dto.PatrimonioCadastroRequest;
import projetointegrador.bd.model.Monumento;

public abstract class MonumentoFactory<T extends Monumento> {

    public final T criar(PatrimonioCadastroRequest dados) {
        T patrimonio = criarPatrimonio(dados);
        patrimonio.setNome(dados.nome());
        patrimonio.setDataTombamento(dados.dataTombamento());
        patrimonio.setContexto(dados.contexto());
        return patrimonio;
    }

    protected abstract T criarPatrimonio(PatrimonioCadastroRequest dados);
}
