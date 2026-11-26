package projetointegrador.bd.factory;

import org.springframework.stereotype.Component;
import projetointegrador.bd.dto.LivroCadastroRequest;
import projetointegrador.bd.model.LivroFisico;

@Component
public class LivroFisicoFactory extends LivroFactory<LivroFisico> {

    @Override
    protected LivroFisico criarLivro(LivroCadastroRequest dados) {
        LivroFisico livro = new LivroFisico();
        livro.setNumPaginas(dados.numPaginas());
        livro.setLocalizacao(dados.localizacao());
        return livro;
    }
}
