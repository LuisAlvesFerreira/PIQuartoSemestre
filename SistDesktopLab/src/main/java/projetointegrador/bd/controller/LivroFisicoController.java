package projetointegrador.bd.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import projetointegrador.bd.dto.LivroCadastroRequest;
import projetointegrador.bd.factory.LivroFisicoFactory;
import projetointegrador.bd.model.LivroFisico;
import projetointegrador.bd.service.LivroFisicoService;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/livros_fisicos")
public class LivroFisicoController {

    private final LivroFisicoService service;
    private final LivroFisicoFactory factory;

    public LivroFisicoController(LivroFisicoService service, LivroFisicoFactory factory) {
        this.service = service;
        this.factory = factory;
    }

    @GetMapping
    public ResponseEntity<List<LivroFisico>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @PostMapping
    public ResponseEntity<LivroFisico> salvar(
            @RequestBody LivroCadastroRequest dados) {
        if (dados.ano() < 1 || dados.numPaginas() == null || dados.numPaginas() < 1) {
            return ResponseEntity.badRequest().build();
        }

        LivroFisico salvo = service.salvar(factory.criar(dados));

        URI uri = URI.create("/livros_fisicos/" + salvo.getId());

        return ResponseEntity.created(uri).body(salvo);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<LivroFisico> atualizar(@PathVariable Long id,
                                                 @RequestBody LivroCadastroRequest dados) {
        if (dados.ano() < 1 || dados.numPaginas() == null || dados.numPaginas() < 1) {
            return ResponseEntity.badRequest().build();
        }
        LivroFisico atualizado = service.atualizar(id, factory.criar(dados));
        return atualizado == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        return service.remover(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
