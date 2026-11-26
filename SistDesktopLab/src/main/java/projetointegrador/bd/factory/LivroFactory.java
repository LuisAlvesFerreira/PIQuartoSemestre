package projetointegrador.bd.factory;

import projetointegrador.bd.dto.LivroCadastroRequest;
import projetointegrador.bd.model.Livro;

public abstract class LivroFactory<T extends Livro> {

    public final T criar(LivroCadastroRequest dados) {
        T livro = criarLivro(dados);
        livro.setTitulo(dados.titulo());
        livro.setAutor(dados.autor());
        livro.setEditora(dados.editora());
        livro.setAno(dados.ano());
        return livro;
    }

    protected abstract T criarLivro(LivroCadastroRequest dados);
}
