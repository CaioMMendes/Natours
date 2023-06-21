// interface Err extends Error {
//   status?: string;
//   statusCode?: number;
// }

class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  constructor(message: string, statusCode: number) {
    //Em resumo, o super() é usado para chamar o construtor da classe pai e
    //garantir que tudo seja configurado corretamente antes de adicionar
    //qualquer personalização na classe filha.
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
