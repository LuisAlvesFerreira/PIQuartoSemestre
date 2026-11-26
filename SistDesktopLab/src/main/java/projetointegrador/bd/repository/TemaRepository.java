package projetointegrador.bd.repository;

import projetointegrador.bd.model.Tema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TemaRepository
        extends JpaRepository<Tema, Long> {

    // Métodos customizados:
    // 1. Busca o tema pelo nome exato (Útil para evitar duplicados no cadastro)
    Optional<Tema> findByNomeTemaIgnoreCase(String nomeTema);

    // 2. Busca temas que contenham parte do nome
    java.util.List<Tema> findByNomeTemaContainingIgnoreCase(String nomeTema);
}