import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseInteractionPipe implements PipeTransform<string, number> {
  // Mapeo de acciones a números o enums (según lo que use tu servicio)
  private interactionTypes: Record<string, number> = {
    like: 1,
    compartir: 2,
    visto: 3,
  };

  /**
   * Parsea el valor de interacción a su enum correspondiente.
   * @param value deberia de ser el param del url
   * @returns el valor numerico correspondiente a la interaccion
   * @throws NotFoundException si la interacción no es válida
   */
  transform(value: string): number {
    const result = this.interactionTypes[value];
    if (!result) {
      throw new BadRequestException(
        `Interaction not supported, you should use one of the following: [ ${Object.keys(this.interactionTypes)} ]`,
      );
    }
    return result;
  }
}
