package projetointegrador.bd.repository;

import projetointegrador.bd.model.Livro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LivroRepository
        extends JpaRepository<Livro, Long> {

    // Métodos customizados:
    // 1. Busca livros que contenham parte do título (Ignorando maiúsculas/minúsculas)
    List<Livro> findByTituloContainingIgnoreCase(String titulo);

    // 2. Busca livros de um autor específico
    List<Livro> findByAutorIgnoreCase(String autor);

    // 3. Busca livros lançados em um determinado ano
    List<Livro> findByAno(int ano);

    // 4. Busca todos os livros cadastrados por um Usuário específico (pelo login do usuário)
    List<Livro> findByUsuarioLogin(String login);

    // 5. Busca personalizada: Livros de um autor lançados a partir de um ano específico
    List<Livro> findByAutorIgnoreCaseAndAnoGreaterThanEqual(String autor, int ano);
}