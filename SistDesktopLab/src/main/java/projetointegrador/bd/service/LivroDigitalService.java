package projetointegrador.bd.service;

import org.springframework.stereotype.Service;
import projetointegrador.bd.model.LivroDigital;
import projetointegrador.bd.repository.LivroDigitalRepository;

import java.util.List;

@Service
public class LivroDigitalService {

    private final LivroDigitalRepository repo;

    public LivroDigitalService(LivroDigitalRepository repo) {
        this.repo = repo;
    }

    public List<LivroDigital> listar() {
        return repo.findAll();
    }

    public LivroDigital salvar(LivroDigital livro) {
        return repo.save(livro);
    }

    public LivroDigital atualizar(Long id, LivroDigital livro) {
        return repo.findById(id).map(atual -> {
            atual.setTitulo(livro.getTitulo());
            atual.setAutor(livro.getAutor());
            atual.setEditora(livro.getEditora());
            atual.setAno(livro.getAno());
            atual.setFormato(livro.getFormato());
            atual.setTamanhoArquivo(livro.getTamanhoArquivo());
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
}
