package projetointegrador.bd.repository;

import projetointegrador.bd.model.LivroDigital;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LivroDigitalRepository extends JpaRepository<LivroDigital, Long> {
}