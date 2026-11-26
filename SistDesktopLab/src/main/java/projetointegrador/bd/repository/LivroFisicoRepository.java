package projetointegrador.bd.repository;

import org.springframework.stereotype.Repository;
import projetointegrador.bd.model.LivroDigital;
import projetointegrador.bd.model.LivroFisico;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface LivroFisicoRepository
        extends JpaRepository<LivroFisico, Long> {

    //método personalidado que procura o livro pela sua localizaçãp
    List<LivroFisico> findByLocalizacao(String localizacao);

}