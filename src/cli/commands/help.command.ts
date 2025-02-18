import chalk from 'chalk';
import { Command } from './command.interface.js';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(`
        ${chalk.bold.magentaBright('Программа для подготовки данных для REST API сервера.')}
        ${chalk.redBright('Примеры:')}
            ${chalk.cyan('cli.js --<command> [--arguments]')}
        ${chalk.redBright('Команды:')}
            ${chalk.cyan('--version')}:                    ${chalk.black('# выводит номер версии (показывает текущую версию проекта)')}
            ${chalk.cyan('--help')}:                       ${chalk.black('# печатает этот текст (выводит подсказку со списком всех команд)')}
            ${chalk.cyan('--import')} <path>:              ${chalk.black('# импортирует данные из TSV (по пути path парсит данные из файла tsv для моковых данных)')}
            ${chalk.cyan('--generate')} <n> <path> <url>:  ${chalk.black('# генерирует произвольное количество тестовых данных')}
    `);
  }
}
