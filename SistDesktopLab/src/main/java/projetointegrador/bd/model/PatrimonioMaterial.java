package projetointegrador.bd.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "patrimonio_material")
@PrimaryKeyJoinColumn(name = "id_monumento")
public class PatrimonioMaterial extends Monumento {

    @Column(length = 300)
    private String endereco;

    @Column(length = 100)
    private String tipo;

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
}
