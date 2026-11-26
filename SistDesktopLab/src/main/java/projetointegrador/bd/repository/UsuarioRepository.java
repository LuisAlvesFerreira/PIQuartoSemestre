package projetointegrador.bd.repository;

import projetointegrador.bd.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository
        extends JpaRepository<Usuario, Long> {

    // Métodos customizados:
    // 1. Busca um usuário pelo login (Essencial para o processo de login/autenticação)
    Optional<Usuario> findByLogin(String login);

    // 2. Retorna se um login já existe (Útil na validação de novos cadastros)
    boolean existsByLogin(String login);

    // 3. Busca apenas os usuários que são administradores
    List<Usuario> findByAdminTrue();
}