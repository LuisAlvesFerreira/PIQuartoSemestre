package projetointegrador.bd.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import projetointegrador.bd.model.PatrimonioMaterial;

import java.util.List;

@Repository
public interface PatrimonioMaterialRepository extends JpaRepository<PatrimonioMaterial, Long> {

    List<PatrimonioMaterial> findByTipoIgnoreCase(String tipo);
}
