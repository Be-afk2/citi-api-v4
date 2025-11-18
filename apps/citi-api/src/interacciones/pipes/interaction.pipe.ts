import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseInteractionPipe implements PipeTransform {
  // Mapeo de acciones a números o enums (según lo que use tu servicio)
  private interactionTypes = {
    like: 1,
    compartir: 2,
    visto: 3,
  };

  /**
   * Parsea el valor de interacción a su enum correspondiente.
   * @param value deberia de ser el param del url
   * @returns Enum InteractionEnum correspondiente
   */
  transform(value: any) {
    const result = this.interactionTypes[value];

    if (!result) {
      throw new NotFoundException(
        `Interaction not supported, you should use one of the following: [ ${Object.keys(this.interactionTypes)} ]`,
      );
    }
    return result;
  }
}
