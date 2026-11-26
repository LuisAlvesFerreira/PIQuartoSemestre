package projetointegrador.bd.service;

import projetointegrador.bd.model.LivroTema;
import projetointegrador.bd.repository.LivroTemaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LivroTemaService {

    private final LivroTemaRepository repo;

    // A inserção de dependência será pelo construtor de classe
    public LivroTemaService(LivroTemaRepository repo) {
        this.repo = repo;
    }

    public List<LivroTema> listar() {
        return repo.findAll();
    }

    public Optional<LivroTema> buscar(Long id) {
        return repo.findById(id);
    }

    public LivroTema salvar(LivroTema livroTema) {
        return repo.save(livroTema);
    }

    public boolean remove(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return true;
        }
        return false; // LivroTema não existe
    }

    public LivroTema atualiza(Long id, LivroTema livroTema) {
        if (repo.existsById(id)) {
            livroTema.setId(id); // Coloca ID no livroTema
            repo.save(livroTema); // Atualiza
            return livroTema;
        }
        return null; // LivroTema não existe
    }
}