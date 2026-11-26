package projetointegrador.bd.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import projetointegrador.bd.model.Monumento;
import projetointegrador.bd.service.MonumentoService;

import java.util.List;

@RestController
@RequestMapping("/monumentos")
public class MonumentoController {

    private final MonumentoService service;

    public MonumentoController(MonumentoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Monumento>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Monumento> buscar(@PathVariable Long id) {
        return service.buscar(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Monumento>> buscarPorNome(@RequestParam String nome) {
        return ResponseEntity.ok(service.buscarPorNome(nome));
    }

}
