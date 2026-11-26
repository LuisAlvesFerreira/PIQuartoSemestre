-- Mantém a coluna alinhada com Livro.usuario, que é opcional no modelo.
ALTER TABLE livros
    MODIFY COLUMN fk_id_usuario BIGINT NULL;
