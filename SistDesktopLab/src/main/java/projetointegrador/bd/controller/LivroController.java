package projetointegrador.bd.controller;

import projetointegrador.bd.model.Livro;
import projetointegrador.bd.service.LivroService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/livros")

public class LivroController {
    private final LivroService service;

    public LivroController(LivroService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Livro>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Livro>> buscar(@PathVariable Long id) {
        Optional<Livro> aux = service.buscar(id);
        if (aux.isPresent()) {
            return ResponseEntity.ok(aux);
        }
        return ResponseEntity.notFound().build();
    }

}