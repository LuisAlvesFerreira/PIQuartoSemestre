package projetointegrador.bd.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "patrimonio_imaterial")
@PrimaryKeyJoinColumn(name = "id_monumento")
public class PatrimonioImaterial extends Monumento {

    @Column(name = "tipo_manifestacao", length = 100)
    private String tipoManifestacao;

    @Column(length = 200)
    private String localidade;

    public String getTipoManifestacao() {
        return tipoManifestacao;
    }

    public void setTipoManifestacao(String tipoManifestacao) {
        this.tipoManifestacao = tipoManifestacao;
    }

    public String getLocalidade() {
        return localidade;
    }

    public void setLocalidade(String localidade) {
        this.localidade = localidade;
    }
}
