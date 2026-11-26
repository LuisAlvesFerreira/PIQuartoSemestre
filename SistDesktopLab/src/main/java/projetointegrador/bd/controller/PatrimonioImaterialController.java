package projetointegrador.bd.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import projetointegrador.bd.dto.PatrimonioCadastroRequest;
import projetointegrador.bd.factory.PatrimonioImaterialFactory;
import projetointegrador.bd.model.PatrimonioImaterial;
import projetointegrador.bd.service.PatrimonioImaterialService;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/patrimonios-imateriais")
public class PatrimonioImaterialController {

    private final PatrimonioImaterialService service;
    private final PatrimonioImaterialFactory factory;

    public PatrimonioImaterialController(PatrimonioImaterialService service, PatrimonioImaterialFactory factory) {
        this.service = service;
        this.factory = factory;
    }

    @GetMapping
    public ResponseEntity<List<PatrimonioImaterial>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatrimonioImaterial> buscar(@PathVariable Long id) {
        return service.buscar(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<PatrimonioImaterial>> buscarPorManifestacao(
            @RequestParam String tipoManifestacao) {
        return ResponseEntity.ok(service.buscarPorManifestacao(tipoManifestacao));
    }

    @PostMapping
    public ResponseEntity<PatrimonioImaterial> salvar(@RequestBody PatrimonioCadastroRequest dados) {
        if (dados.dataTombamento() == null) {
            return ResponseEntity.badRequest().build();
        }
        PatrimonioImaterial salvo = service.salvar(factory.criar(dados));
        URI uri = URI.create("/patrimonios-imateriais/" + salvo.getId());
        return ResponseEntity.created(uri).body(salvo);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<PatrimonioImaterial> atualizar(@PathVariable Long id,
                                                        @RequestBody PatrimonioCadastroRequest dados) {
        if (dados.dataTombamento() == null) {
            return ResponseEntity.badRequest().build();
        }
        PatrimonioImaterial atualizado = service.atualizar(id, factory.criar(dados));
        return atualizado != null
                ? ResponseEntity.ok(atualizado)
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        return service.remover(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
