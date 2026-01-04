export enum BoardType {
  UNO = 'Arduino Uno',
  LEONARDO = 'Arduino Leonardo/Micro'
}

export enum TriggerType {
  PULLUP = 'INPUT_PULLUP (Botón a Tierra)',
  PULLDOWN = 'INPUT (Botón a 5V con resistencia)'
}

export interface GeneratorConfig {
  board: BoardType;
  pin: string;
  key: string;
  trigger: TriggerType;
}

export interface GenerationResponse {
  code: string;
  explanation: string;
}
