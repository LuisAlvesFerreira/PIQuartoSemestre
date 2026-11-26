package projetointegrador.bd.service;

import org.springframework.stereotype.Service;
import projetointegrador.bd.model.PatrimonioMaterial;
import projetointegrador.bd.repository.PatrimonioMaterialRepository;

import java.util.List;
import java.util.Optional;

@Service
public class PatrimonioMaterialService {

    private final PatrimonioMaterialRepository repo;

    public PatrimonioMaterialService(PatrimonioMaterialRepository repo) {
        this.repo = repo;
    }

    public List<PatrimonioMaterial> listar() {
        return repo.findAll();
    }

    public Optional<PatrimonioMaterial> buscar(Long id) {
        return repo.findById(id);
    }

    public List<PatrimonioMaterial> buscarPorTipo(String tipo) {
        return repo.findByTipoIgnoreCase(tipo);
    }

    public PatrimonioMaterial salvar(PatrimonioMaterial patrimonio) {
        return repo.save(patrimonio);
    }

    public boolean remover(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return true;
        }
        return false;
    }

    public PatrimonioMaterial atualizar(Long id, PatrimonioMaterial patrimonio) {
        if (repo.existsById(id)) {
            patrimonio.setId(id);
            return repo.save(patrimonio);
        }
        return null;
    }
}
