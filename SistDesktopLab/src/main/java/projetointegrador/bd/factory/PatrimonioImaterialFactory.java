package projetointegrador.bd.factory;

import org.springframework.stereotype.Component;
import projetointegrador.bd.dto.PatrimonioCadastroRequest;
import projetointegrador.bd.model.PatrimonioImaterial;

@Component
public class PatrimonioImaterialFactory extends MonumentoFactory<PatrimonioImaterial> {

    @Override
    protected PatrimonioImaterial criarPatrimonio(PatrimonioCadastroRequest dados) {
        PatrimonioImaterial patrimonio = new PatrimonioImaterial();
        patrimonio.setTipoManifestacao(dados.tipoManifestacao());
        patrimonio.setLocalidade(dados.localidade());
        return patrimonio;
    }
}
