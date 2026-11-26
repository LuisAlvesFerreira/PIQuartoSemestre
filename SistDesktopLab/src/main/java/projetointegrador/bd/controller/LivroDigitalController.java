package projetointegrador.bd.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import projetointegrador.bd.dto.LivroCadastroRequest;
import projetointegrador.bd.factory.LivroDigitalFactory;
import projetointegrador.bd.model.LivroDigital;
import projetointegrador.bd.service.LivroDigitalService;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/livros_digitais")
public class LivroDigitalController {

    private final LivroDigitalService service;
    private final LivroDigitalFactory factory;

    public LivroDigitalController(LivroDigitalService service, LivroDigitalFactory factory) {
        this.service = service;
        this.factory = factory;
    }

    @GetMapping
    public ResponseEntity<List<LivroDigital>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @PostMapping
    public ResponseEntity<LivroDigital> salvar(
            @RequestBody LivroCadastroRequest dados) {
        if (dados.ano() < 1 || dados.tamanhoArquivo() == null || dados.tamanhoArquivo() < 0) {
            return ResponseEntity.badRequest().build();
        }

        LivroDigital salvo = service.salvar(factory.criar(dados));

        URI uri = URI.create("/livros_digitais/" + salvo.getId());

        return ResponseEntity.created(uri).body(salvo);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<LivroDigital> atualizar(@PathVariable Long id,
                                                  @RequestBody LivroCadastroRequest dados) {
        if (dados.ano() < 1 || dados.tamanhoArquivo() == null || dados.tamanhoArquivo() < 0) {
            return ResponseEntity.badRequest().build();
        }
        LivroDigital atualizado = service.atualizar(id, factory.criar(dados));
        return atualizado == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        return service.remover(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}