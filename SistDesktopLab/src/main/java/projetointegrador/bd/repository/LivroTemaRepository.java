package projetointegrador.bd.repository;

import projetointegrador.bd.model.Livro;
import projetointegrador.bd.model.LivroTema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LivroTemaRepository
        extends JpaRepository<LivroTema, Long> {

    // Métodos customizados:
    // 1. Busca todas as associações de um livro específico
    List<LivroTema> findByLivroId(Long livroId);

    // 2. JPQL: Busca diretamente a lista de LIVROS que pertencem a um tema específico (pelo ID do tema)
    @Query("SELECT lt.livro FROM LivroTema lt WHERE lt.tema.id = :temaId")
    List<Livro> findLivrosByTemaId(@Param("temaId") Long temaId);

    // 3. JPQL: Busca diretamente a lista de LIVROS pelo NOME do tema (ex: "Ficção")
    @Query("SELECT lt.livro FROM LivroTema lt WHERE LOWER(lt.tema.nomeTema) LIKE LOWER(CONCAT('%', :nomeTema, '%'))")
    List<Livro> findLivrosByNomeTema(@Param("nomeTema") String nomeTema);

    // 4. Deleta a associação de um tema específico de um livro (Útil para atualizar os temas do livro)
    void deleteByLivroIdAndTemaId(Long livroId, Long temaId);
}