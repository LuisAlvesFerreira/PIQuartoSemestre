package projetointegrador.bd.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String login;

    @Column(nullable = false, length = 255)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String senha;

    @Column(nullable = false)
    private boolean admin;

    @JsonIgnore
    @OneToMany(mappedBy = "usuario",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<Livro> livros = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public boolean isAdmin() {
        return admin;
    }

    public void setAdmin(boolean admin) {
        this.admin = admin;
    }

    public boolean autenticar(String login, String senha) {
        if (login == null || senha == null) {
            return false;
        }
        return this.login.equals(login) && this.senha.equals(senha);
    }

    public void adicionarLivro(Livro livro) {
        if (this.admin) {
            livro.setUsuario(this);
            livros.add(livro);
            System.out.println("Livro adicionado: " + livro.getTitulo());
        } else {
            System.out.println("Usuário sem permissão.");
        }
    }

    public void removerLivro(Livro livro) {
        if (this.admin) {
            livros.remove(livro);
            livro.setUsuario(null);
            System.out.println("Livro removido: " + livro.getTitulo());
        } else {
            System.out.println("Usuário sem permissão.");
        }
    }
}
