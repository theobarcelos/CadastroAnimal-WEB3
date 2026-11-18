use GESTAO_ANIMAL;

drop table dbo.VACINA, dbo.FABRICANTE, dbo.LOTE_VACINA; 

CREATE TABLE dbo.FABRICANTE (
    id_fabricante   INT IDENTITY(1,1) NOT NULL,
    nome            VARCHAR(100) NULL,
    pais            VARCHAR(60) NULL,

    CONSTRAINT PK_FABRICANTE PRIMARY KEY (id_fabricante)
);
GO

CREATE TABLE dbo.VACINA (
    id_vacina       INT IDENTITY(1,1) NOT NULL,
    nome            VARCHAR(150) NULL,
    descricao       VARCHAR(255) NULL,
    tipo_de_vacina VARCHAR(100) NULL, 
	especie_do_animal VARCHAR(100) NULL, 
	arm_temp_ideal VARCHAR(100) NULL,
	armazenamento_local VARCHAR(100) NULL

    CONSTRAINT PK_VACINA PRIMARY KEY (id_vacina),
    CONSTRAINT UQ_VACINA_NOME UNIQUE (nome)
);
GO

CREATE TABLE dbo.LOTE_VACINA (
    id_lote_vacina  INT IDENTITY(1,1) NOT NULL,
    id_vacina       INT NULL,
    id_fabricante   INT NULL,
    numero_lote     VARCHAR(50) NULL,
    data_fabricacao DATE NULL,
    data_validade   DATE NULL,
    quantidade_total INT NULL,
    quantidade_disponivel INT NULL,
    data_de_entrada_vacina DATE NULL,
	responsavel_aplicacao VARCHAR(100) NULL,
	fornecedor_vacina VARCHAR(150) NULL,
	nota_fiscal_vacina VARCHAR(50) NULL,
	valor_unitario_vacina DECIMAL(10,2) NULL,
	valor_total_vacina DECIMAL(10,2) NULL,
    quantidade_recebida INT NULL

    CONSTRAINT PK_LOTE_VACINA PRIMARY KEY (id_lote_vacina),
    CONSTRAINT FK_LOTE_VACINA_VACINA
        FOREIGN KEY (id_vacina) REFERENCES dbo.VACINA(id_vacina),
    CONSTRAINT FK_LOTE_VACINA_FABRICANTE
        FOREIGN KEY (id_fabricante) REFERENCES dbo.FABRICANTE(id_fabricante),
    CONSTRAINT UQ_LOTE_VACINA_NUMERO UNIQUE (numero_lote),
    CONSTRAINT CK_LOTE_VACINA_QTD CHECK (
        quantidade_total >= 0 AND
        quantidade_disponivel >= 0 AND
        quantidade_disponivel <= quantidade_total
    ),
    CONSTRAINT CK_LOTE_VACINA_DATAS CHECK (
        data_fabricacao IS NULL OR data_validade >= data_fabricacao
    )
);