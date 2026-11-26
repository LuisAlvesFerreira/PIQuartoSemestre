package projetointegrador.bd;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import projetointegrador.bd.controller.LivroDigitalController;
import projetointegrador.bd.controller.LivroFisicoController;
import projetointegrador.bd.controller.PatrimonioImaterialController;
import projetointegrador.bd.controller.PatrimonioMaterialController;
import projetointegrador.bd.factory.LivroDigitalFactory;
import projetointegrador.bd.factory.LivroFisicoFactory;
import projetointegrador.bd.factory.PatrimonioImaterialFactory;
import projetointegrador.bd.factory.PatrimonioMaterialFactory;
import projetointegrador.bd.model.LivroDigital;
import projetointegrador.bd.model.LivroFisico;
import projetointegrador.bd.model.PatrimonioImaterial;
import projetointegrador.bd.model.PatrimonioMaterial;
import projetointegrador.bd.service.LivroDigitalService;
import projetointegrador.bd.service.LivroFisicoService;
import projetointegrador.bd.service.PatrimonioImaterialService;
import projetointegrador.bd.service.PatrimonioMaterialService;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.standaloneSetup;

class CadastroHttpTests {

    @Test
    void createsBookSubtypesThroughRestEndpoints() throws Exception {
        LivroFisicoService fisicoService = mock(LivroFisicoService.class);
        when(fisicoService.salvar(any(LivroFisico.class))).thenAnswer(call -> call.getArgument(0));
        MockMvc fisicoApi = standaloneSetup(new LivroFisicoController(fisicoService, new LivroFisicoFactory())).build();
        fisicoApi.perform(post("/livros_fisicos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "titulo": "Livro fisico teste",
                                  "autor": "Autora",
                                  "editora": "Editora",
                                  "ano": 2024,
                                  "numPaginas": 120,
                                  "localizacao": "Estante A"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.titulo").value("Livro fisico teste"))
                .andExpect(jsonPath("$.numPaginas").value(120));

        LivroDigitalService digitalService = mock(LivroDigitalService.class);
        when(digitalService.salvar(any(LivroDigital.class))).thenAnswer(call -> call.getArgument(0));
        MockMvc digitalApi = standaloneSetup(new LivroDigitalController(digitalService, new LivroDigitalFactory())).build();
        digitalApi.perform(post("/livros_digitais")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "titulo": "Livro digital teste",
                                  "autor": "Autor",
                                  "editora": "Editora",
                                  "ano": 2023,
                                  "formato": "EPUB",
                                  "tamanhoArquivo": 2.5
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.titulo").value("Livro digital teste"))
                .andExpect(jsonPath("$.formato").value("EPUB"));
    }

    @Test
    void createsPatrimoniesWithTombstoneDate() throws Exception {
        PatrimonioMaterialService materialService = mock(PatrimonioMaterialService.class);
        when(materialService.salvar(any(PatrimonioMaterial.class))).thenAnswer(call -> call.getArgument(0));
        MockMvc materialApi = standaloneSetup(new PatrimonioMaterialController(
                materialService, new PatrimonioMaterialFactory())).build();
        materialApi.perform(post("/patrimonios-materiais")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nome": "Patrimonio material teste",
                                  "dataTombamento": "2001-02-03",
                                  "tipo": "Edificacao"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.dataTombamento").value("2001-02-03"));

        PatrimonioImaterialService imaterialService = mock(PatrimonioImaterialService.class);
        when(imaterialService.salvar(any(PatrimonioImaterial.class))).thenAnswer(call -> call.getArgument(0));
        MockMvc imaterialApi = standaloneSetup(new PatrimonioImaterialController(
                imaterialService, new PatrimonioImaterialFactory())).build();
        imaterialApi.perform(post("/patrimonios-imateriais")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nome": "Patrimonio imaterial teste",
                                  "dataTombamento": "2010-03-10",
                                  "tipoManifestacao": "Festa"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.dataTombamento").value("2010-03-10"));
    }

    @Test
    void rejectsPatrimonyWithoutTombstoneDate() throws Exception {
        PatrimonioMaterialService service = mock(PatrimonioMaterialService.class);
        MockMvc api = standaloneSetup(new PatrimonioMaterialController(
                service, new PatrimonioMaterialFactory())).build();
        api.perform(post("/patrimonios-materiais")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nome": "Sem data"
                                }
                                """))
                .andExpect(status().isBadRequest());
    }
}
