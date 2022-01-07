export class DeveloperFqnException extends Error {
    constructor(message: string, value: unknown) {
        try {
            value = JSON.stringify(value);
        } catch (e) {
            value = `##typeof ${value}`;
        }
        super(`[FQN] - ${message}: ${value}`);
    }
}