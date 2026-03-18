const sqlite3 = require('sqlite3')
const {open} = require('sqlite')

//criando uma função assíncrona.

const criarBanco = async ()=> {

    const db = await open({
        filename: './database.db',
        driver: sqlite3.Database
    })

//Criando a tabela de incidentes

await db.exec(`
    CREATE TABLE IF NOT EXISTS incidentes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo_problema TEXT,       --O que aconteceu (Buraco, Lixo, Luz...)
        localizacao TEXT,         --Onde aconteceu (rua, bairro)
        descricao TEXT,           --Detalhes da reclamação
        prioridade TEXT,          --Baixa, Média ou Alta
        nome_solicitante TEXT,    --Quem está avisando
        data_registro TEXT,       --Data em formato (ex: 16/03 16.03)
        hora_registro TEXT,       --Hora que foi registrado
        status_resolucao TEXT DEFAULT 'Pendente'
     )
    `);

    console.log("Banco de dados configurado: A tabela de registros urbanos está pronta. ");

//=============================
//Insert - C do CRUD - CREATE
//==============================

const checagem = await db.get( 'SELECT count (*) AS total FROM incidentes')

if (checagem.total === 0) {
    await db.exec(`INSERT INTO incidentes( tipo_problema, localizacao, descricao, prioridade, nome_solicitante, data_registro, hora_registro )
    VALUES ( 'Iluminação', 'Rua da Flores, 123, Bairro das Margaridas', 'Poste queimado há dias', 'Média', 'Ana Clara', '16/03/2026', '10:30am'),
    ( 'Buraco', 'Avenida Central, 456, Bairro dos Pinheiros', 'Buraco grande causando transtornos', 'Alta', 'Carlos Eduardo', '16/03/2026', '11:00am'),
    ( 'Lixo', 'Rua das Acácias, 789, Bairro dos Girassóis', 'Acúmulo de lixo há semanas', 'Baixa', 'Mariana Silva', '16/03/2026', '11:30am'),
    ( 'Árvore caída', 'Avenida das Palmeiras, 321, Bairro dos Jacarandás', 'Árvore bloqueando a rua após tempestade', 'Alta', 'Lucas Pereira', '16/03/2026', '12:00pm')
    `)
    
    } else {
    console.log(`Banco pronto com ${checagem.total} de incidentes`)
    }


//=============================
//Select - R do CRUD - READ
//==============================

const todosOsIncidentes = await db.all('SELECT * FROM incidentes')
console.table(todosOsIncidentes);

//Exemplo de SELECT especifico

const chamadosAna = await db.all(`SELECT * FROM incidentes WHERE nome_solicitante = 'Ana Clara'`);

console.table(chamadosAna);

//UPDATE

await db.run(`
    UPDATE incidentes
    SET status_resolucao = "Em Análise"
    WHERE data_registro = "16/03/2026"`)

console.log("Todas as reclamações do dia 16/03/2026 tiveram uma atualizaçção");

//UPDATE

await db.run(`
    UPDATE incidentes
    SET status_resolucao = "Resolvido"
    WHERE tipo_problema = "Buraco"
    `)

console.log("Todas as reclamações de buraco foram resolvidas");


//DELETE
await db.run(`DELETE FROM incidentes WHERE id = 2`)

console.log("Registro do ID 2 removido");


//Relatório/SELECT final

console.log("Relatório Atualizado(FINAL)")

const resultadoFinal = await db.all(`SELECT * FROM incidentes`);
console.table(resultadoFinal);



};

criarBanco()
