package projetointegrador.bd.factory;

import org.springframework.stereotype.Component;
import projetointegrador.bd.dto.LivroCadastroRequest;
import projetointegrador.bd.model.LivroDigital;

@Component
public class LivroDigitalFactory extends LivroFactory<LivroDigital> {

    @Override
    protected LivroDigital criarLivro(LivroCadastroRequest dados) {
        LivroDigital livro = new LivroDigital();
        livro.setFormato(dados.formato());
        livro.setTamanhoArquivo(dados.tamanhoArquivo());
        return livro;
    }
}
