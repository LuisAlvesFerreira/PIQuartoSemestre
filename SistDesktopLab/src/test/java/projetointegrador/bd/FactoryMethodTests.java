package projetointegrador.bd;

import org.junit.jupiter.api.Test;
import projetointegrador.bd.dto.LivroCadastroRequest;
import projetointegrador.bd.dto.PatrimonioCadastroRequest;
import projetointegrador.bd.factory.LivroDigitalFactory;
import projetointegrador.bd.factory.LivroFisicoFactory;
import projetointegrador.bd.factory.PatrimonioImaterialFactory;
import projetointegrador.bd.factory.PatrimonioMaterialFactory;
import projetointegrador.bd.model.LivroDigital;
import projetointegrador.bd.model.LivroFisico;
import projetointegrador.bd.model.PatrimonioImaterial;
import projetointegrador.bd.model.PatrimonioMaterial;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;

class FactoryMethodTests {

    @Test
    void createsBookSubtypesWithCommonAndSpecificFields() {
        LivroCadastroRequest dados = new LivroCadastroRequest(
                "Título", "Autora", "Editora", 2024, 120, "Estante A", "EPUB", 2.5f);

        LivroFisico fisico = new LivroFisicoFactory().criar(dados);
        LivroDigital digital = new LivroDigitalFactory().criar(dados);

        assertEquals("Título", fisico.getTitulo());
        assertEquals(120, fisico.getNumPaginas());
        assertEquals("Estante A", fisico.getLocalizacao());
        assertEquals("Título", digital.getTitulo());
        assertEquals("EPUB", digital.getFormato());
        assertEquals(2.5f, digital.getTamanhoArquivo(), 0.0001f);
    }

    @Test
    void createsHeritageSubtypesWithSharedTombstoneData() {
        PatrimonioCadastroRequest dados = new PatrimonioCadastroRequest(
                "Bem cultural", LocalDate.of(2001, 2, 3), "Contexto", "Rua 1",
                "Edificação", "Festa", "Centro");

        PatrimonioMaterial material = new PatrimonioMaterialFactory().criar(dados);
        PatrimonioImaterial imaterial = new PatrimonioImaterialFactory().criar(dados);

        assertEquals("Bem cultural", material.getNome());
        assertEquals(dados.dataTombamento(), material.getDataTombamento());
        assertEquals("Edificação", material.getTipo());
        assertEquals(dados.dataTombamento(), imaterial.getDataTombamento());
        assertEquals("Festa", imaterial.getTipoManifestacao());
        assertEquals("Centro", imaterial.getLocalidade());
    }
}
