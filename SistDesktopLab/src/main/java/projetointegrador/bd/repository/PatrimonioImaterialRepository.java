package projetointegrador.bd.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import projetointegrador.bd.model.PatrimonioImaterial;

import java.util.List;

@Repository
public interface PatrimonioImaterialRepository extends JpaRepository<PatrimonioImaterial, Long> {

    List<PatrimonioImaterial> findByTipoManifestacaoIgnoreCase(String tipoManifestacao);
}
