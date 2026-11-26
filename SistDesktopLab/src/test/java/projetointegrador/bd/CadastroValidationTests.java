package projetointegrador.bd;

import org.junit.jupiter.api.Test;
import org.springframework.web.bind.annotation.PostMapping;
import projetointegrador.bd.controller.LivroController;
import projetointegrador.bd.controller.LivroDigitalController;
import projetointegrador.bd.controller.LivroFisicoController;
import projetointegrador.bd.controller.MonumentoController;
import projetointegrador.bd.dto.LivroCadastroRequest;
import projetointegrador.bd.factory.LivroDigitalFactory;
import projetointegrador.bd.factory.LivroFisicoFactory;
import projetointegrador.bd.model.Livro;
import projetointegrador.bd.model.LivroDigital;
import projetointegrador.bd.service.LivroDigitalService;
import projetointegrador.bd.service.LivroFisicoService;

import java.lang.reflect.Modifier;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyNoInteractions;

class CadastroValidationTests {

    @Test
    void rejectsNonPositiveBookYearOnCreate() {
        LivroFisicoService service = mock(LivroFisicoService.class);
        LivroCadastroRequest dados = new LivroCadastroRequest("Título", "Autor", "Editora", 0, 1, "Estante", null, null);

        var response = new LivroFisicoController(service, new LivroFisicoFactory()).salvar(dados);

        assertEquals(400, response.getStatusCode().value());
        verifyNoInteractions(service);
    }

    @Test
    void rejectsNonPositiveBookYearForDigitalBooks() {
        LivroDigitalService service = mock(LivroDigitalService.class);
        LivroCadastroRequest dados = new LivroCadastroRequest("Título", "Autor", "Editora", -1, null, null, "EPUB", 2.5f);

        var response = new LivroDigitalController(service, new LivroDigitalFactory()).salvar(dados);

        assertEquals(400, response.getStatusCode().value());
        verifyNoInteractions(service);
    }

    @Test
    void monumentoIsOnlyAnAbstractParentWithoutCreateRoute() {
        assertTrue(Modifier.isAbstract(projetointegrador.bd.model.Monumento.class.getModifiers()));
        assertFalse(Arrays.stream(MonumentoController.class.getDeclaredMethods())
                .anyMatch(method -> method.isAnnotationPresent(PostMapping.class)));
    }

    @Test
    void livroIsOnlyAnAbstractParentWithoutCreateRoute() {
        assertTrue(Modifier.isAbstract(Livro.class.getModifiers()));
        assertFalse(Arrays.stream(LivroController.class.getDeclaredMethods())
                .anyMatch(method -> method.isAnnotationPresent(PostMapping.class)));
    }
}
