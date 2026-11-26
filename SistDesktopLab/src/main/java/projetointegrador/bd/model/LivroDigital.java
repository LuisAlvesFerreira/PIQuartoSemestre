package projetointegrador.bd.model;

import jakarta.persistence.*;

@Entity
@Table(name = "livro_digital")
@PrimaryKeyJoinColumn(name = "id_livro")
public class LivroDigital extends Livro {

    private String formato;

    private float tamanhoArquivo;

    public String getFormato() {
        return formato;
    }

    public void setFormato(String formato) {
        this.formato = formato;
    }

    public float getTamanhoArquivo() {
        return tamanhoArquivo;
    }

    public void setTamanhoArquivo(float tamanhoArquivo) {
        this.tamanhoArquivo = tamanhoArquivo;
    }
}