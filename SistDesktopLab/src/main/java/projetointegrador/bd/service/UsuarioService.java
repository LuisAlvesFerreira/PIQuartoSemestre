package projetointegrador.bd.service;

import projetointegrador.bd.model.Usuario;
import projetointegrador.bd.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository repo;

    // A inserção de dependência será pelo construtor de classe
    public UsuarioService(UsuarioRepository repo) {
        this.repo = repo;
    }

    public List<Usuario> listar() {
        return repo.findAll();
    }

    public Optional<Usuario> buscar(Long id) {
        return repo.findById(id);
    }

    public Usuario salvar(Usuario usuario) {
        return repo.save(usuario);
    }

    public boolean remove(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return true;
        }
        return false; // usuario não existe
    }

    public Usuario atualiza(Long id, Usuario usuario) {
        if (repo.existsById(id)) {
            usuario.setId(id); // Coloca ID no usuario
            repo.save(usuario); // Atualiza
            return usuario;
        }
        return null; // Usuario não existe
    }
}