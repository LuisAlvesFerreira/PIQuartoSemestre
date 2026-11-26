package projetointegrador.bd.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import projetointegrador.bd.model.Monumento;

import java.util.List;

@Repository
public interface MonumentoRepository extends JpaRepository<Monumento, Long> {

    List<Monumento> findByNomeContainingIgnoreCase(String nome);
}
