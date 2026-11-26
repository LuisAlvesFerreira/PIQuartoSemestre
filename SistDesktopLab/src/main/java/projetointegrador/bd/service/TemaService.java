package projetointegrador.bd.service;

import projetointegrador.bd.model.Tema;
import projetointegrador.bd.repository.TemaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TemaService {

    private final TemaRepository repo;

    // A inserção de dependência será pelo construtor de classe
    public TemaService(TemaRepository repo) {
        this.repo = repo;
    }

    public List<Tema> listar() {
        return repo.findAll();
    }

    public Optional<Tema> buscar(Long id) {
        return repo.findById(id);
    }

    public Tema salvar(Tema tema) {
        return repo.save(tema);
    }

    public boolean remove(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return true;
        }
        return false; // Tema não existe
    }

    public Tema atualiza(Long id, Tema tema) {
        if (repo.existsById(id)) {
            tema.setId(id); // Coloca ID no tema
            repo.save(tema); // Atualiza
            return tema;
        }
        return null; // Tema não existe
    }
}