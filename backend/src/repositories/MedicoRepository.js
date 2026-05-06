import { Medico } from "../models/Medico.js";

export class MedicoRepository {
    constructor(db) {
        this.db = db;
        this.tabela = "medico";
    }

    mapToModel(row) {
        return new Medico(
            row.id,
            row.nome,
            row.crm,
            row.especialidade,
            row.telefone,
            row.email
        );
    }

    async buscarTodos() {
        const rows = await this.db.buscarTodos(this.tabela);
        return rows.map(row => this.mapToModel(row));
    }

    async buscarPorId(id) {
        const row = await this.db.buscarPorId(this.tabela, id);
        if (!row) return null;
        return this.mapToModel(row);
    }

    async criar(medico) {
        const id = await this.db.inserir(this.tabela, {
            nome: medico.nome,
            crm: medico.crm,
            especialidade: medico.especialidade,
            telefone: medico.telefone,
            email: medico.email
        });

        return id;
    }

    async atualizar(id, medico) {
        return await this.db.atualizar(this.tabela, id, {
            nome: medico.nome,
            crm: medico.crm,
            especialidade: medico.especialidade,
            telefone: medico.telefone,
            email: medico.email
        });
    }

    async deletar(id) {
        return await this.db.deletar(this.tabela, id);
    }  
}