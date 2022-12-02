import chalk from "chalk";

export default class Logger {
    static info(message: string) {
        console.log(`${chalk.cyan('INFO')} ${chalk.gray(message)}`);
    }

    static warn(message: string) {
        console.warn(`${chalk.yellow('WARN')} ${chalk.gray(message)}`);
    }

    static error(message: string) {
        console.error(`${chalk.red('ERROR')} ${chalk.gray(message)}`);
    }
}