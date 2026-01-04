import { GoogleGenAI } from "@google/genai";
import { GeneratorConfig, BoardType } from '../types';

const getSystemInstruction = () => `
Eres un ingeniero experto en sistemas embebidos y Arduino. Tu objetivo es generar código C++ de Arduino claro, bien comentado y funcional.
Responde SIEMPRE en formato JSON estricto con dos campos: "explanation" (explicación en español) y "code" (el código fuente C++).
`;

export const generateArduinoCode = async (config: GeneratorConfig): Promise<{ code: string; explanation: string }> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key no encontrada. Asegúrate de que process.env.API_KEY esté configurada.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const isUno = config.board === BoardType.UNO;
  
  const prompt = `
    Genera un sketch de Arduino (.ino) para la placa: ${config.board}.
    
    Objetivo: Al detectar una pulsación en el pin digital ${config.pin}, activar la tecla de computadora: "${config.key}".
    Configuración eléctrica del botón: ${config.trigger}.
    
    CONTEXTO DE HARDWARE CRÍTICO:
    ${isUno ? 
      `CASO ARDUINO UNO (ATmega328P):
       - El UNO NO TIENE soporte USB HID nativo. No puede usar la librería Keyboard.h directamente.
       - SOLUCIÓN REQUERIDA: Comunicación Serial.
       
       Instrucciones para el campo "code" (C++):
       1. Inicializa Serial.begin(9600).
       2. Usa debounce para leer el botón.
       3. Cuando se presione, envía un mensaje simple: Serial.println("KEY:${config.key}");
       
       Instrucciones para el campo "explanation":
       1. Explica claramente que el Uno no es un teclado nativo y requiere un programa en la PC que "escuche" el puerto serie.
       2. PROVEE UN SCRIPT DE PYTHON COMPLETO (usando librerías 'pyserial' y 'pyautogui') que el usuario pueda ejecutar en su PC para leer el Serial del Arduino y presionar la tecla.
       3. Menciona que primero prueben el botón mirando el "Monitor Serie" en el Arduino IDE.` 
      : 
      `CASO ARDUINO LEONARDO/MICRO (ATmega32u4):
       - Estas placas tienen USB nativo.
       - SOLUCIÓN REQUERIDA: Librería Keyboard.h.
       
       Instrucciones para el campo "code" (C++):
       1. Incluye <Keyboard.h>.
       2. Inicializa Keyboard.begin().
       3. Implementa lógica de detección de estado (state change detection) para evitar repetición infinita si se mantiene presionado.
       4. Usa Keyboard.press() y Keyboard.release() para la tecla "${config.key}".`
    }

    Formato de Salida JSON Esperado:
    {
      "explanation": "Texto explicativo detallado. (Si es UNO, incluye aquí el código Python formateado).",
      "code": "El código fuente C++ completo para el IDE de Arduino."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: getSystemInstruction(),
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("Respuesta vacía de Gemini");

    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating code:", error);
    throw error;
  }
};