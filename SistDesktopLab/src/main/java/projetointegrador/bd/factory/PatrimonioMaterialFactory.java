package projetointegrador.bd.factory;

import org.springframework.stereotype.Component;
import projetointegrador.bd.dto.PatrimonioCadastroRequest;
import projetointegrador.bd.model.PatrimonioMaterial;

@Component
public class PatrimonioMaterialFactory extends MonumentoFactory<PatrimonioMaterial> {

    @Override
    protected PatrimonioMaterial criarPatrimonio(PatrimonioCadastroRequest dados) {
        PatrimonioMaterial patrimonio = new PatrimonioMaterial();
        patrimonio.setEndereco(dados.endereco());
        patrimonio.setTipo(dados.tipo());
        return patrimonio;
    }
}
