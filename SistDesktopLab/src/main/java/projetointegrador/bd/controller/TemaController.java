package projetointegrador.bd.controller;

import projetointegrador.bd.model.Tema;
import projetointegrador.bd.service.TemaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/temas")

public class TemaController {
    private final TemaService service;

    public TemaController(TemaService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Tema>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Tema>> buscar(@PathVariable Long id) {
        Optional<Tema> aux = service.buscar(id);
        if (aux.isPresent()) {
            return ResponseEntity.ok(aux);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Tema> salvar(@RequestBody Tema tema) {
        Tema salvo = service.salvar(tema);
        URI uri = URI.create("/temas/" + salvo.getId());
        return ResponseEntity.created(uri).body(salvo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        if (service.remove(id)) {
            return ResponseEntity.noContent().build(); // 204
        }
        return ResponseEntity.notFound().build(); // 404
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Tema> atualizar(@PathVariable Long id, @RequestBody Tema tema) {
        Tema temaAtualizado = service.atualiza(id, tema);
        if (temaAtualizado != null) {
            return ResponseEntity.ok(temaAtualizado);
        }
        return ResponseEntity.notFound().build();
    }
}