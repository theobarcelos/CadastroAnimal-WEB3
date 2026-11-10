//https://expressjs.com/
// Módulo (Biblioteca de criação de servidores)
const express = require('express');

// cors
const cors = require('cors');
const { sql, Conectar } = require('./database.js');

const app = express();

// Porta de saída do servidor
const port = 3010;

// Retornar o agente (navegador) em tipo json resposta
app.use(express.json());

// Aplicando cors no agente (navegador)
app.use(cors());

// Saída de resposta são chamado de rotas
app.get('/qtd', async (req, res) => {
  // Fazer conexão com o Banco
  try {
    const cn = await Conectar();
    const resultado = await cn.request().query("SELECT COUNT(*) AS total FROM ANIMAL");
    res.json({ 'qtd': resultado.recordset[0].total });
  } catch (e) {
    res.json({ 'erro': e });
  }

}) // Callback (função chamando ela mesma ou outra função)

app.get("/qtdVacina", async (req, res) => {
  try {
    const cn = await Conectar();
    const resultado = await cn.request().query("SELECT COUNT(*) AS total FROM dbo.VACINA");
    res.json({ 'qtd': resultado.recordset[0].total});
  } catch(e) {
    res.json({ 'erro': e.message});
  }

})

app.get("/carregarVacina", async (req, res) => {
  try {
    const cn = await Conectar();
    const resultado = await cn
    .request()
    .query(`
      SELECT 
        v.id_vacina, 
        v.nome, 
        v.tipo_de_vacina, 
        v.especie_do_animal,
        f.nome as nome_fabricante,
        l.numero_lote,
        l.data_validade,
        l.quantidade_recebida 
      FROM 
        dbo.VACINA v
      INNER JOIN dbo.FABRICANTE f ON v.id_vacina = f.id_fabricante
      INNER JOIN dbo.LOTE_VACINA l ON v.id_vacina = l.id_lote_vacina`);
    res.json(
      resultado.recordset
    )
  } catch (e) {
    res.json({ 'erro': e.message })
  }
})

// <<==== Inserir Animais ====>>
app.post("/cadAnimais", async (req, res) => {
  try {
    // Fazer conexão API
    const nome = req.body.nome;
    const rg = req.body.rg;
    const tipo = req.body.tipo;
    const porte = req.body.porte;
    const raca = req.body.raca;
    const idade = req.body.idade;
    const sexo = req.body.sexo;

    const cn = await Conectar();
    const campo = cn.request()
      .input("nome", sql.VarChar(100), nome)
      .input("rg", sql.VarChar(100), rg)
      .input("tipo", sql.VarChar(100), tipo)
      .input("porte", sql.VarChar(100), porte)
      .input("raca", sql.VarChar(100), raca)
      .input("idade", sql.Int, idade)
      .input("sexo", sql.Char(1), sexo)
      .query(`
      INSERT INTO ANIMAL(
          nome, 
          rg, 
          especie, 
          porte, 
          raca, 
          idade,
          sexo
      ) 
      OUTPUT INSERTED.*
      VALUES(
            @nome,
            @rg,
            @tipo,
            @porte,  
            @raca, 
            @idade, 
            @sexo
        )    
      `)
    // resposta
    res.status(201).json({
      "MS": "CADASTRADO",
      "campos": campo.recordset[0]
    })
  } catch (e) {
    res.json({
      "erro": e
    });
  }
})

// <<==== Inserir Vacinas ====>>
app.post("/cadVacinas", async (req, res) => {
  try {
    // Fazer conexão API
    const nomeVacina = req.body.nomeVacina;
    const tipoVacina = req.body.tipoVacina;
    const especie = req.body.especie;
    const fabricante = req.body.fabricante;
    const descricao = req.body.descricao;
    const numeroLote = req.body.numeroLote;
    const dataFabricacao = req.body.dataFabricacao;
    const dataValidade = req.body.dataValidade;
    const quantidadeRecebida = req.body.quantidadeRecebida
    const dataEntrada = req.body.dataEntrada;
    const responsavel = req.body.responsavel;
    const fornecedor = req.body.fornecedor;
    const notaFiscal = req.body.notaFiscal;
    const valorUnitario = req.body.valorUnitario;
    const valorTotal = req.body.valorTotal;
    const temperatura = req.body.temperatura;
    const localArmazenamento = req.body.localArmazenamento;


    const cn = await Conectar();
    
    const campo = await cn.request()
      .input("nomeVacina", sql.VarChar(150), nomeVacina)
      .input("tipoVacina", sql.VarChar(100), tipoVacina)
      .input("especie", sql.VarChar(100), especie)
      .input("fabricante", sql.VarChar(100), fabricante)
      .input("descricao", sql.VarChar(255), descricao)
      .input("numeroLote", sql.VarChar(50), numeroLote)
      .input("dataFabricacao", sql.Date, dataFabricacao)
      .input("dataValidade", sql.Date, dataValidade)
      .input("quantidadeRecebida", sql.Int, quantidadeRecebida)
      .input("dataEntrada", sql.Date, dataEntrada)
      .input("responsavel", sql.VarChar(100), responsavel)
      .input("fornecedor", sql.VarChar(150), fornecedor)
      .input("notaFiscal", sql.VarChar(50), notaFiscal)
      .input("valorUnitario", sql.Decimal(10, 2), valorUnitario)
      .input("valorTotal", sql.Decimal(10, 2), valorTotal)
      .input("temperatura", sql.VarChar(100), temperatura)
      .input("localArmazenamento", sql.VarChar(100), localArmazenamento)
      .query(`
      INSERT INTO VACINA(
          nome,
          tipo_de_vacina,
          especie_do_animal,
          descricao,
          arm_temp_ideal,
          armazenamento_local
      ) 
      OUTPUT INSERTED.*
      VALUES(
            @nomeVacina,
            @tipoVacina,
            @especie,
            @descricao,
            @temperatura,
            @localArmazenamento
        )
      DECLARE @id_vacina INT = SCOPE_IDENTITY()

      INSERT INTO FABRICANTE(
          nome
        )
      OUTPUT INSERTED.*
      VALUES(
          @fabricante
        )
      DECLARE @id_fabricante INT = SCOPE_IDENTITY()
            
        INSERT INTO LOTE_VACINA(
            numero_lote,
            data_fabricacao,
            data_validade,
            quantidade_recebida,
            data_de_entrada_vacina,
            responsavel_aplicacao,
            fornecedor_vacina,
            nota_fiscal_vacina,
            valor_unitario_vacina,
            valor_total_vacina,
            id_vacina,
            id_fabricante
        )
        OUTPUT INSERTED.*
        VALUES(
            @numeroLote,
            @dataFabricacao,
            @dataValidade,
            @quantidadeRecebida,
            @dataEntrada,
            @responsavel,
            @fornecedor,
            @notaFiscal,
            @valorUnitario,
            @valorTotal,
            @id_vacina,
            @id_fabricante
        )`
      )
    // resposta
    res.status(201).json({
      "MS": "VACINA CADASTRADA",
      "vacina": campo.recordsets[0][0],
      "lote": campo.recordsets[1][0],
      "fabricante": campo.recordsets[2][0]
    })
  } catch (e) {
    res.status(500).json({
      "erro": e.message
    });
  }
})


// Inserir dados
app.post("/INSERT", async (req, res) => {
  const nome = req.body.nome;
  const email = req.body.email;
  const telefone = req.body.telefone;
  const senha = req.body.senha;
  const cpf_cnpj = req.body.cpf_cnpj;
  const tipo_pessoa = req.body.tipo_pessoa;
  const data_nasc = req.body.data_nasc;

  // Conexão
  const cn = await Conectar();

  // SQL String
  const resultado = await cn
    .request()
    .input('nome', sql.VarChar(100), nome)
    .input('email', sql.VarChar(100), email)
    .input('telefone', sql.VarChar(20), telefone)
    .input('senha', sql.VarChar(255), senha)
    .input('cpf_cnpj', sql.VarChar(18), cpf_cnpj)
    .input('tipo_pessoa', sql.Char(1), tipo_pessoa)
    .input('data_nasc', sql.Date, data_nasc)
    .query()


  res.json({ "Nome": nome });
  res.json({ "E-mail": email });
  res.json({ "Telefone": telefone });
  res.json({ "Senha": senha });
  res.json({ "CPF | CNPJ": cpf_cnpj });
  res.json({ "Tipo de pessoa": tipo_pessoa });
  res.json({ "Data de Nascimento": data_nasc });

});

// CRIAR A EXECUÇÃO DO SERViDOR
app.listen(port, () => {
  console.log(`servidor http://localhost:${port}`);
})

// delete

app.delete("/usuario/:id", async (req, res) => {
  // parametro via http (url)
  const id = parseInt(req.params.id);

  const cn = await Conectar();
  const resultado = await cn.request()
    .input('id', sql.Int, id)
    .query(`
      DELETE FROM USUARIO
      OUTPUT DELETED. *
        WHERE id_usuario = @id
    `)

  // resultado.rowAffected[0]
  if (resultado.recordset.length === 0) {
    res.json({ "mensagem": "não encontrado nenhum usuário!" })
  }
  else {
    res.json({ " mensagem": "deletado!" })
  }

  // mandar resposta para usuario
  res.json({
    "id": id
  });
})


app.get('/vacina/:id', async (req, resp) => {
    try {
        // Pegar ID da URL
        const id = parseInt(req.params.id);

        // FAZER  A CONTAGEM DE REGISTRO
        const cn = await Conectar();
        const resultado = await cn.request()
           .input('id', sql.Int, id)
           .query("SELECT *  FROM VACINA WHERE id_vacina = @id");
        resp.json(resultado.recordset[0]);
    }
    catch (error) {
        resp.json({ "tipo de erro ": error })
    }
})

// DELETE
app.delete('/deletevacina/:id', async (req, res) => {
    try {
        // Pegar o ID da URL
        const id = parseInt(req.params.id);
        // Conectar ao SQL Server
        const cn = await Conectar();
        // Executar DELETE
        const result = await cn
            .request()
            .input('id', sql.Int, id)
            .query(`
                DELETE FROM VACINA
                OUTPUT DELETED.*
                WHERE id_vacina = @id

                DELETE FROM LOTE_VACINA
                OUTPUT DELETED.*
                WHERE id_vacina = @id
                `);

        // Verificar se encontrou a vacina
        if (result.recordset.length === 0) {
            return res.status(404).json({
                mensagem: 'Vacina não encontrada'
            });

        }

        // Retornar confirmação
        res.status(200).json({
            mensagem: 'Vacina excluída com sucesso!',
            vacina: result.recordset[0]
        });

    } catch (erro) {

        console.error('Erro:', erro);

        res.status(500).json({
            erro: 'Erro ao excluir vacina',
            detalhe: erro.message
        });

    }

});