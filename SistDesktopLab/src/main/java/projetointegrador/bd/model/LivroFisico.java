package projetointegrador.bd.model;

import jakarta.persistence.*;

@Entity
@Table(name = "livro_fisico")
@PrimaryKeyJoinColumn(name = "id_livro")
public class LivroFisico extends Livro {

    private int numPaginas;

    private String localizacao;

    public int getNumPaginas() {
        return numPaginas;
    }

    public void setNumPaginas(int numPaginas) {
        this.numPaginas = numPaginas;
    }

    public String getLocalizacao() {
        return localizacao;
    }

    public void setLocalizacao(String localizacao) {
        this.localizacao = localizacao;
    }
}