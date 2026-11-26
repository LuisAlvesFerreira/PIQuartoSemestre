package projetointegrador.bd.service;


import org.springframework.stereotype.Service;
import projetointegrador.bd.model.LivroFisico;
import projetointegrador.bd.repository.LivroFisicoRepository;

import java.util.List;

@Service
public class LivroFisicoService {

    private final LivroFisicoRepository repo;

    public LivroFisicoService(LivroFisicoRepository repo) {
        this.repo = repo;
    }

    public List<LivroFisico> listar() {
        return repo.findAll();
    }

    public LivroFisico salvar(LivroFisico livro) {
        return repo.save(livro);
    }

    public LivroFisico atualizar(Long id, LivroFisico livro) {
        return repo.findById(id).map(atual -> {
            atualizarDadosComuns(atual, livro);
            atual.setNumPaginas(livro.getNumPaginas());
            atual.setLocalizacao(livro.getLocalizacao());
            return repo.save(atual);
        }).orElse(null);
    }

    public boolean remover(Long id) {
        if (!repo.existsById(id)) {
            return false;
        }
        repo.deleteById(id);
        return true;
    }

    private void atualizarDadosComuns(LivroFisico atual, LivroFisico livro) {
        atual.setTitulo(livro.getTitulo());
        atual.setAutor(livro.getAutor());
        atual.setEditora(livro.getEditora());
        atual.setAno(livro.getAno());
    }
}
