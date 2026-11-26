package projetointegrador.bd.service;

import org.springframework.stereotype.Service;
import projetointegrador.bd.model.PatrimonioImaterial;
import projetointegrador.bd.repository.PatrimonioImaterialRepository;

import java.util.List;
import java.util.Optional;

@Service
public class PatrimonioImaterialService {

    private final PatrimonioImaterialRepository repo;

    public PatrimonioImaterialService(PatrimonioImaterialRepository repo) {
        this.repo = repo;
    }

    public List<PatrimonioImaterial> listar() {
        return repo.findAll();
    }

    public Optional<PatrimonioImaterial> buscar(Long id) {
        return repo.findById(id);
    }

    public List<PatrimonioImaterial> buscarPorManifestacao(String tipoManifestacao) {
        return repo.findByTipoManifestacaoIgnoreCase(tipoManifestacao);
    }

    public PatrimonioImaterial salvar(PatrimonioImaterial patrimonio) {
        return repo.save(patrimonio);
    }

    public boolean remover(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return true;
        }
        return false;
    }

    public PatrimonioImaterial atualizar(Long id, PatrimonioImaterial patrimonio) {
        if (repo.existsById(id)) {
            patrimonio.setId(id);
            return repo.save(patrimonio);
        }
        return null;
    }
}
