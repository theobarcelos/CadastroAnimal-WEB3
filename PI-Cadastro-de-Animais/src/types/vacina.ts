export interface Vacina { 
  id_vacina: number;

  nome: string;
  tipo_de_vacina: string;
  especie_do_animal: string;
  nome_fabricante: string;

  numero_lote: string;
  data_validade: string;
  quantidade_recebida: number;

  status: string;

  fornecedor: string;
  responsavel: string;
  dataEntrada: string;
  dataFabricacao: string;
  notaFiscal: string;

  valorUnitario: number;
  valorTotal: number;

  temperatura: string;
  localArmazenamento: string;
}

