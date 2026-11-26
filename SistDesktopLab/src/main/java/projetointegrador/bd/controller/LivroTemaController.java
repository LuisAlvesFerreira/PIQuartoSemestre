package projetointegrador.bd.controller;

import projetointegrador.bd.model.LivroTema;
import projetointegrador.bd.service.LivroTemaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/livrotemas")

public class LivroTemaController {
    private final LivroTemaService service;

    public LivroTemaController(LivroTemaService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<LivroTema>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<LivroTema>> buscar(@PathVariable Long id) {
        Optional<LivroTema> aux = service.buscar(id);
        if (aux.isPresent()) {
            return ResponseEntity.ok(aux);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<LivroTema> salvar(@RequestBody LivroTema livroTema) {
        LivroTema salvo = service.salvar(livroTema);
        URI uri = URI.create("/livrotemas/" + salvo.getId());
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
    public ResponseEntity<LivroTema> atualizar(@PathVariable Long id, @RequestBody LivroTema livroTema) {
        LivroTema livrotemaAtualizado = service.atualiza(id, livroTema);
        if (livrotemaAtualizado != null) {
            return ResponseEntity.ok(livrotemaAtualizado);
        }
        return ResponseEntity.notFound().build();
    }
}