package projetointegrador.bd.service;

import org.springframework.stereotype.Service;
import projetointegrador.bd.model.Monumento;
import projetointegrador.bd.repository.MonumentoRepository;

import java.util.List;
import java.util.Optional;

@Service
public class MonumentoService {

    private final MonumentoRepository repo;

    public MonumentoService(MonumentoRepository repo) {
        this.repo = repo;
    }

    public List<Monumento> listar() {
        return repo.findAll();
    }

    public Optional<Monumento> buscar(Long id) {
        return repo.findById(id);
    }

    public List<Monumento> buscarPorNome(String nome) {
        return repo.findByNomeContainingIgnoreCase(nome);
    }

}
