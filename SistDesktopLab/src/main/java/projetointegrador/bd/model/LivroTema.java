package projetointegrador.bd.model;

import jakarta.persistence.*;

@Entity
@Table(name = "livro_tema")
public class LivroTema {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tema_livro")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "fk_id_livro", nullable = false)
    private Livro livro;

    @ManyToOne
    @JoinColumn(name = "fk_id_tema", nullable = false)
    private Tema tema;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Livro getLivro() {
        return livro;
    }

    public void setLivro(Livro livro) {
        this.livro = livro;
    }

    public Tema getTema() {
        return tema;
    }

    public void setTema(Tema tema) {
        this.tema = tema;
    }

    @Override
    public String toString() {
        return "LivroTema{" +
                "id=" + id +
                ", livro=" + livro +
                ", tema=" + tema +
                '}';
    }
}
