package projetointegrador.bd.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "monumentos")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Monumento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_monumento")
    private Long id;

    @Column(nullable = false, length = 200)
    private String nome;

    @Column(name = "data_tombamento")
    private LocalDate dataTombamento;

    @Column(length = 1000)
    private String contexto;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public LocalDate getDataTombamento() {
        return dataTombamento;
    }

    public void setDataTombamento(LocalDate dataTombamento) {
        this.dataTombamento = dataTombamento;
    }

    public String getContexto() {
        return contexto;
    }

    public void setContexto(String contexto) {
        this.contexto = contexto;
    }
}
