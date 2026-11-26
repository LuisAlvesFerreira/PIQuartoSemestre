package projetointegrador.bd.model;

import jakarta.persistence.*;

@Entity
@Table(name = "temas")
public class Tema {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tema")
    private Long id;

    @Column(name = "nome_tema", nullable = false, length = 100)
    private String nomeTema;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomeTema() {
        return nomeTema;
    }

    public void setNomeTema(String nomeTema) {
        this.nomeTema = nomeTema;
    }

    @Override
    public String toString() {
        return "Tema{" +
                "id=" + id +
                ", nomeTema='" + nomeTema + '\'' +
                '}';
    }
}
