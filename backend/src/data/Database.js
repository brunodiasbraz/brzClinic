import mysql from "mysql2/promise";

export class Database {
  constructor(config) {
    this.pool = mysql.createPool({
      host: config.host || "127.0.0.1",
      port: config.port || 3306,
      user: config.user || "root",
      password: config.password || "",
      database: config.database || "brz_clinic",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      dateStrings: true,
    });
  }

  async query(sql, values = []) {
    try {
      const connection = await this.pool.getConnection();
      const [results] = await connection.query(sql, values);
      connection.release();
      return results;
    } catch (error) {
      console.error("Erro na query:", error);
      throw error;
    }
  }

  async execute(sql, values = []) {
    try {
      const connection = await this.pool.getConnection();
      const [results] = await connection.execute(sql, values);
      connection.release();
      return results;
    } catch (error) {
      console.error("Erro na execução:", error);
      throw error;
    }
  }

  async buscarPorId(tabela, id) {
    const sql = `SELECT * FROM ${tabela} WHERE id = ?`;
    const resultados = await this.query(sql, [id]);
    return resultados[0] || null;
  }

  async buscarTodos(tabela) {
    const sql = `SELECT * FROM ${tabela}`;
    return await this.query(sql);
  }

  async inserir(tabela, dados) {
    const campos = Object.keys(dados).join(", ");
    const valores = Object.values(dados);
    const placeholders = valores.map(() => "?").join(", ");
    const sql = `INSERT INTO ${tabela} (${campos}) VALUES (${placeholders})`;

    const resultado = await this.execute(sql, valores);
    return resultado.insertId;
  }

  async atualizar(tabela, id, dados) {
    const campos = Object.keys(dados)
      .map((k) => `${k} = ?`)
      .join(", ");
    const valores = [...Object.values(dados), id];
    const sql = `UPDATE ${tabela} SET ${campos} WHERE id = ?`;

    return await this.execute(sql, valores);
  }

  async deletar(tabela, id) {
    const sql = `DELETE FROM ${tabela} WHERE id = ?`;
    return await this.execute(sql, [id]);
  }

  async buscarPorCampo(tabela, campo, valor) {
    const sql = `SELECT * FROM ${tabela} WHERE ${campo} = ?`;
    return await this.query(sql, [valor]);
  }

  async fecharConexoes() {
    await this.pool.end();
  }
}
