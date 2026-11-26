package projetointegrador.bd.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import projetointegrador.bd.dto.PatrimonioCadastroRequest;
import projetointegrador.bd.factory.PatrimonioMaterialFactory;
import projetointegrador.bd.model.PatrimonioMaterial;
import projetointegrador.bd.service.PatrimonioMaterialService;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/patrimonios-materiais")
public class PatrimonioMaterialController {

    private final PatrimonioMaterialService service;
    private final PatrimonioMaterialFactory factory;

    public PatrimonioMaterialController(PatrimonioMaterialService service, PatrimonioMaterialFactory factory) {
        this.service = service;
        this.factory = factory;
    }

    @GetMapping
    public ResponseEntity<List<PatrimonioMaterial>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatrimonioMaterial> buscar(@PathVariable Long id) {
        return service.buscar(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<PatrimonioMaterial>> buscarPorTipo(@RequestParam String tipo) {
        return ResponseEntity.ok(service.buscarPorTipo(tipo));
    }

    @PostMapping
    public ResponseEntity<PatrimonioMaterial> salvar(@RequestBody PatrimonioCadastroRequest dados) {
        if (dados.dataTombamento() == null) {
            return ResponseEntity.badRequest().build();
        }
        PatrimonioMaterial salvo = service.salvar(factory.criar(dados));
        URI uri = URI.create("/patrimonios-materiais/" + salvo.getId());
        return ResponseEntity.created(uri).body(salvo);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<PatrimonioMaterial> atualizar(@PathVariable Long id,
                                                        @RequestBody PatrimonioCadastroRequest dados) {
        if (dados.dataTombamento() == null) {
            return ResponseEntity.badRequest().build();
        }
        PatrimonioMaterial atualizado = service.atualizar(id, factory.criar(dados));
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
