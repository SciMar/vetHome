import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CreateTriageDto } from './dto/create-triage.dto';

@Injectable()
export class TriageService {
  private genAI: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    this.genAI = new GoogleGenerativeAI(
      this.configService.get<string>('GEMINI_API_KEY')!,
    );
  }

  async evaluar(dto: CreateTriageDto) {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

    const prompt = `
Eres un asistente veterinario de triage. Analiza los síntomas descritos y responde ÚNICAMENTE en JSON con este formato exacto:
{
  "nivel_urgencia": "ALTA" | "MEDIA" | "BAJA",
  "recomendacion": "texto breve con la recomendación",
  "posibles_causas": ["causa1", "causa2"],
  "ir_emergencia": true | false
}

Información de la mascota:
- Especie: ${dto.especie || 'No especificada'}
- Edad: ${dto.edad || 'No especificada'}
- Peso: ${dto.peso || 'No especificado'}
- Síntomas: ${dto.sintomas}

Responde solo con el JSON, sin texto adicional ni bloques de código.
    `;

    const result = await model.generateContent(prompt);
    const texto = result.response.text().trim();

    try {
      return JSON.parse(texto);
    } catch {
      return { raw: texto };
    }
  }
}
