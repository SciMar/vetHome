import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CreateTriageDto } from './dto/create-triage.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TriageService {
  private genAI: GoogleGenerativeAI;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.genAI = new GoogleGenerativeAI(
      this.configService.get<string>('GEMINI_API_KEY')!,
    );
  }

  async evaluar(dto: CreateTriageDto) {
    const mascota = await this.prisma.mascota.findUnique({
      where: { id: dto.mascotaId },
    });

    const especie = mascota?.especie || 'No especificada';
    const peso = mascota?.peso ? `${mascota.peso} kg` : 'No especificado';
    const edad = mascota?.fechaNacimiento
      ? this.calcularEdad(mascota.fechaNacimiento)
      : 'No especificada';

    console.log('Datos mascota para triage:', { especie, edad, peso });

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
- Especie: ${especie}
- Edad: ${edad}
- Peso: ${peso}
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

  private calcularEdad(fechaNacimiento: Date): string {
    const hoy = new Date();
    const meses =
      (hoy.getFullYear() - fechaNacimiento.getFullYear()) * 12 +
      (hoy.getMonth() - fechaNacimiento.getMonth());
    if (meses < 12) return `${meses} meses`;
    const anios = Math.floor(meses / 12);
    return anios === 1 ? '1 año' : `${anios} años`;
  }
}