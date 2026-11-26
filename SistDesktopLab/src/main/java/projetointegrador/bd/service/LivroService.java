package projetointegrador.bd.service;

import projetointegrador.bd.model.Livro;
import projetointegrador.bd.repository.LivroRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LivroService {

    private final LivroRepository repo;

    // A inserção de dependência será pelo construtor de classe
    public LivroService(LivroRepository repo) {
        this.repo = repo;
    }

    public List<Livro> listar() {
        return repo.findAll();
    }

    public Optional<Livro> buscar(Long id) {
        return repo.findById(id);
    }

}